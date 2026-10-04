<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import FormStatusBadge from './FormStatusBadge.svelte';

  let loading = $state(true);
  let saving = $state(false);
  let record = $state<any>(null);
  let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');

  let currentCourse = $state('algoritmos');
  let currentPeriod = $state('2026-3');
  
  let newRecordConfig = $state({
    schedule: '6:30 PM a 8:30 PM',
    dayOfWeek: 'martes',
    startDate: '',
    endDate: ''
  });

  onMount(loadRecord);

  async function loadRecord() {
    loading = true;
    try {
      const docs = await adminApi.listContentTracking({ course: currentCourse, period: currentPeriod });
      if (docs.length > 0) {
        record = docs[0];
      } else {
        record = null;
      }
    } catch (e) {
      console.error(e);
      record = null;
    } finally {
      loading = false;
    }
  }

  async function startTracking() {
    saving = true;
    try {
      const payload = {
        course: currentCourse,
        period: currentPeriod,
        ...newRecordConfig,
        sessions: [
          { number: 1, date: newRecordConfig.startDate || new Date().toISOString().split('T')[0], topicAndGoal: '' }
        ]
      };
      record = await adminApi.createContentTracking(payload);
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  function addSession() {
    if (!record || record.status === 'cerrado') return;
    const nextNum = record.sessions.length > 0 ? record.sessions[record.sessions.length - 1].number + 1 : 1;
    record.sessions = [...record.sessions, { number: nextNum, date: '', topicAndGoal: '', teacherSigned: false, coordinatorSigned: false }];
  }

  async function saveDraft() {
    saving = true;
    try {
      const updated = await adminApi.updateContentTracking(record._id, { sessions: record.sessions, endDate: record.endDate });
      record = updated;
      alert('Borrador guardado');
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function signSession(index: number, signType: 'teacher' | 'coordinator') {
    saving = true;
    try {
      const updated = await adminApi.signContentTracking(record._id, { sessionIndex: index, signType });
      record = updated;
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function closeTracking() {
    if (!confirm('¿Está seguro de cerrar este control? Ya no se podrán agregar más sesiones.')) return;
    saving = true;
    try {
      const updated = await adminApi.updateContentTracking(record._id, { status: 'cerrado' });
      record = updated;
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }
</script>

<div class="tracking-container">
  <div class="filters">
    <div class="form-group">
      <label>Curso</label>
      <select bind:value={currentCourse} onchange={loadRecord}>
        <option value="algoritmos">Algoritmos</option>
        <option value="desarrollo-web-1">Desarrollo Web 1</option>
        <option value="desarrollo-web-2">Desarrollo Web 2</option>
      </select>
    </div>
    <div class="form-group">
      <label>Periodo</label>
      <input type="text" bind:value={currentPeriod} onchange={loadRecord} />
    </div>
  </div>

  {#if loading}
    <p class="loading">Cargando control...</p>
  {:else if !record}
    {#if !isPrivileged}
    <div class="new-session card-inline">
      <h4>Iniciar Control de Contenidos (F5)</h4>
      <div class="session-form">
        <div class="form-group">
          <label>Horario</label>
          <input type="text" bind:value={newRecordConfig.schedule} placeholder="Ej. 6:30 PM a 8:30 PM" />
        </div>
        <div class="form-group">
          <label>Día</label>
          <select bind:value={newRecordConfig.dayOfWeek}>
            <option value="lunes">Lunes</option>
            <option value="martes">Martes</option>
            <option value="miercoles">Miércoles</option>
            <option value="jueves">Jueves</option>
            <option value="viernes">Viernes</option>
            <option value="sabado">Sábado</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fecha Inicio</label>
          <input type="date" bind:value={newRecordConfig.startDate} />
        </div>
        <button class="btn btn-primary mt-auto" onclick={startTracking} disabled={saving}>
          🚀 Iniciar Seguimiento
        </button>
      </div>
    </div>
    {:else}
      <p class="empty">No hay control de contenidos iniciado para este curso.</p>
    {/if}
  {:else}
    <div class="record-card">
      <div class="record-header">
        <div class="record-info">
          <h4>Control de Contenidos — {currentCourse}</h4>
          <p class="text-sm">
            Docente: {record.teacher?.full_name} | {record.dayOfWeek} {record.schedule} | 
            Inicio: {record.startDate ? new Date(record.startDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div class="record-actions">
          <FormStatusBadge status={record.status} />
          {#if record.status === 'activo' && (!isPrivileged || record.teacher?._id === $currentUser?.id)}
            <button class="btn btn-sm btn-outline" onclick={closeTracking} disabled={saving}>🔒 Finalizar Semestre</button>
          {/if}
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="tracking-table">
          <thead>
            <tr>
              <th width="80">Sesión N°</th>
              <th width="140">Fecha</th>
              <th>Tema Tratado y Objetivo Logrado</th>
              <th width="120" class="center">Firma Docente</th>
              <th width="120" class="center">Firma Coord.</th>
            </tr>
          </thead>
          <tbody>
            {#each record.sessions as session, i}
              <tr>
                <td class="center"><strong>{session.number}</strong></td>
                <td>
                  <input type="date" bind:value={session.date} 
                         disabled={record.status === 'cerrado' || session.teacherSigned || isPrivileged} 
                         class="w-full" />
                </td>
                <td>
                  <textarea bind:value={session.topicAndGoal} 
                            disabled={record.status === 'cerrado' || session.teacherSigned || isPrivileged} 
                            rows="2" class="w-full"></textarea>
                </td>
                <td class="center">
                  {#if session.teacherSigned}
                    <span class="badge badge-purple">✍️ Firmado</span>
                  {:else if !isPrivileged && record.status !== 'cerrado'}
                    <button class="btn btn-sm btn-outline" onclick={() => signSession(i, 'teacher')} disabled={saving || !session.date || !session.topicAndGoal}>
                      Firmar
                    </button>
                  {:else}
                    <span class="text-gray">-</span>
                  {/if}
                </td>
                <td class="center">
                  {#if session.coordinatorSigned}
                    <span class="badge badge-green">✅ Visto</span>
                  {:else if isPrivileged && record.status !== 'cerrado' && session.teacherSigned}
                    <button class="btn btn-sm btn-green" onclick={() => signSession(i, 'coordinator')} disabled={saving}>
                      Revisar
                    </button>
                  {:else}
                    <span class="text-gray">-</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      {#if record.status === 'activo' && !isPrivileged}
        <div class="record-footer">
          <button class="btn btn-outline" onclick={addSession} disabled={saving}>+ Agregar Sesión</button>
          <button class="btn btn-primary" onclick={saveDraft} disabled={saving}>💾 Guardar Cambios (Sin firmar)</button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .tracking-container { font-size: 0.9rem; }
  .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, select, textarea { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; }
  input:disabled, textarea:disabled { background: transparent; border-color: transparent; resize: none; color: #334155; }
  .w-full { width: 100%; box-sizing: border-box; }
  
  .card-inline { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; }
  .card-inline h4 { margin: 0 0 1rem; color: #0f172a; font-size: 1.1rem; }
  .session-form { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
  .mt-auto { margin-top: auto; }
  
  .record-card { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; }
  .record-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .record-info h4 { margin: 0 0 0.25rem; font-size: 1.15rem; color: #0f172a; }
  .record-info .text-sm { margin: 0; color: #64748b; font-size: 0.85rem; }
  .record-actions { display: flex; gap: 1rem; align-items: center; }
  
  .table-responsive { overflow-x: auto; }
  table.tracking-table { width: 100%; border-collapse: collapse; }
  th { padding: 0.75rem; color: #334155; font-weight: 600; border: 1px solid #e2e8f0; background: #f8fafc; text-align: left; }
  td { padding: 0.5rem; border: 1px solid #f1f5f9; vertical-align: top; }
  
  .center { text-align: center; }
  
  .record-footer { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover { background: #e2e8f0; }
  .btn-green { background: #16a34a; color: white; }
  .btn-green:hover:not(:disabled) { background: #15803d; }
  .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
  .badge-purple { background: #f3e8ff; color: #6b21a8; }
  .badge-green { background: #dcfce7; color: #166534; }
  
  .text-gray { color: #94a3b8; }
  .loading, .empty { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }
</style>
