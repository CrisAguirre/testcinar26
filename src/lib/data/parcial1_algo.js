export const questionBank = [
  // Nivel 1: Operadores
  {
    id: 1, tema: 1, type: 'mc',
    question: 'Para calcular el promedio de 3 calificaciones (c1, c2, c3), ¿cuál es la expresión correcta?',
    options: [
      'c1 + c2 + c3 / 3',
      '(c1 + c2 + c3) / 3',
      'c1 + (c2 + c3) / 3',
      'c1 / 3 + c2 + c3'
    ],
    answer: 1,
    explanation: 'El uso de paréntesis garantiza que la suma se realice antes de la división.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: 'Si se aplica un descuento del 15% sobre el total T de una compra, ¿cuál es la fórmula para obtener el valor a pagar?',
    options: [
      'T - 0.15',
      'T * 0.15',
      'T - (T * 0.15)',
      'T / 0.15'
    ],
    answer: 2,
    explanation: 'Primero se halla el 15% multiplicando por 0.15, y luego se le resta al total original T.'
  },
  {
    id: 3, tema: 1, type: 'mc',
    question: 'Para calcular la cantidad de segundos totales dado un tiempo en horas (H), minutos (M) y segundos (S), ¿cómo se formula?',
    options: [
      'H * 60 + M * 60 + S',
      '(H * 60 * 60) + (M * 60) + S',
      '(H + M + S) * 60',
      'H * 3600 + M + S'
    ],
    answer: 1,
    explanation: 'Cada hora tiene 3600 segundos (60x60) y cada minuto tiene 60 segundos.'
  },

  // Nivel 2: Condicionales
  {
    id: 4, tema: 2, type: 'mc',
    question: '¿Qué condición permite determinar si un número N es par?',
    options: [
      'N / 2 == 0',
      'N mod 2 == 0',
      'N mod 2 == 1',
      'N * 2 == 0'
    ],
    answer: 1,
    explanation: 'El operador módulo (mod o %) obtiene el residuo de la división. Si el residuo entre 2 es 0, es par.'
  },
  {
    id: 5, tema: 2, type: 'mc',
    question: 'Para saber si un estudiante aprueba (nota >= 10.5), ¿qué estructura algorítmica se necesita?',
    options: [
      'Un ciclo Para (For)',
      'Una estructura Secuencial',
      'Una condición Si-Entonces (If-Then)',
      'Un ciclo Mientras (While)'
    ],
    answer: 2,
    explanation: 'La estructura Si-Entonces permite evaluar una condición (nota >= 10.5) y ejecutar una acción (aprobar).'
  },
  {
    id: 6, tema: 2, type: 'mc',
    question: 'Si se aplican diferentes descuentos según el color de una bolita, ¿qué estructura es la más adecuada?',
    options: [
      'Según sea (Switch / Case)',
      'Mientras (While)',
      'Ciclo Para (For)',
      'Llamada a función (Call)'
    ],
    answer: 0,
    explanation: 'La estructura Según Sea o Switch permite evaluar múltiples valores posibles de una misma variable de forma limpia.'
  },

  // Nivel 3: Ciclos o Bucles
  {
    id: 7, tema: 3, type: 'mc',
    question: '¿Qué estructura es ideal para sumar los 100 primeros números naturales?',
    options: [
      'Si-Entonces (If-Then)',
      'Para (For) de 1 hasta 100',
      'Mientras (While) contador < 0',
      'Según sea (Switch)'
    ],
    answer: 1,
    explanation: 'Cuando se conoce la cantidad exacta de iteraciones (100 veces), el ciclo Para (For) es el más apropiado.'
  },
  {
    id: 8, tema: 3, type: 'mc',
    question: 'Se desea solicitar números al usuario hasta que teclee un cero. ¿Qué ciclo debe usarse?',
    options: [
      'Para (For)',
      'Mientras (While) número diferente de cero',
      'Switch',
      'If-Else'
    ],
    answer: 1,
    explanation: 'Como no sabemos cuántos números ingresará el usuario, usamos un ciclo Mientras (While) evaluando la condición != 0.'
  },
  {
    id: 9, tema: 3, type: 'mc',
    question: 'Para crear un menú que pregunta "Desea salir (S/N)" y se repite, ¿qué bucle garantiza al menos una ejecución?',
    options: [
      'Hacer-Mientras (Do-While / Repetir Hasta)',
      'Para (For)',
      'Mientras (While) básico',
      'If anidado'
    ],
    answer: 0,
    explanation: 'El bucle Hacer-Mientras o Repetir-Hasta ejecuta el bloque de código al menos una vez antes de evaluar la condición de salida.'
  }
];

export const examConfig = {
  title: 'Parcial 1 - Algoritmos',
  duration: 45 * 60,
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    1: 3, // 3 preguntas nivel 1
    2: 3, // 3 preguntas nivel 2
    3: 3  // 3 preguntas nivel 3
  }
};

export function selectRandomQuestions(count = 9) {
  const distribution = [
    { tema: 1, count: 3 },
    { tema: 2, count: 3 },
    { tema: 3, count: 3 }
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
