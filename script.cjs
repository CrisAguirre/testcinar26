const fs = require('fs');
const path = require('path');

function patchTable(file, statusClosed) {
  const p = path.join('c:/Users/USUARIO/Desktop/exams/testcinar26/src/lib/components/admin', file);
  let c = fs.readFileSync(p, 'utf8');
  
  if (c.includes('isPrivilegedEffective')) return;
  
  c = c.replace(
    /let isPrivileged = \$derived\(\$currentUser\?\.role === 'admin' \|\| \$currentUser\?\.role === 'coordinator'\);/,
    `let isPrivileged = $derived($currentUser?.role === 'admin' || $currentUser?.role === 'coordinator');
  let forceEdit = $state(false);
  let isReadonlyStatus = $derived(record?.status === '${statusClosed}' && !forceEdit);
  let isPrivilegedEffective = $derived(isPrivileged && !forceEdit);`
  );
  
  c = c.replace(
    /<div class="record-header">/,
    `{#if $currentUser?.role === 'admin'}
      <div style="padding: 0.75rem 1.5rem; background: #fef3c7; border-bottom: 1px solid #fde68a; display: flex; justify-content: flex-end;">
        <label style="cursor:pointer; font-weight:600; color:#b45309; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
          <input type="checkbox" bind:checked={forceEdit} /> 🛠️ Modo Edición (Ignorar reglas)
        </label>
      </div>
    {/if}
    <div class="record-header">`
  );
  
  const regexStatus = new RegExp(`record\\.\\status === '${statusClosed}'`, 'g');
  c = c.replace(regexStatus, 'isReadonlyStatus');
  c = c.replace(/isPrivileged(?!\s*=\s*\$derived)/g, 'isPrivilegedEffective');
  
  fs.writeFileSync(p, c);
}

patchTable('GradeSheetTable.svelte', 'entregado');
patchTable('AttendanceTable.svelte', 'entregado');
patchTable('ContentTrackingTable.svelte', 'cerrado');
