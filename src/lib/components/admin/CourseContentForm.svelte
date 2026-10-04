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
  
  let formData = $state({
    generalObjective: '',
    specificObjectives: '',
    contentUnits: [{ unitName: '', topics: '' }],
    methodology: '',
    evaluationCriteria: '',
    bibliography: ''
  });

  onMount(loadRecord);

  async function loadRecord() {
    loading = true;
    try {
      const docs = await adminApi.listCourseContent({ course: currentCourse, period: currentPeriod });
      if (docs.length > 0) {
        record = docs[0];
        formData = { ...record };
        if (!formData.contentUnits || formData.contentUnits.length === 0) {
          formData.contentUnits = [{ unitName: '', topics: '' }];
        }
      } else {
        record = null;
        formData = {
          generalObjective: '', specificObjectives: '', contentUnits: [{ unitName: '', topics: '' }],
          methodology: '', evaluationCriteria: '', bibliography: ''
        };
      }
    } catch (e) {
      console.error(e);
      record = null;
    } finally {
      loading = false;
    }
  }

  function addUnit() {
    if (record && record.status !== 'borrador' && record.status !== 'rechazado') return;
    formData.contentUnits = [...formData.contentUnits, { unitName: '', topics: '' }];
  }

  function removeUnit(index: number) {
    if (record && record.status !== 'borrador' && record.status !== 'rechazado') return;
    formData.contentUnits = formData.contentUnits.filter((_, i) => i !== index);
  }

  async function save(status = 'borrador') {
    saving = true;
    try {
      const payload = {
        course: currentCourse,
        period: currentPeriod,
        ...formData,
        status
      };
      
      let res;
      if (record) {
        res = await adminApi.updateCourseContent(record._id, payload);
        if (status !== 'borrador') res = await adminApi.updateCourseContentStatus(record._id, { status });
      } else {
        res = await adminApi.createCourseContent(payload);
        if (status !== 'borrador') res = await adminApi.updateCourseContentStatus(res._id, { status });
      }
      record = res;
      alert(`Contenido guardado como ${status}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  let reviewNote = $state('');
  
  async function review(status: 'aprobado' | 'rechazado') {
    if (status === 'rechazado' && !reviewNote) {
      alert('Debe justificar el rechazo.');
      return;
    }
    saving = true;
    try {
      record = await adminApi.updateCourseContentStatus(record._id, { status, reviewNote });
      reviewNote = '';
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }
</script>

<div class="syllabus-container">
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
    <p class="loading">Cargando...</p>
  {:else}
    <div class="card-outline">
      <div class="form-header">
        <div>
          <h3>Contenido Temático / Syllabus (F1)</h3>
          <p class="text-sm">Programa analítico de la materia.</p>
        </div>
        {#if record}
          <FormStatusBadge status={record.status} />
        {:else}
          <FormStatusBadge status="borrador" />
        {/if}
      </div>

      {@const readonly = record && record.status !== 'borrador' && record.status !== 'rechazado'}

      {#if record?.status === 'rechazado'}
        <div class="alert alert-danger">
          <strong>Observación de coordinación:</strong> {record.reviewNote}
        </div>
      {/if}

      <div class="form-grid">
        <div class="form-group full-width">
          <label>Objetivo General</label>
          <textarea bind:value={formData.generalObjective} disabled={readonly} rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Objetivos Específicos</label>
          <textarea bind:value={formData.specificObjectives} disabled={readonly} rows="4"></textarea>
        </div>
      </div>

      <div class="section-title">Unidades Temáticas</div>
      <div class="units-container">
        {#each formData.contentUnits as unit, i}
          <div class="unit-card">
            <div class="unit-header">
              <label>Unidad {i + 1}</label>
              {#if !readonly && formData.contentUnits.length > 1}
                <button class="btn-icon" onclick={() => removeUnit(i)}>🗑️</button>
              {/if}
            </div>
            <div class="form-group">
              <input type="text" bind:value={unit.unitName} disabled={readonly} placeholder="Nombre de la unidad..." />
            </div>
            <div class="form-group mt-2">
              <textarea bind:value={unit.topics} disabled={readonly} rows="3" placeholder="Temas a desarrollar..."></textarea>
            </div>
          </div>
        {/each}
        {#if !readonly}
          <button class="btn btn-outline btn-block mt-2" onclick={addUnit}>+ Agregar Unidad</button>
        {/if}
      </div>

      <div class="section-title mt-4">Metodología y Evaluación</div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Metodología</label>
          <textarea bind:value={formData.methodology} disabled={readonly} rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Criterios de Evaluación</label>
          <textarea bind:value={formData.evaluationCriteria} disabled={readonly} rows="3"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Bibliografía Principal y Complementaria</label>
          <textarea bind:value={formData.bibliography} disabled={readonly} rows="3"></textarea>
        </div>
      </div>

      <div class="actions">
        {#if !readonly && !isPrivileged}
          <button class="btn btn-outline" onclick={() => save('borrador')} disabled={saving}>💾 Guardar Borrador</button>
          <button class="btn btn-primary" onclick={() => save('enviado')} disabled={saving}>📤 Enviar a Coordinación</button>
        {/if}

        {#if isPrivileged && record?.status === 'enviado'}
          <div class="review-panel">
            <input type="text" bind:value={reviewNote} placeholder="Observaciones en caso de rechazo..." class="w-full" />
            <div class="review-actions mt-2">
              <button class="btn btn-danger" onclick={() => review('rechazado')} disabled={saving}>❌ Rechazar</button>
              <button class="btn btn-green" onclick={() => review('aprobado')} disabled={saving}>✅ Aprobar</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .syllabus-container { font-size: 0.9rem; }
  .filters { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
  
  .card-outline { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; background: white; }
  .form-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem; }
  .form-header h3 { margin: 0 0 0.25rem; font-size: 1.25rem; color: #0f172a; }
  
  .section-title { font-weight: 600; color: #0f172a; font-size: 1.05rem; margin-top: 1.5rem; margin-bottom: 1rem; }
  
  .form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  .full-width { grid-column: 1 / -1; }
  
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, select, textarea { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; }
  input:disabled, select:disabled, textarea:disabled { background: #f8fafc; color: #64748b; cursor: not-allowed; }
  
  .units-container { display: flex; flex-direction: column; gap: 1rem; }
  .unit-card { border: 1px dashed #cbd5e1; border-radius: 6px; padding: 1rem; background: #f8fafc; }
  .unit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .unit-header label { font-weight: 600; color: #7c3aed; }
  .btn-icon { background: none; border: none; cursor: pointer; opacity: 0.6; }
  .btn-icon:hover { opacity: 1; }
  
  .actions { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0; display: flex; gap: 1rem; justify-content: flex-end; }
  .review-panel { width: 100%; max-width: 500px; background: #f1f5f9; padding: 1rem; border-radius: 8px; margin-left: auto; }
  .review-actions { display: flex; gap: 1rem; justify-content: flex-end; }
  .w-full { width: 100%; box-sizing: border-box; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .btn-block { width: 100%; justify-content: center; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover:not(:disabled) { background: #f8fafc; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-primary:hover:not(:disabled) { background: #6d28d9; }
  .btn-green { background: #16a34a; color: white; }
  .btn-green:hover:not(:disabled) { background: #15803d; }
  .btn-danger { background: #ef4444; color: white; }
  
  .alert { padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; }
  .alert-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  
  .mt-2 { margin-top: 0.5rem; }
  .mt-4 { margin-top: 1.5rem; }
  .text-sm { color: #64748b; font-size: 0.85rem; margin: 0; }
  .loading { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }
</style>
