# Implementación de Drag and Drop (Arrastrar y Soltar) para DFD

Esta es una funcionalidad arquitectónicamente compleja que convertirá el editor DFD de un simple visor de código a una herramienta de programación visual interactiva.

## User Review Required

> [!IMPORTANT]
> El sistema actual usa el código fuente (.dfd) como la "fuente de la verdad". Al soltar un elemento visualmente, el sistema modificará el árbol lógico (AST) e inmediatamente reescribirá el código fuente en el panel izquierdo. Si tienes código inválido en el panel izquierdo, el AST no se generará y el panel visual desaparecerá, lo que significa que no podrás arrastrar nada hasta arreglar el código. ¿Estás de acuerdo con este flujo?

## Proposed Changes

### `src/lib/dfd/renderer.js`
Modificaré el motor de renderizado para que, al recorrer el AST, genere y devuelva un nuevo arreglo `dropZones`. 
Cada `dropZone` representará un espacio válido donde se puede insertar un componente. 
- Cada `dropZone` contendrá sus coordenadas visuales (x, y, ancho, alto).
- Cada `dropZone` contendrá una referencia directa al arreglo en memoria del AST (ej. `node.trueBranch`) y el `index` exacto donde se debe insertar.

### `src/routes/algoritmos/dfd/+page.svelte`
- **Panel de Componentes:** Agregaré `draggable="true"` y eventos `dragstart` a los elementos de la paleta, para que el navegador sepa qué componente se está arrastrando (Lectura, Salida, etc.).
- **Canvas SVG:**
  - Agregaré el renderizado del nuevo arreglo `renderData.dropZones`.
  - Serán rectángulos transparentes sobre las flechas, que se volverán visibles (o con un borde punteado) cuando el usuario esté arrastrando un elemento (`isDragging = true`).
  - Agregaré eventos `dragover`, `dragenter`, `dragleave` y `drop` a estos rectángulos.
- **Lógica de Inserción (`handleDrop`):**
  - Al soltar, leeré el tipo de componente.
  - Crearé un nodo AST por defecto (ej. para Salida: `{ type: 'output', text: "'Mensaje'" }`).
  - Insertaré el nodo directamente en el arreglo usando la referencia guardada en el `dropZone`.
  - Re-serializaré el AST modificado llamando a `serializeDfd(ast)` y sobrescribiré la variable `dfdContent`. Svelte actualizará la UI mágicamente gracias a su reactividad.

## Verification Plan

### Manual Verification
1. Abrir la página del editor.
2. Hacer click sostenido en "Decisión" en la barra lateral y arrastrarlo hacia el centro.
3. Las flechas (enlaces) deben mostrar zonas de "soltar" resaltadas.
4. Soltar la decisión encima de una flecha.
5. Verificar que:
   - El código de la izquierda se actualiza automáticamente añadiendo el código "7...".
   - El diagrama se actualiza mostrando el rombo de decisión.
   - El botón Ejecutar funciona y pasa por la nueva decisión.
