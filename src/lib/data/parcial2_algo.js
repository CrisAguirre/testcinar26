export const questionBank = [
  // Nivel 4: Funciones
  {
    id: 1, tema: 4, type: 'mc',
    question: '¿Qué es una función en programación/algoritmia?',
    options: [
      'Un bloque de código reutilizable que realiza una tarea específica',
      'Un ciclo infinito',
      'Una variable global que almacena muchos datos',
      'Un error de compilación'
    ],
    answer: 0,
    explanation: 'Una función o subrutina es un conjunto de instrucciones agrupadas que resuelven una parte del problema y pueden llamarse múltiples veces.'
  },
  {
    id: 2, tema: 4, type: 'mc',
    question: 'Si se requiere que una función devuelva el cubo de un número, ¿qué instrucción es indispensable al final de su ejecución?',
    options: [
      'Escribir / Print',
      'Leer / Input',
      'Retornar / Return',
      'Romper / Break'
    ],
    answer: 2,
    explanation: 'La instrucción Retornar (Return) es la que envía el resultado final de la función de vuelta a quien la llamó.'
  },
  {
    id: 3, tema: 4, type: 'mc',
    question: '¿Qué son los parámetros de una función?',
    options: [
      'Los resultados que la función devuelve',
      'Variables temporales que la función recibe desde afuera para operar',
      'Los errores que la función puede producir',
      'El nombre que se le da a la función'
    ],
    answer: 1,
    explanation: 'Los parámetros (o argumentos) son los valores de entrada que la función necesita para trabajar, como la base y altura para calcular el área.'
  },

  // Nivel 5: Arreglos o Vectores
  {
    id: 4, tema: 5, type: 'mc',
    question: '¿Qué es un Array (Arreglo o Vector) unidimensional?',
    options: [
      'Una única variable que almacena un solo dato numérico',
      'Una estructura estática que almacena una colección de elementos, generalmente del mismo tipo',
      'Un bucle que se repite una cantidad indeterminada de veces',
      'Un tipo de función matemática'
    ],
    answer: 1,
    explanation: 'Un arreglo permite guardar múltiples elementos referenciados mediante un índice, como una lista continua en memoria.'
  },
  {
    id: 5, tema: 5, type: 'mc',
    question: 'Si se tiene un Array "A" con 10 elementos, y su índice inicia en 1, ¿cómo se accede al quinto elemento?',
    options: [
      'A[4]',
      'A(5)',
      'A[6]',
      'A(0)'
    ],
    answer: 1,
    explanation: 'Dependiendo del lenguaje, se usan corchetes o paréntesis. En DFD se usa A(índice). Si inicia en 1, el quinto es A(5).'
  },
  {
    id: 6, tema: 5, type: 'mc',
    question: '¿Qué ciclo es el más natural y recomendado para recorrer los elementos de un Array de principio a fin?',
    options: [
      'Ciclo Para (For)',
      'Mientras (While)',
      'Repetir Hasta (Do-While)',
      'Según sea (Switch)'
    ],
    answer: 0,
    explanation: 'El ciclo Para (For) es ideal para recorrer arreglos porque se conoce de antemano el tamaño (desde índice 1 hasta N).'
  }
];

export const examConfig = {
  title: 'Parcial 2 - Algoritmos',
  duration: 45 * 60,
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    4: 3, // 3 preguntas nivel 4
    5: 3  // 3 preguntas nivel 5
  }
};

export function selectRandomQuestions(count = 6) {
  const distribution = [
    { tema: 4, count: 3 },
    { tema: 5, count: 3 }
  ];

  const totalBase = distribution.reduce((s, d) => s + d.count, 0);
  let finalDist = distribution;

  if (count !== totalBase) {
    const factor = count / totalBase;
    finalDist = distribution.map(d => ({
      tema: d.tema,
      count: Math.max(1, Math.round(d.count * factor))
    }));
    let diff = count - finalDist.reduce((s, d) => s + d.count, 0);
    let i = 0;
    while (diff !== 0) {
      const idx = i % finalDist.length;
      if (diff > 0) {
        const pool = questionBank.filter(q => q.tema === finalDist[idx].tema);
        if (finalDist[idx].count < pool.length) {
          finalDist[idx].count++;
          diff--;
        }
      } else {
        if (finalDist[idx].count > 1) {
          finalDist[idx].count--;
          diff++;
        }
      }
      i++;
    }
  }

  const selected = [];
  for (const dist of finalDist) {
    const pool = questionBank.filter(q => q.tema === dist.tema);
    if (pool.length < dist.count) {
      throw new Error(`No hay suficientes preguntas para tema ${dist.tema}: se requieren ${dist.count}, hay ${pool.length}`);
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, dist.count));
  }

  return selected.sort(() => Math.random() - 0.5);
}
