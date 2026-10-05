<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import FormStatusBadge from './FormStatusBadge.svelte';

  let loading = $state(true);
  let saving = $state(false);
  let record = $state<any>(null);
  let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');
  let forceEdit = $state(false);
  let isReadonlyStatus = $derived(record?.status === 'entregado' && !forceEdit);
  let isPrivilegedEffective = $derived(isPrivileged && !forceEdit);

  let currentCourse = $state('algoritmos');
  let currentPeriod = $state('2026-3');
  
  let newRecordConfig = $state({
    courseCode: '',
    sheetId: '',
    year: new Date().getFullYear(),
    schedule: '6:30 PM a 8:30 PM',
    shift: 'NOCHE',
    dayOfWeek: 'martes',
  });

  onMount(loadRecord);

  async function loadRecord() {
    loading = true;
    try {
      const docs = await adminApi.listGradeSheets({ course: currentCourse, period: currentPeriod });
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

  async function createGradeSheet() {
    saving = true;
    try {
      const payload = {
        course: currentCourse,
        period: currentPeriod,
        ...newRecordConfig
      };
      record = await adminApi.createGradeSheet(payload);
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  function handleInput(entryIndex: number, field: string, event: Event) {
    if (!record || record.status === 'entregado' || isPrivilegedEffective) return;
    const val = (event.target as HTMLInputElement).value;
    const num = val === '' ? null : parseFloat(val);
    if (num !== null && (num < 0 || num > 5)) {
      alert('La nota debe estar entre 0.0 y 5.0');
      (event.target as HTMLInputElement).value = '';
      return;
    }
    record.entries[entryIndex][field] = num;
  }

  async function saveGrades() {
    saving = true;
    try {
      const updated = await adminApi.updateGradeSheet(record._id, { entries: record.entries });
      record = updated;
      alert('Notas guardadas (cálculos actualizados)');
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function signRecord(action: 'firmar' | 'entregar') {
    const msg = action === 'firmar' 
      ? '¿Confirma firmar digitalmente esta planilla? (Ya no podrá editarla libremente)' 
      : '¿Confirma entregar esta planilla a coordinación?';
    if (!confirm(msg)) return;
    
    saving = true;
    try {
      // Si va a firmar, guardamos primero por si acaso
      if (action === 'firmar') {
        await adminApi.updateGradeSheet(record._id, { entries: record.entries });
      }
      const updated = await adminApi.signGradeSheet(record._id, { action });
      record = updated;
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }
</script>

<div class="gradesheet-container">
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
    <p class="loading">Cargando planilla...</p>
  {:else if !record}
    {#if !isPrivilegedEffective}
    <div class="new-session card-inline">
      <h4>Generar Planilla Oficial (F6)</h4>
      <p class="text-sm mb-4">Se cargarán automáticamente los estudiantes inscritos en {currentCourse}.</p>
      <div class="session-form">
        <div class="form-group">
          <label>Cod. Materia</label>
          <input type="text" bind:value={newRecordConfig.courseCode} placeholder="Ej. 8150" />
        </div>
        <div class="form-group">
          <label>Id. No.</label>
          <input type="text" bind:value={newRecordConfig.sheetId} placeholder="Ej. 10055" />
        </div>
        <div class="form-group">
          <label>Año</label>
          <input type="number" bind:value={newRecordConfig.year} />
        </div>
        <div class="form-group">
          <label>Jornada</label>
          <select bind:value={newRecordConfig.shift}>
            <option value="MAÑANA">Mañana</option>
            <option value="TARDE">Tarde</option>
            <option value="NOCHE">Noche</option>
          </select>
        </div>
        <button class="btn btn-primary mt-auto" onclick={createGradeSheet} disabled={saving}>
          📄 Generar Planilla
        </button>
      </div>
    </div>
    {:else}
      <p class="empty">No hay planilla generada para este curso y periodo.</p>
    {/if}
  {:else}
    <div class="record-card">
      {#if $currentUser?.role === 'admin'}
      <div style="padding: 0.75rem 1.5rem; background: #fef3c7; border-bottom: 1px solid #fde68a; display: flex; justify-content: flex-end;">
        <label style="cursor:pointer; font-weight:600; color:#b45309; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
          <input type="checkbox" bind:checked={forceEdit} /> 🛠️ Modo Edición (Ignorar reglas)
        </label>
      </div>
    {/if}
    <div class="record-header">
        <div class="record-info">
          <h4>Planilla de Calificaciones — {record.courseCode || currentCourse}</h4>
          <p class="text-sm">
            Docente: {record.teacher?.full_name} | {record.shift} | {record.dayOfWeek} {record.schedule}
          </p>
        </div>
        <div class="record-actions">
          <FormStatusBadge status={record.status} />
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="grades-table">
          <thead>
            <tr>
              <th rowspan="2">No.</th>
              <th rowspan="2">Documento</th>
              <th rowspan="2">Apellidos y Nombres</th>
              <th colspan="2" class="center group-header">Primer Parcial (40%)</th>
              <th colspan="2" class="center group-header">Examen Final (60%)</th>
              <th rowspan="2" class="center def-header">Definitiva</th>
            </tr>
            <tr>
              <th class="center sub-th">Nota</th>
              <th class="center sub-th calc">40%</th>
              <th class="center sub-th">Nota</th>
              <th class="center sub-th calc">60%</th>
            </tr>
          </thead>
          <tbody>
            {#each record.entries as entry, i}
              <tr>
                <td class="center text-sm">{i + 1}</td>
                <td>{entry.student?.username}</td>
                <td><strong>{entry.student?.full_name}</strong></td>
                
                <td class="center input-cell">
                  <input type="number" step="0.1" min="0" max="5" 
                         value={entry.firstPartial} 
                         disabled={record.status === 'entregado' || isPrivilegedEffective}
                         oninput={(e) => handleInput(i, 'firstPartial', e)} />
                </td>
                <td class="center calc-cell">{entry.firstPartialPct ?? '-'}</td>
                
                <td class="center input-cell">
                  <input type="number" step="0.1" min="0" max="5" 
                         value={entry.finalExam} 
                         disabled={record.status === 'entregado' || isPrivilegedEffective}
                         oninput={(e) => handleInput(i, 'finalExam', e)} />
                </td>
                <td class="center calc-cell">{entry.finalExamPct ?? '-'}</td>
                
                <td class="center def-cell">
                  <span class="def-val {entry.finalGrade !== null && entry.finalGrade >= 3.0 ? 'pass' : (entry.finalGrade !== null ? 'fail' : '')}">
                    {entry.finalGrade?.toFixed(2) ?? '-'}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <div class="record-footer">
        <div class="stats">
          <span>Matriculados: <strong>{record.totalEnrolled}</strong></span>
          <span>Retirados: <strong>{record.totalWithdrawn}</strong></span>
          <span>Terminaron: <strong>{record.totalCompleted}</strong></span>
        </div>
        
        <div class="actions">
          {#if !isPrivilegedEffective && record.status !== 'entregado'}
            <button class="btn btn-outline" onclick={saveGrades} disabled={saving || record.status === 'entregado'}>
              💾 Guardar Borrador (Recalcular)
            </button>
            {#if record.status === 'borrador'}
              <button class="btn btn-purple" onclick={() => signRecord('firmar')} disabled={saving}>
                ✍️ Firmar Planilla
              </button>
            {/if}
          {/if}
          {#if record.status === 'firmado' && (!isPrivilegedEffective || record.teacher?._id === $currentUser?.id)}
            <button class="btn btn-green" onclick={() => signRecord('entregar')} disabled={saving}>
              ✅ Entregar a Coordinación
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .gradesheet-container { font-size: 0.9rem; }
  .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, select { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; }
  
  .card-inline { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; }
  .card-inline h4 { margin: 0; color: #0f172a; font-size: 1.1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .session-form { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; }
  .mt-auto { margin-top: auto; }
  
  .record-card { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: white; }
  .record-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  .record-info h4 { margin: 0 0 0.25rem; font-size: 1.15rem; color: #0f172a; }
  .record-info .text-sm { margin: 0; color: #64748b; font-size: 0.85rem; }
  
  .table-responsive { overflow-x: auto; }
  table.grades-table { width: 100%; border-collapse: collapse; }
  th { padding: 0.75rem; color: #334155; font-weight: 600; border: 1px solid #e2e8f0; background: #f8fafc; }
  td { padding: 0.5rem 0.75rem; border: 1px solid #f1f5f9; }
  
  .group-header { background: #f1f5f9; border-bottom: 1px solid #cbd5e1; }
  .def-header { background: #fdf4ff; color: #86198f; }
  .sub-th { font-size: 0.8rem; color: #64748b; font-weight: 500; }
  .sub-th.calc { background: #f8fafc; }
  
  .center { text-align: center; }
  .input-cell { padding: 0.25rem; }
  .input-cell input { width: 4rem; text-align: center; padding: 0.25rem; border: 1px solid #cbd5e1; border-radius: 4px; font-weight: 600; }
  .input-cell input:disabled { background: transparent; border-color: transparent; color: #0f172a; }
  
  .calc-cell { background: #f8fafc; color: #64748b; font-weight: 500; font-family: monospace; font-size: 0.95rem; }
  .def-cell { background: #fdf4ff; font-weight: 700; font-size: 1.05rem; }
  
  .def-val.pass { color: #16a34a; }
  .def-val.fail { color: #dc2626; }
  
  .record-footer { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-top: 1px solid #e2e8f0; flex-wrap: wrap; gap: 1rem; }
  .stats { display: flex; gap: 1.5rem; color: #475569; font-size: 0.9rem; }
  .actions { display: flex; gap: 1rem; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover { background: #f8fafc; }
  .btn-purple { background: #9333ea; color: white; }
  .btn-purple:hover:not(:disabled) { background: #7e22ce; }
  .btn-green { background: #16a34a; color: white; }
  .btn-green:hover:not(:disabled) { background: #15803d; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .loading, .empty { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }

  @media (max-width: 768px) {
    .filters { flex-direction: column; }
    .record-header { flex-direction: column; align-items: stretch; gap: 1rem; }
    .record-footer { flex-direction: column; align-items: stretch; gap: 1rem; }
    .stats { flex-direction: column; gap: 0.5rem; }
    .actions { flex-direction: column; width: 100%; }
    .actions button { width: 100%; }
    .table-container { overflow-x: auto; }
    table { min-width: 800px; }
  }
</style>
