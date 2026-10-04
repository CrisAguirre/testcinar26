<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import FormStatusBadge from './FormStatusBadge.svelte';

  let loading = $state(true);
  let saving = $state(false);
  let records = $state<any[]>([]);
  let currentCourse = $state('algoritmos');
  let currentPeriod = $state('2026-3');
  
  let newRecord = $state({
    sessionNumber: 1,
    date: new Date().toISOString().split('T')[0],
    schedule: '6:30 PM a 8:30 PM',
    dayOfWeek: 'martes',
    entries: [] as any[]
  });

  let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');

  onMount(loadRecords);

  async function loadRecords() {
    loading = true;
    try {
      records = await adminApi.listAttendance({ course: currentCourse, period: currentPeriod });
      if (records.length > 0) {
        newRecord.sessionNumber = records[0].sessionNumber + 1; // Auto increment based on latest
      } else {
        newRecord.sessionNumber = 1;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  async function startNewSession() {
    saving = true;
    try {
      const payload = {
        course: currentCourse,
        period: currentPeriod,
        ...newRecord
      };
      await adminApi.createAttendance(payload);
      await loadRecords();
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function updateStatus(recordId: string, studentId: string, status: string) {
    const record = records.find(r => r._id === recordId);
    if (!record || record.status === 'cerrado') return;
    
    // Optimistic update
    const entry = record.entries.find((e: any) => e.student._id === studentId);
    if (entry) entry.status = status;
    
    try {
      const payload = { entries: record.entries.map((e: any) => ({ student: e.student._id, status: e.status })) };
      const updated = await adminApi.updateAttendance(recordId, payload);
      // Replace in array
      const idx = records.findIndex(r => r._id === recordId);
      if (idx !== -1) records[idx] = updated;
    } catch (e: any) {
      alert(e.message);
      await loadRecords(); // Revert on error
    }
  }

  async function closeSession(recordId: string) {
    if (!confirm('¿Está seguro de cerrar esta planilla? Ya no podrá modificarla.')) return;
    try {
      const updated = await adminApi.closeAttendance(recordId);
      const idx = records.findIndex(r => r._id === recordId);
      if (idx !== -1) records[idx] = updated;
    } catch (e: any) {
      alert(e.message);
    }
  }
</script>

<div class="attendance-container">
  <div class="filters">
    <div class="form-group">
      <label>Curso</label>
      <select bind:value={currentCourse} onchange={loadRecords}>
        <option value="algoritmos">Algoritmos</option>
        <option value="desarrollo-web-1">Desarrollo Web 1</option>
        <option value="desarrollo-web-2">Desarrollo Web 2</option>
      </select>
    </div>
    <div class="form-group">
      <label>Periodo</label>
      <input type="text" bind:value={currentPeriod} onchange={loadRecords} />
    </div>
  </div>

  {#if !isPrivileged}
  <div class="new-session card-inline">
    <h4>Crear Nueva Sesión</h4>
    <div class="session-form">
      <div class="form-group">
        <label>Sesión N°</label>
        <input type="number" bind:value={newRecord.sessionNumber} min="1" />
      </div>
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" bind:value={newRecord.date} />
      </div>
      <div class="form-group">
        <label>Horario</label>
        <input type="text" bind:value={newRecord.schedule} />
      </div>
      <div class="form-group">
        <label>Día</label>
        <select bind:value={newRecord.dayOfWeek}>
          <option value="lunes">Lunes</option>
          <option value="martes">Martes</option>
          <option value="miercoles">Miércoles</option>
          <option value="jueves">Jueves</option>
          <option value="viernes">Viernes</option>
          <option value="sabado">Sábado</option>
        </select>
      </div>
      <button class="btn btn-primary mt-auto" onclick={startNewSession} disabled={saving}>
        ➕ Iniciar Asistencia
      </button>
    </div>
  </div>
  {/if}

  {#if loading}
    <p class="loading">Cargando registros...</p>
  {:else if records.length === 0}
    <p class="empty">No hay registros de asistencia para este curso y periodo.</p>
  {:else}
    <div class="records-list">
      {#each records as record}
        <div class="record-card">
          <div class="record-header">
            <div class="record-info">
              <h4>Sesión {record.sessionNumber} <span>— {new Date(record.date).toLocaleDateString()}</span></h4>
              <p class="text-sm">Docente: {record.teacher?.full_name} | {record.dayOfWeek} {record.schedule}</p>
            </div>
            <div class="record-actions">
              <FormStatusBadge status={record.status} />
              {#if record.status === 'borrador' && (!isPrivileged || record.teacher?._id === $currentUser?.id)}
                <button class="btn btn-sm btn-outline" onclick={() => closeSession(record._id)}>🔒 Cerrar Planilla</button>
              {/if}
            </div>
          </div>
          
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th class="center">Presente (P)</th>
                  <th class="center">Falta (X)</th>
                  <th class="center">Excusa (E)</th>
                  <th class="center">Permiso (J)</th>
                </tr>
              </thead>
              <tbody>
                {#each record.entries as entry}
                  <tr>
                    <td>{entry.student?.full_name || entry.student?.username}</td>
                    <td class="center">
                      <input type="radio" name="status_{record._id}_{entry.student._id}" 
                             checked={entry.status === 'P'} 
                             disabled={record.status === 'cerrado' || isPrivileged}
                             onchange={() => updateStatus(record._id, entry.student._id, 'P')} />
                    </td>
                    <td class="center">
                      <input type="radio" name="status_{record._id}_{entry.student._id}" 
                             checked={entry.status === 'X'} 
                             disabled={record.status === 'cerrado' || isPrivileged}
                             onchange={() => updateStatus(record._id, entry.student._id, 'X')} />
                    </td>
                    <td class="center">
                      <input type="radio" name="status_{record._id}_{entry.student._id}" 
                             checked={entry.status === 'E'} 
                             disabled={record.status === 'cerrado' || isPrivileged}
                             onchange={() => updateStatus(record._id, entry.student._id, 'E')} />
                    </td>
                    <td class="center">
                      <input type="radio" name="status_{record._id}_{entry.student._id}" 
                             checked={entry.status === 'J'} 
                             disabled={record.status === 'cerrado' || isPrivileged}
                             onchange={() => updateStatus(record._id, entry.student._id, 'J')} />
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .attendance-container { font-size: 0.9rem; }
  .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, select { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; }
  
  .card-inline { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; }
  .card-inline h4 { margin: 0 0 1rem; color: #0f172a; font-size: 1rem; }
  .session-form { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
  .mt-auto { margin-top: auto; }
  
  .records-list { display: flex; flex-direction: column; gap: 1.5rem; }
  .record-card { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
  .record-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .record-info h4 { margin: 0; font-size: 1.1rem; color: #0f172a; }
  .record-info h4 span { color: #64748b; font-weight: normal; font-size: 0.95rem; }
  .record-info .text-sm { margin: 0.25rem 0 0; color: #64748b; font-size: 0.85rem; }
  .record-actions { display: flex; align-items: center; gap: 1rem; }
  
  .table-responsive { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { background: white; padding: 0.75rem; color: #475569; font-weight: 600; border-bottom: 1px solid #e2e8f0; text-align: left; }
  td { padding: 0.5rem 0.75rem; border-bottom: 1px solid #f1f5f9; }
  .center { text-align: center; }
  
  input[type="radio"] { width: 1.2rem; height: 1.2rem; cursor: pointer; accent-color: #7c3aed; }
  input[type="radio"]:disabled { cursor: not-allowed; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-primary:hover:not(:disabled) { background: #6d28d9; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover { background: #f8fafc; }
  .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .loading, .empty { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }
</style>
