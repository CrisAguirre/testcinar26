export const questionBank = [
  // Tema 1: Introducción a algoritmos (4 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué es un algoritmo?',
    options: [
      'Un programa de computadora',
      'Una secuencia ordenada de pasos para resolver un problema',
      'Un lenguaje de programación',
      'Una fórmula matemática'
    ],
    answer: 1,
    explanation: 'Un algoritmo es un conjunto finito de instrucciones que, ejecutadas en un orden específico, resuelven un problema o accomplish una tarea.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Cuáles son las fases para resolver un problema con algoritmos?',
    options: [
      'Diseño, implementación, prueba',
      'Análisis del problema, diseño del algoritmo, verificación, implementación',
      'Código, compilación, ejecución',
      'Entrada, proceso, salida'
    ],
    answer: 1,
    explanation: 'Las fases son: 1) Análisis (entender el problema), 2) Diseño (crear el algoritmo), 3) Verificación (probar dry-run), 4) Implementación (codificar).'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Qué es el pseudocódigo?',
    options: [
      'Un lenguaje de programación real',
      'Una representación textual de un algoritmo usando lenguaje natural mezclado con estructuras de programación',
      'Un tipo de diagrama de flujo',
      'Un compilador'
    ],
    answer: 1,
    explanation: 'El pseudocódigo usa lenguaje natural + estructuras de programación para describir algoritmos. No es ejecutable pero facilita la comprensión.'
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Qué característica debe tener todo algoritmo?',
    options: [
      'Ser lo más largo posible',
      'Usar un lenguaje de programación específico',
      'Ser finito, es decir, terminar después de un número finito de pasos',
      'Solo funcionar en computadoras'
    ],
    answer: 2,
    explanation: 'Todo algoritmo debe ser finito: tiene un inicio y un fin definidos, y después de un número finito de pasos produce un resultado.'
  },

  // Tema 2: Sentencias básicas (4 MC)
  {
    id: 5, tema: 2, type: 'mc',
    question: '¿Qué es una sentencia de entrada en pseudocódigo?',
    options: [
      'Mostrar información al usuario',
      'Asignar un valor a una variable',
      'Leer datos del usuario o de una fuente externa',
      'Guardar información en un archivo'
    ],
    answer: 2,
    explanation: 'La entrada (lectura) captura datos del usuario (teclado) o de archivos. Ejemplo: "Leer a, b" asigna valores a las variables a y b.'
  },
  {
    id: 6, tema: 2, type: 'mc',
    question: '¿Qué símbolo se usa comúnmente para asignación en pseudocódigo?',
    options: ['=', '==', '<-', ':='],
    answer: 2,
    explanation: 'Comúnmente se usa "<-" para asignación: "x <- 5" significa "asignar el valor 5 a la variable x". En algunos países se usa ":=" o "=".'
  },
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Cuál es la estructura básica secuencial?',
    options: [
      'Una estructura que evalúa condiciones',
      'Pasos ejecutados uno después de otro, en orden',
      'Un conjunto de instrucciones que se repiten',
      'Una decisión entre dos caminos'
    ],
    answer: 1,
    explanation: 'La estructura secuencial ejecuta las instrucciones en orden: paso1, paso2, paso3... Una después de otra, sin saltos ni repeticiones.'
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Qué es una constante en programación?',
    options: [
      'Una variable que cambia de valor',
      'Un valor que no cambia durante la ejecución del algoritmo',
      'Un tipo de dato especial',
      'Una función matemática'
    ],
    answer: 1,
    explanation: 'Una constante es un valor fijo que no cambia: Pi = 3.14159, el IVA = 0.19. Se define una vez y permanece igual.'
  },

  // Tema 3: Estructuras condicionales simples (6 MC)
  {
    id: 9, tema: 3, type: 'mc',
    question: '¿Cuál es la estructura de un condicional simple "si-entonces"?',
    options: [
      'Si (condición) { instrucciones_falso }',
      'Si (condición) { instrucciones_verdadero }',
      'Si (condición) { instrucciones_verdadero } Sino { instrucciones_falso }',
      'Si (condición) Entonces { instrucciones } Continuar'
    ],
    answer: 1,
    explanation: 'La estructura "si-entonces" ejecuta las instrucciones solo si la condición es verdadera. Si es falsa, salta ese bloque.'
  },
  {
    id: 10, tema: 3, type: 'mc',
    question: '¿Qué operador lógico significa "Y" en programación?',
    options: ['||', 'OR', '&&', 'NOT'],
    answer: 2,
    explanation: 'El operador && (AND/Y) retorna verdadero solo si AMBAS condiciones son verdaderas. Ejemplo: (a > 0 && b > 0) significa "a es mayor que 0 Y b es mayor que 0".'
  },
  {
    id: 11, tema: 3, type: 'mc',
    question: '¿Qué operador lógico significa "O" en programación?',
    options: ['&&', 'AND', '||', 'NOT'],
    answer: 2,
    explanation: 'El operador || (OR/O) retorna verdadero si AL MENOS UNA de las condiciones es verdadera. Ejemplo: (a < 0 || b < 0) significa "a es menor que 0 O b es menor que 0".'
  },
  {
    id: 12, tema: 3, type: 'mc',
    question: '¿Qué significa el operador NOT en una condición?',
    options: [
      'Suma lógica',
      'Invierte el valor de verdad: lo verdadero becomes falso y viceversa',
      'Multiplicación lógica',
      'Comparación de igualdad'
    ],
    answer: 1,
    explanation: 'NOT invierte el resultado: si condición es verdadera, NOT condición es falsa. Ejemplo: NOT (a > 10) es verdadero solo si a <= 10.'
  },
  {
    id: 13, tema: 3, type: 'mc',
    question: '¿Qué es una condición compuesta?',
    options: [
      'Una condición con paréntesis',
      'Una condición que usa operadores lógicos (&&, ||, NOT) para combinar varias comparaciones',
      'Una condición muy larga',
      'Una condición que cambia'
    ],
    answer: 1,
    explanation: 'Las condiciones compuestas usan AND (&&), OR (||) y NOT para combinar comparaciones: (edad >= 18 && tieneLicencia) es una condición compuesta.'
  },
  {
    id: 14, tema: 3, type: 'mc',
    question: '¿Cuál es la diferencia entre "=" y "==" en programación?',
    options: [
      'Son iguales',
      '"=" es asignación (dar valor), "==" es comparación (verificar si son iguales)',
      '"=" es para números, "==" es para textos',
      '"=" solo se usa en pseudocódigo'
    ],
    answer: 1,
    explanation: '"=" asigna un valor: x = 5. "==" compara: if (x == 5) pregunta "x es igual a 5?". Usar el wrong operator causa errores.'
  },

  // Tema 4: Estructuras condicionales compuestas (4 MC)
  {
    id: 15, tema: 4, type: 'mc',
    question: '¿Qué hace la estructura "si-sino-si"?',
    options: [
      'Evalúa una condición y ejecuta un bloque u otro',
      'Permite evaluar múltiples condiciones en secuencia hasta encontrar una verdadera',
      'Repite un bloque de instrucciones',
      'Termina la ejecución del programa'
    ],
    answer: 1,
    explanation: 'La estructura "si-sino-si" (if-else-if) evalúa condiciones en cascada. La primera verdadera ejecuta su bloque; si todas son falsas, ejecuta el sino final.'
  },
  {
    id: 16, tema: 4, type: 'mc',
    question: '¿Cuándo es apropiado usar "según-sea" (switch/case)?',
    options: [
      'Para evaluar ranges de valores',
      'Cuando una variable puede tomar múltiples valores discretos y se quiere ejecutar código diferente para cada uno',
      'Para comparar textos largos',
      'Para hacer cálculos matemáticos'
    ],
    answer: 1,
    explanation: 'Switch/según-sea es ideal cuando una variable tiene valores discretos known: día de la semana, tipo de producto, etc. Mejora legibilidad vs múltiples if-else.'
  },
  {
    id: 17, tema: 4, type: 'mc',
    question: '¿Qué es el anidamiento de condicionales?',
    options: [
      'Poner condiciones en una sola línea',
      'Tener un if dentro de otro if',
      'Usar solo operadores lógicos',
      'Crear variables dentro de condiciones'
    ],
    answer: 1,
    explanation: 'El anidamiento coloca un if dentro de otro: "Si (llueve) entonces { Si (tengo paraguas) entonces {...}}" Permite decisiones más granulares.'
  },
  {
    id: 18, tema: 4, type: 'mc',
    question: '¿Cuál es el problema de anidar demasiados niveles de condicionales?',
    options: [
      'El programa se ejecuta más rápido',
      'Dificulta la lectura y mantenimiento del código',
      'Usa más memoria',
      'No hay problema'
    ],
    answer: 1,
    explanation: 'Demasiados niveles de anidamiento hacen el código difícil de leer ("código espagueti"). Se recomienda usar else-if o switch para evitar más de 2-3 niveles.'
  },

  // Tema 5: Operadores (4 MC)
  {
    id: 19, tema: 5, type: 'mc',
    question: '¿Cuál es el resultado de 17 % 5 en programación?',
    options: ['3.4', '2', '12', '85'],
    answer: 1,
    explanation: 'El operador % es el módulo (resto). 17 / 5 = 3 con resto 2. Por lo tanto, 17 % 5 = 2. Es útil para verificar si un número es divisible.'
  },
  {
    id: 20, tema: 5, type: 'mc',
    question: '¿Qué operador se usa para verificar si dos valores son diferentes?',
    options: ['!=', '=<>', '-', 'NOT EQUALS'],
    answer: 0,
    explanation: 'El operador != significa "diferente de" o "no igual a". Retorna verdadero cuando los valores comparados NO son iguales.'
  },
  {
    id: 21, tema: 5, type: 'mc',
    question: '¿Cuál es la precedencia de los operadores aritméticos?',
    options: [
      'De izquierda a derecha siempre',
      'Paréntesis > Multiplicación/División/Módulo > Suma/Resta',
      'Primero suma y resta',
      'Todos tienen la misma precedencia'
    ],
    answer: 1,
    explanation: 'El orden es: 1) Paréntesis, 2) * / %, 3) + -. Ejemplo: 2 + 3 * 4 = 2 + 12 = 14 (no 20). Usar paréntesis para claridad.'
  },
  {
    id: 22, tema: 5, type: 'mc',
    question: '¿Qué es el operador de incremento (++)?',
    options: [
      'Resta uno al valor',
      'Suma uno al valor',
      'Duplica el valor',
      'Divide el valor entre 2'
    ],
    answer: 1,
    explanation: '++ incrementa en 1: x++ es equivalente a x = x + 1. Puede ser pre-incremento (++x) o post-incremento (x++), con diferencia en el valor retornado.'
  },

  // Tema 6: Ciclos/bucles (6 MC)
  {
    id: 23, tema: 6, type: 'mc',
    question: '¿Cuál es la diferencia entre el ciclo "para" (for) y "mientras" (while)?',
    options: [
      'Son idénticos',
      '"Para" se usa cuando se conocen las repeticiones, "mientras" cuando depende de una condición',
      '"Para" es más rápido',
      '"Mientras" no existe'
    ],
    answer: 1,
    explanation: 'FOR se usa cuando sabes cuántas veces repetir (contador). WHILE se usa cuando la repetición depende de una condición que puede cambiar impredeciblemente.'
  },
  {
    id: 24, tema: 6, type: 'mc',
    question: '¿Qué es un ciclo infinito?',
    options: [
      'Un ciclo que se ejecuta muy rápido',
      'Un ciclo cuya condición de salida nunca se cumple, causando que el programa no termine',
      'Un ciclo que usa muchos recursos',
      'Un ciclo que no tiene cuerpo'
    ],
    answer: 1,
    explanation: 'Un ciclo infinito ocurre cuando la condición de salida nunca se vuelve falsa. Puede congelar el programa. Ejemplo: while (true) sin break o sin cambiar la condición.'
  },
  {
    id: 25, tema: 6, type: 'mc',
    question: '¿Qué hace la instrucción "romper" (break) dentro de un ciclo?',
    options: [
      'Reinicia el ciclo',
      'Sale del ciclo inmediatamente, continuando con la siguiente instrucción',
      'Duplica las iteraciones',
      'Genera un error'
    ],
    answer: 1,
    explanation: 'break sale del ciclo actual de inmediato. Útil para detener cuando se encuentra lo que se buscaba, sin esperar a que termine el ciclo.'
  },
  {
    id: 26, tema: 6, type: 'mc',
    question: '¿Qué hace la instrucción "continuar" (continue) dentro de un ciclo?',
    options: [
      'Sale del ciclo',
      'Salta a la siguiente iteración, omitiendo las instrucciones restantes del cuerpo',
      'Reinicia el programa',
      'Guarda el estado'
    ],
    answer: 1,
    explanation: 'continue salta directamente a la siguiente iteración, saltándose el resto del cuerpo del ciclo. Útil para skip ciertos elementos.'
  },
  {
    id: 27, tema: 6, type: 'mc',
    question: '¿Qué es la variable contador en un ciclo?',
    options: [
      'Una variable que cuenta errores',
      'Una variable que se incrementa/deccrementa en cada iteración para controlar las repeticiones',
      'Una variable global',
      'Una constante'
    ],
    answer: 1,
    explanation: 'El contador controla cuántas veces se ejecuta el ciclo. Ejemplo: "Para i desde 1 hasta 10" usa i como contador, incrementándose automáticamente.'
  },
  {
    id: 28, tema: 6, type: 'mc',
    question: '¿Cuál es la estructura del ciclo "mientras-que" (while)?',
    options: [
      'mientras (inicialización; condición; incremento) { cuerpo }',
      'mientras (condición) { cuerpo }',
      'para (condición) { cuerpo }',
      'repetir { cuerpo } hasta (condición)'
    ],
    answer: 1,
    explanation: 'while(condición) { cuerpo } evalúa la condición primero; si es verdadera, ejecuta el cuerpo y vuelve a evaluar. Si es falsa, sale.'
  },

  // Tema 7: Ciclos anidados (4 MC)
  {
    id: 29, tema: 7, type: 'mc',
    question: '¿Qué son los ciclos anidados?',
    options: [
      'Un ciclo dentro de otro ciclo',
      'Dos ciclos que corren simultáneamente',
      'Un ciclo muy largo',
      'Un ciclo que se auto-invoca'
    ],
    answer: 0,
    explanation: 'Un ciclo anidado es un ciclo dentro de otro. El ciclo interno se ejecuta completamente por cada iteración del externo. Común en matrices.'
  },
  {
    id: 30, tema: 7, type: 'mc',
    question: 'Si tienes un ciclo "Para i de 1 a 3" y dentro "Para j de 1 a 2", ¿cuántas veces se ejecuta el cuerpo interno?',
    options: ['3', '2', '6', '5'],
    answer: 2,
    explanation: 'El externo ejecuta 3 veces (i=1,2,3). Por cada uno, el interno ejecuta 2 veces (j=1,2). Total: 3 × 2 = 6 ejecuciones del cuerpo interno.'
  },
  {
    id: 31, tema: 7, type: 'mc',
    question: '¿Cuál es un uso común de ciclos anidados?',
    options: [
      'Sumar dos números',
      'Recorrer matrices (tablas de datos)',
      'Calcular un promedio',
      'Verificar si un número es par'
    ],
    answer: 1,
    explanation: 'Los ciclos anidados son ideales para recorrer estructuras de 2 dimensiones: matrices, tablas, grillas. Un ciclo para filas, otro para columnas.'
  },
  {
    id: 32, tema: 7, type: 'mc',
    question: '¿Qué debo tener cuidado al usar ciclos anidados?',
    options: [
      'No usar paréntesis',
      'No usar variables con el mismo nombre',
      'El costo computacional: ciclos muy anidados pueden ser lentos',
      'No usar el operador módulo'
    ],
    answer: 2,
    explanation: 'Cada nivel anidado multiplica las iteraciones. Un ciclo de n×n puede ejecutarse n² veces. En algoritmos grandes, esto afecta rendimiento.'
  },

  // Tema 8: Arreglos unidimensionales (4 MC)
  {
    id: 33, tema: 8, type: 'mc',
    question: '¿Qué es un arreglo unidimensional?',
    options: [
      'Una lista ordenada de elementos del mismo tipo, almacenados en posiciones contiguas de memoria',
      'Una tabla de datos',
      'Un número entero',
      'Un tipo de ciclo'
    ],
    answer: 0,
    explanation: 'Un arreglo (array) es una colección de elementos del mismo tipo, acceder mediante índice. Ejemplo: notas[5] es el 6to elemento.'
  },
  {
    id: 34, tema: 8, type: 'mc',
    question: 'Si declaro un arreglo "numeros[5]" y lo lleno con 4 elementos, ¿cuál es el índice del último elemento?',
    options: ['5', '4', '6', '1'],
    answer: 1,
    explanation: 'Los arreglos son 0-indexed: el primer elemento es numeros[0]. Con 4 elementos, están en indices 0,1,2,3. El último es índice 3 (no 4).'
  },
  {
    id: 35, tema: 8, type: 'mc',
    question: '¿Qué significa "recorrer un arreglo"?',
    options: [
      'Eliminar elementos del arreglo',
      'Acceder a cada posición del arreglo secuencialmente, generalmente con un ciclo',
      'Ordenar el arreglo',
      'Duplicar el arreglo'
    ],
    answer: 1,
    explanation: 'Recorrer significa visitar cada elemento, típicamente con un ciclo for: "Para i desde 0 hasta longitud-1" permite acceder a todos los elementos.'
  },
  {
    id: 36, tema: 8, type: 'mc',
    question: '¿Cómo se declara un arreglo de 10 números enteros en pseudocódigo?',
    options: [
      'numeros = 10',
      'numeros[10]',
      'arreglo(numeros, 10)',
      'int numeros[10]'
    ],
    answer: 1,
    explanation: 'La sintaxis varía: "numeros[10]" o "Definir numeros[10] como Entero" reserva espacio para 10 elementos (indices 0 a 9).'
  },

  // Tema 9: Sistema de menú (4 MC)
  {
    id: 37, tema: 9, type: 'mc',
    question: '¿Qué es un sistema de menú en un programa?',
    options: [
      'Un tipo de ciclo',
      'Una interfaz que presenta opciones al usuario y ejecuta不同的 acciones según la selección',
      'Un método de ordenamiento',
      'Una forma de declarar variables'
    ],
    answer: 1,
    explanation: 'Un menú presenta opciones numeradas/letradas. El usuario elige, y el programa ejecuta el código correspondiente a esa opción.'
  },
  {
    id: 38, tema: 9, type: 'mc',
    question: '¿Qué estructura de control es ideal para implementar un menú?',
    options: [
      'Un solo si-entonces',
      'Un según-sea (switch) dentro de un ciclo que se repite hasta que el usuario elija salir',
      'Un ciclo para',
      'Un ciclo mientras sin condición de salida'
    ],
    answer: 1,
    explanation: 'Un menú usa switch/según-sea para las opciones, dentro de un do-while o while que continúa hasta que el usuario seleccione "Salir" (opción 0 o similar).'
  },
  {
    id: 39, tema: 9, type: 'mc',
    question: '¿Por qué es importante la opción "salir" o "volver" en un menú?',
    options: [
      'No es importante',
      'Para que el usuario pueda terminar o volver al menú anterior sin ejecutar más opciones',
      'Para que el programa funcione',
      'Para cumplir con PSeInt'
    ],
    answer: 1,
    explanation: 'La opción de salida da control al usuario. Sin ella, el programa quedaría atrapado en el menú o tendría que usar Ctrl+C para terminar.'
  },
  {
    id: 40, tema: 9, type: 'mc',
    question: '¿Qué combina típicamente un sistema de menú en un algoritmo?',
    options: [
      'Solo variables simples',
      'Estructuras secuenciales, condicionales, repetitivas y arreglos',
      'Solo ciclos',
      'Solo condicionales'
    ],
    answer: 1,
    explanation: 'Un menú funcional integra: secuencial (mostrar opciones), condicional (según-sea para procesar elección), repetitiva (while/do-while para volver al menú), y arreglos para almacenar datos.'
  },

  // Preguntas abiertas (10)
  {
    id: 41, tema: 1, type: 'open',
    question: 'Escribe un algoritmo en pseudocódigo que calcule el área de un rectángulo. Incluye análisis del problema, datos de entrada, proceso y salida.'
  },
  {
    id: 42, tema: 2, type: 'open',
    question: 'Escribe un algoritmo que lea tres números y calcule el promedio. Muestra el resultado.'
  },
  {
    id: 43, tema: 3, type: 'open',
    question: 'Escribe un algoritmo que determine si un estudiante pasó o reprobó una materia, sabiendo que necesita nota mínima de 3.0.'
  },
  {
    id: 44, tema: 4, type: 'open',
    question: 'Crea un algoritmo que clasifique una nota: <3 (Deficiente), 3-3.9 (Insuficiente), 4-4.9 (Aceptable), >=5 (Sobresaliente). Usa según-sea.'
  },
  {
    id: 45, tema: 5, type: 'open',
    question: 'Escribe un algoritmo que dados tres números, determine cuál es el mayor.'
  },
  {
    id: 46, tema: 6, type: 'open',
    question: 'Escribe un algoritmo que muestre los números del 1 al 100, pero solo los pares.'
  },
  {
    id: 47, tema: 7, type: 'open',
    question: 'Dibuja (describe) una tabla de multiplicar del 1 al 5 usando ciclos anidados.'
  },
  {
    id: 48, tema: 8, type: 'open',
    question: 'Escribe un algoritmo que encuentre el número mayor y el menor en un arreglo de 5 números.'
  },
  {
    id: 49, tema: 9, type: 'open',
    question: 'Diseña un menú con opciones para: 1) Leer 5 números, 2) Mostrar los que son mayores a 10, 3) Salir.'
  },
  {
    id: 50, tema: 9, type: 'open',
    question: 'Explica cómo usarías arreglos y un menú para crear un sistema de notas que permita agregar, consultar y calcular promedio.'
  }
];

export function selectRandomQuestions(count = 20) {
  const baseDistribution = [
    { tema: 1, count: 2 },
    { tema: 2, count: 2 },
    { tema: 3, count: 3 },
    { tema: 4, count: 2 },
    { tema: 5, count: 2 },
    { tema: 6, count: 3 },
    { tema: 7, count: 2 },
    { tema: 8, count: 2 },
    { tema: 9, count: 2 }
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
export const WINDOW1_END = new Date('2026-08-15T21:00:00-05:00');
export const WINDOW2_START = new Date('2026-08-18T18:45:00-05:00');
export const WINDOW2_END = new Date('2026-08-18T20:00:00-05:00');
