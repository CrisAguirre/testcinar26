<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import FormStatusBadge from './FormStatusBadge.svelte';

  let loading = $state(true);
  let saving = $state(false);
  let records = $state<any[]>([]);
  let currentRecord = $state<any>(null);
  
  let currentCourse = $state('algoritmos');
  let currentPeriod = $state('2026-3');
  let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');
  let readonly = $derived($currentUser?.role !== 'admin' && currentRecord && currentRecord.status !== 'borrador');

  let formData = $state({
    level: '',
    date: new Date().toISOString().split('T')[0],
    topics: '',
    competency: '',
    didacticStrategy: '',
    thematicContext: '',
    ticTools: '',
    learningObjective: '',
    resources: '',
    activityDevelopment: {
      experienciaVivencial: '',
      reflexion: '',
      documentacion: '',
      ampliacion: '',
      aplicacion: ''
    },
    teacherActions: '',
    studentActions: '',
    evaluationMethod: {
      evaluation: false,
      portfolio: false,
      selfEval: false,
      other: ''
    },
    evaluationDescription: '',
    postObservations: ''
  });

  onMount(loadRecords);

  async function loadRecords() {
    loading = true;
    try {
      records = await adminApi.listClassPlans({ course: currentCourse, period: currentPeriod });
      if (records.length > 0) {
        selectRecord(records[0]);
      } else {
        resetForm();
      }
    } catch (e) {
      console.error(e);
      resetForm();
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    currentRecord = null;
    formData = {
      level: '',
      date: new Date().toISOString().split('T')[0],
      topics: '',
      competency: '',
      didacticStrategy: '',
      thematicContext: '',
      ticTools: '',
      learningObjective: '',
      resources: '',
      activityDevelopment: { experienciaVivencial: '', reflexion: '', documentacion: '', ampliacion: '', aplicacion: '' },
      teacherActions: '',
      studentActions: '',
      evaluationMethod: { evaluation: false, portfolio: false, selfEval: false, other: '' },
      evaluationDescription: '',
      postObservations: ''
    };
  }

  function selectRecord(record: any) {
    currentRecord = record;
    formData = {
      ...record,
      date: new Date(record.date).toISOString().split('T')[0],
      // Asegurar objetos por si vienen null
      activityDevelopment: record.activityDevelopment || { experienciaVivencial: '', reflexion: '', documentacion: '', ampliacion: '', aplicacion: '' },
      evaluationMethod: record.evaluationMethod || { evaluation: false, portfolio: false, selfEval: false, other: '' }
    };
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
      if (currentRecord) {
        res = await adminApi.updateClassPlan(currentRecord._id, payload);
        if (status !== 'borrador') res = await adminApi.updateClassPlanStatus(currentRecord._id, { status });
      } else {
        res = await adminApi.createClassPlan(payload);
        if (status !== 'borrador') res = await adminApi.updateClassPlanStatus(res._id, { status });
      }
      currentRecord = res;
      await loadRecords(); // reload list
      alert(`Planeador guardado como ${status}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }

  async function markReviewed() {
    try {
      await adminApi.updateClassPlanStatus(currentRecord._id, { status: 'revisado' });
      await loadRecords();
    } catch (e: any) {
      alert(e.message);
    }
  }
</script>

<div class="classplan-container">
  <div class="sidebar">
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
    
    <div class="record-list">
      <div class="list-header">
        <h4>Planeadores</h4>
        {#if !isPrivileged}
          <button class="btn btn-sm btn-outline" onclick={resetForm}>+ Nuevo</button>
        {/if}
      </div>
      
      {#if loading}
        <p class="text-sm">Cargando...</p>
      {:else if records.length === 0}
        <p class="text-sm text-gray">No hay planeadores</p>
      {:else}
        {#each records as record}
          <div class="list-item {currentRecord?._id === record._id ? 'active' : ''}" onclick={() => selectRecord(record)}>
            <div class="item-title">{new Date(record.date).toLocaleDateString()}</div>
            <div class="item-desc">{record.topics?.substring(0, 30) || 'Sin tema'}...</div>
            <div class="item-status"><FormStatusBadge status={record.status} /></div>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <div class="main-content">
    <div class="form-header">
      <h3>Planeador de Clase (F3)</h3>
      {#if currentRecord}
        <div class="header-actions">
          <FormStatusBadge status={currentRecord.status} />
          {#if isPrivileged && currentRecord.status === 'enviado'}
            <button class="btn btn-sm btn-green" onclick={markReviewed}>Marcar Revisado</button>
          {/if}
        </div>
      {:else}
        <FormStatusBadge status="borrador" />
      {/if}
    </div>

    <div class="scroll-form">
      
      <div class="section-title">Información General</div>
      <div class="form-grid">
        <div class="form-group">
          <label>Nivel / Grupo</label>
          <input type="text" bind:value={formData.level} disabled={readonly} />
        </div>
        <div class="form-group">
          <label>Fecha de la clase</label>
          <input type="date" bind:value={formData.date} disabled={readonly} />
        </div>
        <div class="form-group full-width">
          <label>Temas</label>
          <input type="text" bind:value={formData.topics} disabled={readonly} placeholder="Contenido a dictar" />
        </div>
      </div>

      <div class="section-title">Enfoque Pedagógico</div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Competencia</label>
          <input type="text" bind:value={formData.competency} disabled={readonly} />
        </div>
        <div class="form-group">
          <label>Estrategia didáctica</label>
          <input type="text" bind:value={formData.didacticStrategy} disabled={readonly} placeholder="Ej. Aprendizaje basado en problemas" />
        </div>
        <div class="form-group">
          <label>Contexto Temático (Saberes previos)</label>
          <input type="text" bind:value={formData.thematicContext} disabled={readonly} />
        </div>
        <div class="form-group full-width">
          <label>Objetivo de Aprendizaje (Quién - Qué - Cómo - Nivel)</label>
          <textarea bind:value={formData.learningObjective} disabled={readonly} rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Herramientas TIC</label>
          <input type="text" bind:value={formData.ticTools} disabled={readonly} />
        </div>
        <div class="form-group">
          <label>Recursos</label>
          <input type="text" bind:value={formData.resources} disabled={readonly} />
        </div>
      </div>

      <div class="section-title">Desarrollo de la Actividad de Aula (5 Momentos)</div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>1. Experiencia Vivencial</label>
          <textarea bind:value={formData.activityDevelopment.experienciaVivencial} disabled={readonly} rows="2" placeholder="Pregunta problematizadora, SQA, lluvia de ideas..."></textarea>
        </div>
        <div class="form-group full-width">
          <label>2. Reflexión</label>
          <textarea bind:value={formData.activityDevelopment.reflexion} disabled={readonly} rows="2" placeholder="Preguntas que orienten a la competencia..."></textarea>
        </div>
        <div class="form-group full-width">
          <label>3. Documentación</label>
          <textarea bind:value={formData.activityDevelopment.documentacion} disabled={readonly} rows="2" placeholder="Confrontar saberes, fuentes científicas..."></textarea>
        </div>
        <div class="form-group full-width">
          <label>4. Ampliación</label>
          <textarea bind:value={formData.activityDevelopment.ampliacion} disabled={readonly} rows="2" placeholder="Integrar conceptos, organizadores gráficos..."></textarea>
        </div>
        <div class="form-group full-width">
          <label>5. Aplicación</label>
          <textarea bind:value={formData.activityDevelopment.aplicacion} disabled={readonly} rows="2" placeholder="Desarrollo de proyecto o producto final..."></textarea>
        </div>
      </div>

      <div class="section-title">Roles en el Aula</div>
      <div class="form-grid">
        <div class="form-group full-width">
          <label>Qué hace el Docente</label>
          <textarea bind:value={formData.teacherActions} disabled={readonly} rows="2"></textarea>
        </div>
        <div class="form-group full-width">
          <label>Qué hace el Estudiante</label>
          <textarea bind:value={formData.studentActions} disabled={readonly} rows="2"></textarea>
        </div>
      </div>

      <div class="section-title">Método de Evaluación</div>
      <div class="form-grid">
        <div class="form-group full-width checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={formData.evaluationMethod.evaluation} disabled={readonly} />
            Evaluación específica (criterios)
          </label>
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={formData.evaluationMethod.portfolio} disabled={readonly} />
            Portafolio
          </label>
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={formData.evaluationMethod.selfEval} disabled={readonly} />
            Auto/Co-evaluación
          </label>
        </div>
        <div class="form-group">
          <label>Otro Método</label>
          <input type="text" bind:value={formData.evaluationMethod.other} disabled={readonly} />
        </div>
        <div class="form-group full-width">
          <label>Descripción de la Evaluación</label>
          <textarea bind:value={formData.evaluationDescription} disabled={readonly} rows="2"></textarea>
        </div>
      </div>

      <div class="section-title">Observaciones Posteriores</div>
      <div class="form-group full-width">
        <textarea bind:value={formData.postObservations} disabled={readonly} rows="3" placeholder="Situaciones presentadas durante la clase..."></textarea>
      </div>

      {#if !readonly}
        <div class="actions">
          <button class="btn btn-outline" onclick={() => save('borrador')} disabled={saving}>💾 Guardar Borrador</button>
          <button class="btn btn-primary" onclick={() => save('enviado')} disabled={saving}>📤 Enviar a Coordinación</button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .classplan-container { display: flex; gap: 1.5rem; height: calc(100vh - 200px); min-height: 600px; font-size: 0.9rem; }
  
  .sidebar { width: 280px; flex-shrink: 0; display: flex; flex-direction: column; gap: 1.5rem; border-right: 1px solid #e2e8f0; padding-right: 1.5rem; }
  .filters { display: flex; flex-direction: column; gap: 1rem; }
  
  .record-list { display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; flex: 1; }
  .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
  .list-header h4 { margin: 0; color: #0f172a; }
  
  .list-item { padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: white; }
  .list-item:hover { border-color: #cbd5e1; background: #f8fafc; }
  .list-item.active { border-color: #7c3aed; background: #f5f3ff; box-shadow: 0 2px 4px rgba(124, 58, 237, 0.1); }
  .item-title { font-weight: 600; color: #0f172a; margin-bottom: 0.25rem; }
  .item-desc { font-size: 0.8rem; color: #64748b; margin-bottom: 0.5rem; }
  .item-status { font-size: 0.75rem; }
  
  .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .form-header h3 { margin: 0; font-size: 1.25rem; color: #0f172a; }
  .header-actions { display: flex; gap: 1rem; align-items: center; }
  
  .scroll-form { flex: 1; overflow-y: auto; padding-right: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
  
  .section-title { font-weight: 600; color: #7c3aed; font-size: 1.05rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 1rem; }
  .section-title:first-child { margin-top: 0; }
  
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  .full-width { grid-column: 1 / -1; }
  
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, select, textarea { padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; font-family: inherit; font-size: 0.9rem; }
  input:disabled, select:disabled, textarea:disabled { background: #f8fafc; color: #64748b; cursor: not-allowed; }
  
  .checkbox-group { display: flex; flex-direction: row; gap: 1.5rem; align-items: center; padding-top: 1rem; }
  .checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-weight: normal; cursor: pointer; color: #334155; }
  .checkbox-label input { cursor: pointer; accent-color: #7c3aed; }
  .checkbox-label input:disabled { cursor: not-allowed; }
  
  .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover:not(:disabled) { background: #f8fafc; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-primary:hover:not(:disabled) { background: #6d28d9; }
  .btn-green { background: #16a34a; color: white; }
  .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
  
  .text-sm { font-size: 0.85rem; }
  .text-gray { color: #64748b; }
</style>
