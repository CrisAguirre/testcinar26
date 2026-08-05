export const tallerQuestions = [
  {
    id: 'q1_math',
    question: 'Si se requiere calcular el área de un rectángulo, ¿cuál de las siguientes secuencias de pasos es la correcta en un algoritmo?',
    options: [
      '1. Multiplicar base por altura, 2. Mostrar área, 3. Pedir base y altura.',
      '1. Pedir base y altura, 2. Multiplicar base por altura, 3. Mostrar el resultado.',
      '1. Mostrar el resultado, 2. Pedir base, 3. Multiplicar por altura.',
      '1. Pedir base, 2. Mostrar área, 3. Pedir altura.'
    ],
    correctAnswer: 1
  },
  {
    id: 'q2_logic_mod',
    question: 'Para determinar si un número entero "N" es par, la operación lógica más adecuada en pseudocódigo o bloque lógico es:',
    options: [
      'Si (N / 2 == 0) entonces es par',
      'Si (N * 2 == 0) entonces es par',
      'Si (N MOD 2 == 0) entonces es par',
      'Si (N MOD 2 == 1) entonces es par'
    ],
    correctAnswer: 2
  },
  {
    id: 'q3_loops_sum',
    question: 'En un algoritmo, se inicializa una variable "suma" en 0. Luego, en un ciclo que se repite 3 veces, a "suma" se le suma 5. ¿Cuál es el valor final de "suma"?',
    options: [
      '5',
      '10',
      '15',
      '0'
    ],
    correctAnswer: 2
  },
  {
    id: 'q4_variables_swap',
    question: 'Si tienes dos variables, A=10 y B=20, y deseas intercambiar sus valores usando una variable temporal "Aux". ¿Cuál es la secuencia lógica correcta?',
    options: [
      'A = B; B = A; Aux = A;',
      'Aux = A; A = B; B = Aux;',
      'Aux = B; B = A; A = B;',
      'A = Aux; B = Aux; Aux = A + B;'
    ],
    correctAnswer: 1
  },
  {
    id: 'q5_flowchart_shapes',
    question: 'En los diagramas de flujo, ¿qué figura geométrica se utiliza universalmente para representar una "Toma de decisión" (condicional)?',
    options: [
      'Un óvalo',
      'Un rectángulo',
      'Un paralelogramo',
      'Un rombo'
    ],
    correctAnswer: 3
  },
  {
    id: 'q6_flowchart_trace',
    question: 'En un diagrama de flujo, una variable X empieza en 0. Entra a un ciclo donde se realiza la operación "X = X + 2". El ciclo evalúa la condición "¿X > 5?" para terminar. ¿Cuál es el valor final de X al salir del ciclo?',
    options: [
      '4',
      '5',
      '6',
      '8'
    ],
    correctAnswer: 2
  },
  {
    id: 'q7_sorting_bubble',
    question: 'En el algoritmo de ordenamiento Burbuja (Bubble Sort), si se tiene el arreglo [5, 3, 4, 1] y se realiza la PRIMERA pasada completa comparando elementos adyacentes, ¿cuál será el estado del arreglo al finalizar esa primera pasada?',
    options: [
      '[1, 3, 4, 5]',
      '[3, 4, 1, 5]',
      '[3, 5, 4, 1]',
      '[1, 5, 3, 4]'
    ],
    correctAnswer: 1
  },
  {
    id: 'q8_sorting_concept',
    question: '¿Cuál es el objetivo principal de un algoritmo de ordenamiento como Selection Sort o Insertion Sort?',
    options: [
      'Eliminar los números duplicados de una lista de datos.',
      'Encontrar un elemento específico de forma rápida usando búsquedas binarias.',
      'Reorganizar los elementos de una colección en un orden específico (ascendente o descendente).',
      'Sumar y promediar todos los valores de un arreglo de números enteros.'
    ],
    correctAnswer: 2
  },
  {
    id: 'q9_nested_conditionals',
    question: 'Analiza la siguiente lógica: Si (edad >= 18) entonces { Si (tiene_licencia == verdadero) entonces Imprimir "Conduce" sino Imprimir "No conduce" } sino Imprimir "Menor de edad". ¿Qué sucede si edad = 20 y tiene_licencia = falso?',
    options: [
      'Imprime "Conduce"',
      'Imprime "No conduce"',
      'Imprime "Menor de edad"',
      'Muestra un error de sintaxis'
    ],
    correctAnswer: 1
  },
  {
    id: 'q10_arrays_max',
    question: 'Para encontrar el número mayor en una lista de números positivos, inicializamos "mayor = 0". Dentro del ciclo que recorre cada "numero_actual", ¿qué condición actualiza la variable "mayor"?',
    options: [
      'Si (numero_actual == mayor) entonces mayor = numero_actual',
      'Si (numero_actual < mayor) entonces mayor = numero_actual',
      'Si (numero_actual > mayor) entonces mayor = numero_actual',
      'Si (numero_actual != mayor) entonces mayor = numero_actual'
    ],
    correctAnswer: 2
  }
];
