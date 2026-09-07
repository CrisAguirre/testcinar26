export const questionBank = [
  // Tema 1: Métodos de ordenamiento (6 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué es el ordenamiento burbuja (bubble sort)?',
    options: [
      'Un algoritmo que coloca elementos grandes al inicio',
      'Compara elementos adyacentes e intercambia si están en orden incorrecto, repitiendo hasta estar ordenado',
      'Divide el arreglo en mitades recursivamente',
      'Ordena usando una estructura de árbol'
    ],
    answer: 1,
    explanation: 'Bubble sort compara pares vecinos: si están desordenados, los intercambia. Al finalizar una pasada, el mayor está al final. Repite hasta ordenar todo. Complejidad O(n²).'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Cuál es la complejidad del algoritmo de ordenamiento burbuja en el peor caso?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    answer: 2,
    explanation: 'Bubble sort tiene complejidad O(n²) en peor caso porque usa dos ciclos anidados. Cada pasada compara n-1, n-2... elementos: (n-1)+(n-2)+...+1 = n(n-1)/2.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Qué hace el algoritmo de selección (selection sort)?',
    options: [
      'Busca el elemento menor y lo intercambia con la primera posición, luego repite con el resto',
      'Compara elementos aleatorios',
      'Usa divide y vencerás',
      'Ordena usando una pila'
    ],
    answer: 0,
    explanation: 'Selection sort: encontrar el mínimo del arreglo y colocarlo en posición 0, luego encontrar el segundo mínimo y ponerlo en posición 1, etc. También O(n²).'
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Cuál es la ventaja de selection sort sobre bubble sort?',
    options: [
      'Es más rápido',
      'Hace menos intercambios (swap) en el peor caso',
      'Usa menos memoria',
      'Funciona con cualquier tipo de dato'
    ],
    answer: 1,
    explanation: 'Selection sort hace exactamente n-1 intercambios (un swap por pasada). Bubble sort puede hacer muchos más. Selection sort es mejor cuando el costo de swap es alto.'
  },
  {
    id: 5, tema: 1, type: 'mc',
    question: '¿Qué es un algoritmo de ordenamiento "in-place"?',
    options: [
      'Un algoritmo que requiere memoria adicional',
      'Un algoritmo que ordena sin necesidad de crear una copia del arreglo',
      'Un algoritmo que solo ordena números',
      'Un algoritmo que no termina'
    ],
    answer: 1,
    explanation: 'In-place significa que el algoritmo usa solo la memoria del arreglo original, sin crear estructuras auxiliares significativas. Bubble y selection son in-place.'
  },
  {
    id: 6, tema: 1, type: 'mc',
    question: '¿Cuál de estos NO es un algoritmo de ordenamiento?',
    options: ['Quick sort', 'Merge sort', 'Binary search', 'Insertion sort'],
    answer: 2,
    explanation: 'Binary search NO es de ordenamiento, es un algoritmo de BÚSQUEDA que requiere un arreglo ya ordenado. Quick sort, merge sort e insertion sort son de ordenamiento.'
  },

  // Tema 2: Métodos de búsqueda (6 MC)
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Qué es la búsqueda lineal (sequential search)?',
    options: [
      'Buscar usando un árbol',
      'Recorrer el arreglo elemento por elemento hasta encontrar el objetivo',
      'Dividir el arreglo en mitades',
      'Usar una función hash'
    ],
    answer: 1,
    explanation: 'Linear search revisa cada elemento en orden: 1°, 2°, 3°... hasta encontrarlo o llegar al final. O(n) en peor caso, pero funciona en arreglos desordenados.'
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Cuál es la complejidad de la búsqueda binaria?',
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    answer: 2,
    explanation: 'Binary search tiene complejidad O(log n) porque elimina mitad del espacio de búsqueda en cada paso. Funciona solo en arreglos ORDENADOS.'
  },
  {
    id: 9, tema: 2, type: 'mc',
    question: '¿Por qué es necesario que el arreglo esté ordenado para usar búsqueda binaria?',
    options: [
      'No es necesario',
      'Porque el algoritmo asume que los elementos están en orden para eliminar mitades correctamente',
      'Porque solo funciona con números',
      'Para usar menos memoria'
    ],
    answer: 1,
    explanation: 'Binary search compara con el elemento del medio: si es mayor, busca en la mitad derecha; si es menor, en la izquierda. Sin orden, esta lógica falla.'
  },
  {
    id: 10, tema: 2, type: 'mc',
    question: '¿Cuántas comparaciones como máximo necesita binary search para encontrar un elemento en un arreglo de 1000 elementos?',
    options: ['1000', '100', '10', '500'],
    answer: 2,
    explanation: 'log₂(1000) ≈ 10 porque 2^10 = 1024. Binary search reduce el espacio de búsqueda a la mitad cada vez: 1000→500→250→125→63→32→16→8→4→2→1.'
  },
  {
    id: 11, tema: 2, type: 'mc',
    question: '¿En qué situaciones es mejor usar búsqueda lineal en lugar de binaria?',
    options: [
      'En arreglos grandes ordenados',
      'En arreglos desordenados o pequeños',
      'Cuando los datos son numéricos',
      'Cuando hay muchos elementos'
    ],
    answer: 1,
    explanation: 'Linear search funciona con arreglos desordenados y es simple. Para arreglos pequeños (n < 20), linear search puede ser más rápido que binary search por la overhead de esta.'
  },
  {
    id: 12, tema: 2, type: 'mc',
    question: '¿Qué retorna binary search si no encuentra el elemento?',
    options: [
      'El índice del elemento',
      '-1 o null, dependiendo del lenguaje',
      '0',
      'El arreglo completo'
    ],
    answer: 1,
    explanation: 'Binary search retorna -1 o null cuando no encuentra el elemento. Algunos lenguajes retornan una bandera; otros usan excepciones.'
  },

  // Tema 3: Arreglos multidimensionales (6 MC)
  {
    id: 13, tema: 3, type: 'mc',
    question: '¿Qué es un arreglo bidimensional (matriz)?',
    options: [
      'Un arreglo de una dimensión',
      'Una tabla con filas y columnas',
      'Un tipo de lista enlazada',
      'Un número entero'
    ],
    answer: 1,
    explanation: 'Un arreglo 2D (matriz) tiene filas y columnas. Se accede con dos índices: matriz[fila][columna]. Ejemplo: tabla de calificaciones de estudiantes.'
  },
  {
    id: 14, tema: 3, type: 'mc',
    question: 'Si tengo una matriz de 3x4, ¿cuántos elementos totales tiene?',
    options: ['7', '12', '3', '4'],
    answer: 1,
    explanation: '3 filas × 4 columnas = 12 elementos. Una matriz m×n tiene m×n elementos totales.'
  },
  {
    id: 15, tema: 3, type: 'mc',
    question: '¿Cómo se accede al elemento en fila 2, columna 3 de una matriz?',
    options: ['matriz[2][3]', 'matriz[3][2]', 'matriz[1][2]', 'matriz[2,3]'],
    answer: 0,
    explanation: 'En la mayoría de lenguajes, los índices empiezan en 0. Fila 2, columna 3 se accede como matriz[1][2] si empezamos desde 0. Con 1-based sería [2][3].'
  },
  {
    id: 16, tema: 3, type: 'mc',
    question: '¿Qué son los arreglos tridimensionales?',
    options: [
      'Arreglos que solo tienen 3 elementos',
      'Arreglos con 3 dimensiones (largo, ancho, alto)',
      'Arreglos de texto',
      'Arreglos booleanos'
    ],
    answer: 1,
    explanation: 'Un arreglo 3D tiene 3 dimensiones. Ejemplo: matrices[curso][estudiante][nota] para almacenar notas de múltiples cursos y estudiantes.'
  },
  {
    id: 17, tema: 3, type: 'mc',
    question: '¿Cuál es la complejidad de buscar en una matriz?',
    options: ['O(log n)', 'O(1)', 'O(n)', 'O(n²)'],
    answer: 2,
    explanation: 'En el peor caso, buscar en matriz requiere recorrer todos los elementos: O(n×m) = O(n²) para matriz cuadrada, o O(n) si es 1D.'
  },
  {
    id: 18, tema: 3, type: 'mc',
    question: '¿Para qué sirven las matrices en programación?',
    options: [
      'Solo para matemáticas avanzadas',
      'Para representar tablas, grillas, paneles de juego, imágenes',
      'Para hacer cálculos simples',
      'Los matrices no existen en programación'
    ],
    answer: 1,
    explanation: 'Las matrices sirven para: tablas de datos, hojas de cálculo, paneles de juegos (sudoku, ajedrez), imágenes (pixeles), y cualquier estructura 2D.'
  },

  // Tema 4: Funciones y procedimientos (6 MC)
  {
    id: 19, tema: 4, type: 'mc',
    question: '¿Qué es una función en programación?',
    options: [
      'Una variable que cambia',
      'Un bloque de código reutilizable que realiza una tarea específica y puede retornar un valor',
      'Un tipo de dato',
      'Un ciclo especial'
    ],
    answer: 1,
    explanation: 'Una función es un bloque de código con nombre que puede recibir parámetros, ejecutar lógica, y retornar un resultado. Ejemplos: calcularArea(), buscarElemento().'
  },
  {
    id: 20, tema: 4, type: 'mc',
    question: '¿Qué es un parámetro en una función?',
    options: [
      'El resultado de la función',
      'Una variable que recibe un valor cuando la función es llamada',
      'El nombre de la función',
      'El tipo de dato que retorna'
    ],
    answer: 1,
    explanation: 'Los parámetros son variables definidas en la función que reciben valores cuando se llama: "función sumar(a, b)" donde a y b son parámetros.'
  },
  {
    id: 21, tema: 4, type: 'mc',
    question: '¿Qué es un argumento en una llamada a función?',
    options: [
      'El nombre de la función',
      'El valor real pasado a la función cuando se invoca',
      'El resultado de la función',
      'La definición de la función'
    ],
    answer: 1,
    explanation: 'Argumento es el valor real enviado: sumar(5, 3) donde 5 y 3 son argumentos. Paréntesis indica "invocar", el contenido son los argumentos.'
  },
  {
    id: 22, tema: 4, type: 'mc',
    question: '¿Cuál es la diferencia entre función y procedimiento?',
    options: [
      'Son idénticos',
      'Función retorna un valor, procedimiento no retorna (o retorna void)',
      'Procedimiento es más rápido',
      'Función es más simple'
    ],
    answer: 1,
    explanation: 'Funciónreturns un valor: resultado = calcularArea(radio). Procedimiento выполняет действия without returning: imprimirFactura(). Algunos lenguajes no distinguen (todo es función).'
  },
  {
    id: 23, tema: 4, type: 'mc',
    question: '¿Qué es la recursión?',
    options: [
      'Repetir código con un ciclo',
      'Una función que se llama a sí misma',
      'Ejecutar código en orden',
      'Terminar una función'
    ],
    answer: 1,
    explanation: 'Recursión es cuando una función se llama a sí misma. Ejemplo: factorial(n) = n * factorial(n-1). Necesita caso base para evitar infinito loop.'
  },
  {
    id: 24, tema: 4, type: 'mc',
    question: '¿Qué es el caso base en una función recursiva?',
    options: [
      'El primer llamado a la función',
      'La condición que detiene la recursión y evita un loop infinito',
      'El caso más difícil',
      'El valor máximo'
    ],
    answer: 1,
    explanation: 'El caso base es la condición que detiene la recursión: cuando se cumple, la función retorna sin llamarse a sí misma. Sin caso base = infinite recursion.'
  },

  // Tema 5: Casos de estudio (6 MC)
  {
    id: 25, tema: 5, type: 'mc',
    question: '¿Qué estructura de datos es ideal para implementar una cola de atención?',
    options: ['Pila (LIFO)', 'Cola (FIFO)', 'Arreglo simple', 'Variable simple'],
    answer: 1,
    explanation: 'Cola (FIFO = First In, First Out): el primero en llegar es el primero en ser atendido. Como una fila real de banco o restaurante.'
  },
  {
    id: 26, tema: 5, type: 'mc',
    question: '¿Qué tipo de dato es adecuado para almacenar la edad de 100 personas?',
    options: ['100 variables individuales', 'Un arreglo unidimensional de 100 elementos', 'Una matriz', 'Un texto'],
    answer: 1,
    explanation: 'Un arreglo unidimensional de 100 elementos permite almacenar, recorrer y procesar las edades eficientemente. Con un solo arreglo puedo calcular promedio, máximo, mínimo.'
  },
  {
    id: 27, tema: 5, type: 'mc',
    question: '¿Qué estructura se necesita para almacenar las notas de 3 parciales para 5 estudiantes?',
    options: [
      '5 arreglos de 3 elementos cada uno',
      'Una matriz de 5x3',
      'Un arreglo de 15 elementos',
      '3 arreglos de 5 elementos'
    ],
    answer: 1,
    explanation: 'Matriz 5×3: 5 estudiantes (filas) × 3 parciales (columnas). notas[estudiante][parcial] permite acceder a la nota específica.'
  },
  {
    id: 28, tema: 5, type: 'mc',
    question: '¿Qué algoritmo usarías para buscar un nombre en una lista telefónica (alfabética)?',
    options: ['Búsqueda lineal', 'Búsqueda binaria', 'Ordenamiento burbuja', 'Selección'],
    answer: 1,
    explanation: 'La lista está ordenada alfabéticamente, así que búsqueda binaria es ideal: O(log n) vs O(n) de lineal. En 1000 entradas, máximo ~10 comparaciones.'
  },
  {
    id: 29, tema: 5, type: 'mc',
    question: '¿Qué algoritmo de ordenamiento es más intuitivo y fácil de entender?',
    options: ['Quick sort', 'Merge sort', 'Ordenamiento burbuja', 'Binary search'],
    answer: 2,
    explanation: 'Bubble sort es el más simple conceptualmente: comparar vecinos e intercambiar. Aunque ineficiente O(n²), es útil para aprender y datos pequeños.'
  },
  {
    id: 30, tema: 5, type: 'mc',
    question: '¿Cuándo es preferible usar insertion sort sobre otros algoritmos?',
    options: [
      'Para arreglos grandes',
      'Para datos casi ordenados o pequeños',
      'Nunca',
      'Solo para números'
    ],
    answer: 1,
    explanation: 'Insertion sort es O(n) para datos casi ordenados y O(n²) general. Es estable y eficiente para arreglos pequeños (n < 50) o datos que llegan en stream.'
  },

  // Preguntas abiertas (10)
  {
    id: 31, tema: 1, type: 'open',
    question: 'Explica paso a paso cómo funciona el algoritmo de ordenamiento burbuja. Incluye un ejemplo con el arreglo [5, 3, 8, 1].'
  },
  {
    id: 32, tema: 2, type: 'open',
    question: 'Describe cómo realizarías una búsqueda binaria en el arreglo [1, 3, 5, 7, 9, 11, 13] para encontrar el número 7. Muestra cada paso.'
  },
  {
    id: 33, tema: 3, type: 'open',
    question: 'Crea una matriz de calificaciones para 3 estudiantes y 4 materias. Luego, escribe el algoritmo para calcular el promedio de cada estudiante.'
  },
  {
    id: 34, tema: 4, type: 'open',
    question: 'Escribe una función recursiva que calcule el factorial de un número n. Explica el caso base y el caso recursivo.'
  },
  {
    id: 35, tema: 5, type: 'open',
    question: 'Diseña un algoritmo que use una cola para simular una fila de banco donde llegan clientes y son atendidos por orden de llegada.'
  },
  {
    id: 36, tema: 1, type: 'open',
    question: 'Compara bubble sort vs selection sort: ¿Cuál hace menos intercambios (swaps)? ¿En qué caso sería preferible cada uno?'
  },
  {
    id: 37, tema: 2, type: 'open',
    question: 'Un arreglo de 1,000,000 de elementos está ordenado. ¿Cuántas comparaciones necesita binary search máximo? ¿Y linear search?'
  },
  {
    id: 38, tema: 4, type: 'open',
    question: 'Explica la diferencia entre parámetros y argumentos con un ejemplo de función que calcule el área de un círculo.'
  },
  {
    id: 39, tema: 5, type: 'open',
    question: 'Menciona 3 casos de uso en la vida real donde necesitarías arreglos bidimensionales. Explica brevemente cada uno.'
  },
  {
    id: 40, tema: 5, type: 'open',
    question: '¿Qué problemas de la vida real se resuelven mejor con búsqueda binaria que con búsqueda lineal? Da 3 ejemplos.'
  }
];

export function selectRandomQuestions(count = 20) {
  const baseDistribution = [
    { tema: 1, count: 3 },
    { tema: 2, count: 3 },
    { tema: 3, count: 3 },
    { tema: 4, count: 3 },
    { tema: 5, count: 3 }
  ];

  const totalBase = baseDistribution.reduce((s, d) => s + d.count, 0);
  const openCount = count - totalBase;

  const selectedQuestions = [];

  for (const dist of baseDistribution) {
    const temaQuestions = questionBank.filter(q => q.tema === dist.tema);
    const shuffled = [...temaQuestions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, dist.count));
  }

  const openQuestions = questionBank.filter(q => q.type === 'open').sort(() => Math.random() - 0.5);
  selectedQuestions.push(...openQuestions.slice(0, Math.max(0, openCount)));

  return selectedQuestions.sort(() => Math.random() - 0.5);
}

export const TOTAL_QUESTIONS = questionBank.length;
export const TOTAL_TIME = 45 * 60;
export const TIME_PER_MC = 60;
export const TIME_PER_OPEN = 180;
export const SIMULACRO_END = new Date('2026-08-25T23:59:59-05:00');
export const EVAL_START = new Date('2026-08-28T18:45:00-05:00');
export const EVAL_END = new Date('2026-08-28T20:00:00-05:00');
export const MAX_SIMULACROS = 3;
export const MAX_EVALUACIONES = 1;
