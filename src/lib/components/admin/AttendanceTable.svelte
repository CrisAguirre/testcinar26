<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import FormStatusBadge from './FormStatusBadge.svelte';

  let loading = $state(true);
  let saving = $state(false);
  let record = $state<any>(null);
  let currentCourse = $state('algoritmos');
  let currentPeriod = $state('2026-3');
  
  let newRecordConfig = $state({
    courseCode: '',
    schedule: '6:30 PM a 8:30 PM',
    shift: 'NOCHE',
    dayOfWeek: 'martes',
    startDate: '',
    endDate: ''
  });

  let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');

  onMount(loadRecord);

  async function loadRecord() {
    loading = true;
    try {
      const docs = await adminApi.listAttendance({ course: currentCourse, period: currentPeriod });
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
        sessions: Array.from({ length: 12 }, () => ({ date: '' })), // 12 columnas vacías
        entries: [] // Se llenará en el backend con los estudiantes inscritos
      };
      record = await adminApi.createAttendance(payload);
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function saveDraft() {
    saving = true;
    try {
      const payload = {
        sessions: record.sessions,
        entries: record.entries
      };
      const updated = await adminApi.updateAttendance(record._id, payload);
      record = updated;
      alert('Borrador de asistencia guardado');
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function deliverRecord() {
    if (!confirm('¿Está seguro de entregar esta planilla de asistencia? Ya no podrá modificarla.')) return;
    saving = true;
    try {
      const updated = await adminApi.closeAttendance(record._id);
      record = updated;
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }
</script>

<div class="attendance-container">
  <div class="filters">
    <div class="form-group">
      <label>Módulo (Curso)</label>
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
    <p class="loading">Cargando planilla de asistencia...</p>
  {:else if !record}
    {#if !isPrivileged}
    <div class="new-session card-inline">
      <h4>Iniciar Planilla Consolidada de Asistencia (F4)</h4>
      <div class="session-form">
        <div class="form-group">
          <label>Código Materia</label>
          <input type="text" bind:value={newRecordConfig.courseCode} />
        </div>
        <div class="form-group">
          <label>Jornada</label>
          <select bind:value={newRecordConfig.shift}>
            <option value="MAÑANA">Mañana</option>
            <option value="TARDE">Tarde</option>
            <option value="NOCHE">Noche</option>
            <option value="SABATINOS">Sabatinos</option>
          </select>
        </div>
        <div class="form-group">
          <label>Día</label>
          <select bind:value={newRecordConfig.dayOfWeek}>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
          </select>
        </div>
        <div class="form-group">
          <label>Horario</label>
          <input type="text" bind:value={newRecordConfig.schedule} />
        </div>
        <div class="form-group">
          <label>Inicio / Fin</label>
          <div style="display:flex; gap:0.5rem;">
            <input type="date" bind:value={newRecordConfig.startDate} />
            <input type="date" bind:value={newRecordConfig.endDate} />
          </div>
        </div>
        <button class="btn btn-primary mt-auto" onclick={startTracking} disabled={saving}>
          📝 Generar Planilla
        </button>
      </div>
    </div>
    {:else}
      <p class="empty">No hay planilla consolidada de asistencia iniciada para este curso.</p>
    {/if}
  {:else}
    <div class="record-card">
      <div class="record-header">
        <div class="record-info">
          <h4>Planilla de Asistencia — {currentCourse.toUpperCase()} ({record.courseCode || 'N/A'})</h4>
          <div class="info-grid mt-2">
            <div><strong>Docente:</strong> {record.teacher?.full_name}</div>
            <div><strong>Jornada:</strong> {record.shift}</div>
            <div><strong>Día:</strong> {record.dayOfWeek}</div>
            <div><strong>Horario:</strong> {record.schedule}</div>
            <div><strong>Fechas:</strong> {record.startDate ? new Date(record.startDate).toLocaleDateString() : ''} - {record.endDate ? new Date(record.endDate).toLocaleDateString() : ''}</div>
          </div>
        </div>
        <div class="record-actions">
          <FormStatusBadge status={record.status} />
          {#if record.status === 'borrador' && (!isPrivileged || record.teacher?._id === $currentUser?.id)}
            <button class="btn btn-sm btn-outline" onclick={deliverRecord} disabled={saving}>🔒 Entregar Planilla</button>
          {/if}
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="attendance-grid">
          <thead>
            <tr>
              <th rowspan="2" width="30">No</th>
              <th rowspan="2" width="100">Doc. Identidad</th>
              <th rowspan="2" width="200">Apellidos y Nombres</th>
              <th rowspan="2" width="40">Niv</th>
              <th rowspan="2" width="80">Programa</th>
              <th colspan="12" class="center">ASISTENCIA (P/X/E/J)</th>
            </tr>
            <tr>
              {#each record.sessions as session, i}
                <th class="session-col">
                  {i + 1}.0<br/>
                  <input type="date" class="date-input" bind:value={session.date} disabled={record.status === 'entregado' || isPrivileged} />
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each record.entries as entry, i}
              <tr>
                <td class="center">{i + 1}</td>
                <td><input type="text" class="borderless w-full" bind:value={entry.documentId} disabled={record.status === 'entregado' || isPrivileged} /></td>
                <td>{entry.student?.full_name || entry.student?.username}</td>
                <td><input type="text" class="borderless center w-full" bind:value={entry.level} disabled={record.status === 'entregado' || isPrivileged} /></td>
                <td><input type="text" class="borderless w-full" bind:value={entry.program} disabled={record.status === 'entregado' || isPrivileged} /></td>
                
                {#each Array.from({length: 12}) as _, sIdx}
                  <td class="center p-0">
                    <select class="status-select" bind:value={entry.statuses[sIdx]} disabled={record.status === 'entregado' || isPrivileged}>
                      <option value=""></option>
                      <option value="P">P</option>
                      <option value="X">X</option>
                      <option value="E">E</option>
                      <option value="J">J</option>
                    </select>
                  </td>
                {/each}
              </tr>
            {/each}
            {#if record.entries.length === 0}
              <tr><td colspan="17" class="center text-gray py-4">No hay estudiantes matriculados en este módulo.</td></tr>
            {/if}
          </tbody>
        </table>
      </div>

      <div class="legend p-4 text-sm bg-gray-50 border-t">
        <strong>Convenciones:</strong> P = Presente, X = Falta, E = Excusa, J = Permiso
      </div>
      
      {#if record.status === 'borrador' && !isPrivileged}
        <div class="record-footer">
          <span class="text-sm text-gray">Recuerda guardar periódicamente los cambios.</span>
          <button class="btn btn-primary" onclick={saveDraft} disabled={saving}>💾 Guardar Borrador</button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .attendance-container { font-size: 0.85rem; }
  .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, select { padding: 0.4rem; border: 1px solid #cbd5e1; border-radius: 4px; font-family: inherit; font-size: 0.85rem; }
  .w-full { width: 100%; box-sizing: border-box; }
  
  .card-inline { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; }
  .card-inline h4 { margin: 0 0 1rem; color: #0f172a; font-size: 1.1rem; }
  .session-form { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
  .mt-auto { margin-top: auto; }
  
  .record-card { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; }
  .record-header { display: flex; justify-content: space-between; padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .record-info h4 { margin: 0 0 0.5rem; font-size: 1.15rem; color: #0f172a; }
  .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.85rem; color: #475569; }
  
  .table-responsive { overflow-x: auto; }
  table.attendance-grid { width: 100%; border-collapse: collapse; white-space: nowrap; }
  th, td { border: 1px solid #cbd5e1; padding: 0.4rem; }
  th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; }
  .center { text-align: center; }
  .p-0 { padding: 0; }
  
  .session-col { font-size: 0.75rem; text-align: center; min-width: 60px; padding: 0.25rem !important; }
  .date-input { font-size: 0.7rem; padding: 0.1rem; border: 1px solid #e2e8f0; border-radius: 2px; width: 100%; box-sizing: border-box; background: transparent; }
  .date-input::-webkit-calendar-picker-indicator { padding: 0; margin: 0; }
  
  .borderless { border: none; background: transparent; padding: 0.25rem; font-size: inherit; }
  .borderless:focus { outline: 1px solid #7c3aed; background: white; }
  
  .status-select { width: 100%; height: 100%; border: none; background: transparent; font-weight: bold; text-align: center; cursor: pointer; padding: 0.25rem; -webkit-appearance: none; -moz-appearance: none; appearance: none; }
  .status-select:focus { outline: none; background: #f3e8ff; }
  
  .record-footer { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover { background: #e2e8f0; }
  .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .bg-gray-50 { background: #f8fafc; }
  .border-t { border-top: 1px solid #e2e8f0; }
  .p-4 { padding: 1rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .text-gray { color: #64748b; }
  
  .loading, .empty { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }

  @media (max-width: 768px) {
    .filters { flex-direction: column; }
    .record-header { flex-direction: column; align-items: stretch; gap: 1rem; }
    .record-footer { flex-direction: column; align-items: stretch; gap: 1rem; }
    .actions { flex-direction: column; width: 100%; }
    .actions button { width: 100%; }
    .table-container { overflow-x: auto; }
    table { min-width: 800px; }
  }
</style>
