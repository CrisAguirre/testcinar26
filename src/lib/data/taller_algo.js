export const questionBank = [
  // Tema 1: Algoritmia básica (4 MC)
  {
    id: 1, tema: 1, type: 'mc',
    question: '¿Qué es PSeInt?',
    options: [
      'Un lenguaje de programación',
      'Un entorno/editor para aprender y ejecutar pseudocódigo y diagramas de flujo',
      'Un compilador de C',
      'Un sistema operativo'
    ],
    answer: 1,
    explanation: 'PSeInt es una herramienta educativa gratuita para escribir y ejecutar pseudocódigo. Incluye编辑器, intérprete de pseudocódigo y creador de diagramas de flujo.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: '¿Cuál es la instrucción correcta para mostrar texto en PSeInt?',
    options: ['Leer()', 'Escribir()', 'Mostrar()', 'Imprimir()'],
    answer: 1,
    explanation: 'En PSeInt se usa "Escribir()" para mostrar salida. Ejemplo: Escribir("Hola mundo") muestra el texto en pantalla.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: '¿Cómo se declara una variable entera en PSeInt?',
    options: ['Definir nombre Como Caracter', 'Definir edad Como Entero', 'entero edad', 'var edad: int'],
    answer: 1,
    explanation: 'En PSeInt se usa "Definir <variable> Como <tipo>". Los tipos incluyen Entero, Real, Caracter, Logico.'
  },
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Qué hace la instrucción "Esperar Tecla" en PSeInt?',
    options: [
      'Genera un número aleatorio',
      'Pausa la ejecución hasta que el usuario presione una tecla',
      'Lee un valor del teclado',
      'Termina el programa'
    ],
    answer: 1,
    explanation: 'Esperar Tecla detiene el programa hasta que el usuario presione una tecla. Útil para ver resultados antes de cerrar.'
  },

  // Tema 2: Estructuras condicionales en PSeInt (4 MC)
  {
    id: 5, tema: 2, type: 'mc',
    question: '¿Cuál es la estructura correcta del "Si-Entonces" en PSeInt?',
    options: [
      'Si (condición) entonces { instrucciones } FinSi',
      'Cuando (condición) { instrucciones }',
      'If (condición) { instrucciones }',
      'Si (condición) hacer { instrucciones }'
    ],
    answer: 0,
    explanation: 'En PSeInt la estructura es: Si (condición) Entonces ... FinSi. Debe incluir "FinSi" para cerrar el bloque.'
  },
  {
    id: 6, tema: 2, type: 'mc',
    question: '¿Cómo se escribe "mayor o igual que" en PSeInt?',
    options: ['=>', '>=', '>>', '='],
    answer: 1,
    explanation: 'En PSeInt se usan operadores relacionales estándares: >= (mayor o igual), <= (menor o igual), == (igual), <> (diferente).'
  },
  {
    id: 7, tema: 2, type: 'mc',
    question: '¿Qué es el "Si Anidado" en PSeInt?',
    options: [
      'Un Si muy grande',
      'Un Si dentro de otro Si',
      'Un tipo de variable',
      'Una función de PSeInt'
    ],
    answer: 1,
    explanation: 'Un Si anidado es cuando tienes otro Si dentro del bloque de un Si externo. Permite evaluar múltiples condiciones secuencialmente.'
  },
  {
    id: 8, tema: 2, type: 'mc',
    question: '¿Qué hace la estructura "Segun" en PSeInt?',
    options: [
      'Ordena un arreglo',
      'Evalúa una variable contra múltiples valores posibles y ejecuta el bloque correspondiente',
      'Busca un elemento',
      'Calcula un promedio'
    ],
    answer: 1,
    explanation: 'Según (switch) evalúa una variable contra casos: Según variable Hacer caso valor1: instrucciones, caso valor2: instrucciones, FinSelon.'
  },

  // Tema 3: Ciclos en PSeInt (4 MC)
  {
    id: 9, tema: 3, type: 'mc',
    question: '¿Cuál es la estructura correcta del ciclo "Para" en PSeInt?',
    options: [
      'Para variable Hasta valor Hacer { instrucciones } FinPara',
      'Para (inicio; condición; incremento) { }',
      'Loop variable = inicio To fin { }',
      'Repetir { } Hasta que (condición)'
    ],
    answer: 0,
    explanation: 'En PSeInt: Para <var> Desde <inicio> Hasta <fin> Con Paso <inc> Hacer ... FinPara. Ejemplo: Para i Desde 1 Hasta 10 Hacer ... FinPara.'
  },
  {
    id: 10, tema: 3, type: 'mc',
    question: '¿Qué hace el ciclo "Mientras" en PSeInt?',
    options: [
      'Ejecuta instrucciones un número fijo de veces',
      'Ejecuta instrucciones mientras la condición sea verdadera',
      'Ejecuta instrucciones al menos una vez',
      'No existe en PSeInt'
    ],
    answer: 1,
    explanation: 'Mientras (condición) Ejecuta el cuerpo mientras la condición sea verdadera. Si es falsa desde el inicio, el cuerpo nunca se ejecuta.'
  },
  {
    id: 11, tema: 3, type: 'mc',
    question: '¿Cuál es la diferencia entre "Mientras" y "Repetir"?',
    options: [
      'Son iguales',
      'Mientras evalúa la condición al inicio (puede no ejecutarse), Repetir evalúa al final (siempre se ejecuta al menos una vez)',
      'Repetir es más rápido',
      'Mientras solo funciona con números'
    ],
    answer: 1,
    explanation: 'Mientras: evaluación primero, puede no ejecutarse. Repetir...Hasta Que: ejecución primero, siempre al menos una vez, luego evalúa.'
  },
  {
    id: 12, tema: 3, type: 'mc',
    question: '¿Qué es el "Paso" en el ciclo Para de PSeInt?',
    options: [
      'El valor inicial',
      'El valor final',
      'El incremento/decremento de la variable en cada iteración',
      'La condición'
    ],
    answer: 2,
    explanation: 'Paso indica cuánto cambia la variable en cada iteración. Paso 1 (default), Paso 2, Paso -1 (cuenta regresiva).'
  },

  // Tema 4: Arreglos en PSeInt (4 MC)
  {
    id: 13, tema: 4, type: 'mc',
    question: '¿Cómo se declara un arreglo de 5 enteros en PSeInt?',
    options: [
      'numeros[5]',
      'Dimension numeros[5]',
      'arreglo numeros(5)',
      'int numeros[5]'
    ],
    answer: 1,
    explanation: 'En PSeInt se usa "Dimension <nombre>[<tamaño>]" para declarar arreglos. Dimension numeros[5] crea espacio para 5 elementos (índices 1 a 5 por defecto).'
  },
  {
    id: 14, tema: 4, type: 'mc',
    question: '¿Cómo se accede al tercer elemento de un arreglo "notas" en PSeInt?',
    options: ['notas.3', 'notas[3]', 'notas(3)', 'notas.3'],
    answer: 1,
    explanation: 'Se usan corchetes: notas[3] accede al tercer elemento. En PSeInt los índices empiezan en 1 por defecto.'
  },
  {
    id: 15, tema: 4, type: 'mc',
    question: '¿Para qué sirve la función "Longitud" en PSeInt para arreglos?',
    options: [
      'Calcular el promedio',
      'Obtener el número de elementos de un arreglo o texto',
      'Ordenar el arreglo',
      'Buscar un elemento'
    ],
    answer: 1,
    explanation: 'Longitud(array) o Longitud(texto) retorna el tamaño. Ejemplo: Para i Desde 1 Hasta Longitud(arr) hacer. Muy útil para recorrer arreglos de tamaño variable.'
  },
  {
    id: 16, tema: 4, type: 'mc',
    question: '¿Qué significa recorrer un arreglo?',
    options: [
      'Ordenar el arreglo',
      'Acceder a cada elemento del arreglo secuencialmente (típicamente con un ciclo)',
      'Eliminar elementos',
      'Crear el arreglo'
    ],
    answer: 1,
    explanation: 'Recorrer significa visitar cada elemento. Típicamente con Para: Para i Desde 1 Hasta Longitud(arr) Hacer Escribir arr[i]; FinPara.'
  },

  // Taller práctico (4 ejercicios)
  {
    id: 17, tema: 1, type: 'open',
    question: 'TALLER PRÁCTICO 1: Crea un programa en PSeInt que lea 5 números y calcule su promedio. Usa un arreglo para almacenar los números.'
  },
  {
    id: 18, tema: 2, type: 'open',
    question: 'TALLER PRÁCTICO 2: Crea un programa que pida una calificación (0-5) y muestre: <3 "Deficiente", 3-3.9 "Insuficiente", 4-4.4 "Aceptable", >=4.5 "Sobresaliente". Usa estructuras condicionales.'
  },
  {
    id: 19, tema: 3, type: 'open',
    question: 'TALLER PRÁCTICO 3: Crea un programa que use un arreglo de 10 números y encuentre el mayor y el menor. Muestra ambos valores.'
  },
  {
    id: 20, tema: 4, type: 'open',
    question: 'TALLER PRÁCTICO 4: Implementa el algoritmo de búsqueda lineal en PSeInt. El programa debe buscar un número específico en un arreglo de 8 elementos y decir si lo encontró y en qué posición.'
  }
];

export function selectRandomQuestions(count = 8) {
  const mcQuestions = questionBank.filter(q => q.type === 'mc').sort(() => Math.random() - 0.5);
  const openQuestions = questionBank.filter(q => q.type === 'open');

  const mcCount = Math.min(4, count);
  const openCount = count - mcCount;

  return [...mcQuestions.slice(0, mcCount), ...openQuestions.slice(0, openCount)];
}

export const TOTAL_QUESTIONS = questionBank.length;
export const TOTAL_TIME = 30 * 60;
export const TIME_PER_MC = 45;
export const TIME_PER_OPEN = 300;
export const DEADLINE = new Date('2026-09-05T23:59:59-05:00');
export const MAX_ATTEMPTS = 2;
