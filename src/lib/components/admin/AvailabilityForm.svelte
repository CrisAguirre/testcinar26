<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/api';
  import { currentUser } from '$lib/stores/auth';
  import FormStatusBadge from './FormStatusBadge.svelte';

  let loading = $state(true);
  let saving = $state(false);
  let record = $state<any>(null);
  let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');

  const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const timeSlots = ['8:00-10:00', '10:00-12:00', '12:30-14:30', '14:00-16:00', '16:00-18:00', '18:30-20:30'];

  let formData = $state({
    period: '2026-3',
    formatDate: new Date().toISOString().split('T')[0],
    fullName: $currentUser?.full_name || '',
    email: $currentUser?.email || '',
    documentId: '',
    profession: '',
    specialization: '',
    address: '',
    phone: '',
    cellphone: '',
    professionalProfile: '',
    subjectExpertise: '',
    periodStart: '',
    periodEnd: '',
    slots: [] as any[]
  });

  // Initialize slots
  function initSlots() {
    const slots = [];
    for (const day of days) {
      for (const timeSlot of timeSlots) {
        slots.push({ day, timeSlot, available: false });
      }
    }
    return slots;
  }

  onMount(async () => {
    try {
      const docs = await adminApi.listAvailability({ period: '2026-3' });
      if (docs.length > 0) {
        // Find own record or first if admin
        record = isPrivileged && docs.length > 1 ? docs : docs[0];
        if (!Array.isArray(record)) {
           formData = { 
             ...record, 
             subjectExpertise: record.subjectExpertise.join(', ')
           };
           if (!formData.slots || formData.slots.length === 0) formData.slots = initSlots();
        }
      } else {
        formData.slots = initSlots();
      }
    } catch (e) {
      console.error(e);
      formData.slots = initSlots();
    } finally {
      loading = false;
    }
  });

  function toggleSlot(day: string, timeSlot: string) {
    if (record && record.status !== 'borrador') return;
    const idx = formData.slots.findIndex(s => s.day === day && s.timeSlot === timeSlot);
    if (idx >= 0) {
      formData.slots[idx].available = !formData.slots[idx].available;
    }
  }

  function isAvailable(day: string, timeSlot: string) {
    return formData.slots.find(s => s.day === day && s.timeSlot === timeSlot)?.available || false;
  }

  async function save(status = 'borrador') {
    saving = true;
    try {
      const payload = {
        ...formData,
        status,
        subjectExpertise: formData.subjectExpertise.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      let res;
      if (record && !Array.isArray(record)) {
        res = await adminApi.updateAvailability(record._id, payload);
        if (status !== 'borrador') res = await adminApi.updateAvailabilityStatus(record._id, { status });
      } else {
        res = await adminApi.createAvailability(payload);
        if (status !== 'borrador') res = await adminApi.updateAvailabilityStatus(res._id, { status });
      }
      record = res;
      alert(`Disponibilidad guardada como ${status}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      saving = false;
    }
  }
  
  async function markReceived(id: string) {
    try {
      await adminApi.updateAvailabilityStatus(id, { status: 'recibido' });
      const docs = await adminApi.listAvailability({ period: '2026-3' });
      record = docs;
    } catch (e: any) {
      alert(e.message);
    }
  }
</script>

<div class="availability-container">
  {#if loading}
    <p class="loading">Cargando disponibilidad...</p>
  {:else if isPrivileged && Array.isArray(record)}
    <div class="admin-view">
      <h3>Disponibilidades Recibidas (Coordinación)</h3>
      <table>
        <thead>
          <tr>
            <th>Docente</th>
            <th>Email</th>
            <th>Profesión</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each record as doc}
            <tr>
              <td>{doc.fullName}</td>
              <td>{doc.email}</td>
              <td>{doc.profession || '-'}</td>
              <td><FormStatusBadge status={doc.status} /></td>
              <td>
                <button class="btn btn-sm" onclick={() => { record = doc; formData = {...doc, subjectExpertise: doc.subjectExpertise.join(', ')}; }}>Ver Detalle</button>
                {#if doc.status === 'enviado'}
                  <button class="btn btn-sm btn-green" onclick={() => markReceived(doc._id)}>Marcar Recibido</button>
                {/if}
              </td>
            </tr>
          {/each}
          {#if record.length === 0}
            <tr><td colspan="5" class="empty">No hay disponibilidades registradas</td></tr>
          {/if}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="form-header">
      <h3>Formato de Disponibilidad Docente (F2)</h3>
      {#if record}
        <FormStatusBadge status={record.status} />
        {#if isPrivileged && Array.isArray(record) === false}
           <button class="btn btn-sm btn-outline" onclick={async () => { record = await adminApi.listAvailability({ period: '2026-3' }) }}>Volver a lista</button>
        {/if}
      {:else}
        <FormStatusBadge status="borrador" />
      {/if}
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Nombre Completo</label>
        <input type="text" bind:value={formData.fullName} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Documento / C.C.</label>
        <input type="text" bind:value={formData.documentId} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Profesión</label>
        <input type="text" bind:value={formData.profession} disabled={record?.status !== 'borrador'} placeholder="Ej. Ingeniero de Sistemas" />
      </div>
      <div class="form-group">
        <label>Especialización</label>
        <input type="text" bind:value={formData.specialization} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input type="text" bind:value={formData.address} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" bind:value={formData.email} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input type="text" bind:value={formData.phone} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Celular</label>
        <input type="text" bind:value={formData.cellphone} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Iniciación de clases</label>
        <input type="date" bind:value={formData.periodStart} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group">
        <label>Finalización con habilitaciones</label>
        <input type="date" bind:value={formData.periodEnd} disabled={record?.status !== 'borrador'} />
      </div>
      <div class="form-group full-width">
        <label>Perfil Profesional (Materias que domina, experiencia)</label>
        <textarea bind:value={formData.professionalProfile} disabled={record?.status !== 'borrador'} rows="3"></textarea>
      </div>
      <div class="form-group full-width">
        <label>Temáticas (separadas por coma)</label>
        <input type="text" bind:value={formData.subjectExpertise} disabled={record?.status !== 'borrador'} placeholder="Java, Python, Redes, Base de datos..." />
      </div>
    </div>

    <h4 class="mt-4">Grilla de Disponibilidad Horaria</h4>
    <p class="text-sm">Haga clic en las celdas para marcar su disponibilidad (Verde = Disponible)</p>
    
    <div class="table-responsive">
      <table class="grid-table">
        <thead>
          <tr>
            <th>Hora</th>
            {#each days as day}
              <th class="capitalize">{day}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each timeSlots as slot}
            <tr>
              <td class="time-col">{slot}</td>
              {#each days as day}
                {@const isAv = isAvailable(day, slot)}
                <td 
                  class="slot-cell {isAv ? 'available' : ''} {record && record.status !== 'borrador' ? 'readonly' : ''}"
                  onclick={() => toggleSlot(day, slot)}
                >
                  {isAv ? 'Sí' : 'No'}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if !record || record.status === 'borrador'}
      <div class="actions">
        <button class="btn btn-outline" onclick={() => save('borrador')} disabled={saving}>💾 Guardar Borrador</button>
        <button class="btn btn-primary" onclick={() => save('enviado')} disabled={saving}>📤 Enviar a Coordinación</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .availability-container { font-size: 0.9rem; }
  .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .form-header h3 { margin: 0; font-size: 1.25rem; color: #0f172a; }
  
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.25rem; }
  .full-width { grid-column: 1 / -1; }
  
  label { font-weight: 500; color: #475569; font-size: 0.85rem; }
  input, textarea { 
    padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; 
    font-family: inherit; font-size: 0.9rem;
  }
  input:disabled, textarea:disabled { background: #f8fafc; color: #64748b; cursor: not-allowed; }
  
  .table-responsive { overflow-x: auto; margin-top: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; text-align: center; }
  th { background: #f8fafc; padding: 0.75rem; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
  td { padding: 0.5rem; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; }
  .capitalize { text-transform: capitalize; }
  .time-col { font-weight: 600; color: #334155; background: #f8fafc; white-space: nowrap; }
  
  .slot-cell { cursor: pointer; transition: background 0.2s, color 0.2s; user-select: none; font-weight: 500; color: #94a3b8; }
  .slot-cell:hover:not(.readonly) { background: #f1f5f9; }
  .slot-cell.available { background: #dcfce7; color: #166534; }
  .slot-cell.available:hover:not(.readonly) { background: #bbf7d0; }
  .slot-cell.readonly { cursor: default; }
  
  .actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
  
  .btn { padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; cursor: pointer; border: none; display: inline-flex; align-items: center; gap: 0.5rem; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-outline { background: transparent; border: 1px solid #cbd5e1; color: #475569; }
  .btn-outline:hover:not(:disabled) { background: #f8fafc; }
  .btn-primary { background: #7c3aed; color: white; }
  .btn-primary:hover:not(:disabled) { background: #6d28d9; }
  .btn-green { background: #16a34a; color: white; }
  .btn-sm { padding: 0.25rem 0.5rem; font-size: 0.8rem; }
  
  .mt-4 { margin-top: 1.5rem; }
  .text-sm { color: #64748b; font-size: 0.85rem; margin-top: 0; }
  .loading { text-align: center; color: #64748b; font-style: italic; margin: 2rem 0; }
  .empty { text-align: center; color: #64748b; font-style: italic; }
</style>
