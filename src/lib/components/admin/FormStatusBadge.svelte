<script lang="ts">
  let { status = 'borrador' } = $props();

  const statusConfig = {
    borrador: { color: 'badge-blue', text: 'Borrador', icon: '✏️' },
    enviado: { color: 'badge-yellow', text: 'Enviado', icon: '📤' },
    recibido: { color: 'badge-green', text: 'Recibido', icon: '📥' },
    aprobado: { color: 'badge-green', text: 'Aprobado', icon: '✅' },
    rechazado: { color: 'badge-red', text: 'Rechazado', icon: '❌' },
    revisado: { color: 'badge-green', text: 'Revisado', icon: '👀' },
    activo: { color: 'badge-blue', text: 'Activo', icon: '🔄' },
    cerrado: { color: 'badge-gray', text: 'Cerrado', icon: '🔒' },
    firmado: { color: 'badge-purple', text: 'Firmado', icon: '✍️' },
    entregado: { color: 'badge-green', text: 'Entregado', icon: '✅' }
  };

  const current = $derived(statusConfig[status] || statusConfig.borrador);
</script>

<span class="badge {current.color}">
  <span class="icon">{current.icon}</span>
  {current.text}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }
  
  .icon { font-size: 0.8rem; }
  
  .badge-blue { background: #e0f2fe; color: #0369a1; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-red { background: #fef2f2; color: #991b1b; }
  .badge-gray { background: #f1f5f9; color: #475569; }
  .badge-purple { background: #f3e8ff; color: #6b21a8; }
</style>
