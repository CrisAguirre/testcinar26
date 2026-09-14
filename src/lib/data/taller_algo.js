export const questionBank = [
  // Taller: Programación de Juegos
  {
    id: 1, tema: 6, type: 'mc',
    question: 'En el juego del "Número Mágico", ¿qué estructura es fundamental para permitir que el jugador intente adivinar repetidamente hasta acertar?',
    options: [
      'Un bucle Mientras (While) o Repetir-Hasta',
      'Una instrucción Según sea (Switch)',
      'Un arreglo unidimensional estático',
      'Una condición Si-Entonces (If-Then) sin bucle'
    ],
    answer: 0,
    explanation: 'El juego requiere repetir la solicitud del número hasta que el jugador acierte, lo cual se logra con un bucle Mientras.'
  },
  {
    id: 2, tema: 6, type: 'mc',
    question: 'Si se implementa el juego "Torres de Hanói" en DFD o pseudocódigo, ¿qué técnica de programación es la más elegante para resolver el movimiento de los discos?',
    options: [
      'Uso de 100 condicionales anidados',
      'Recursividad (una función que se llama a sí misma)',
      'Solo variables globales',
      'Múltiples ciclos Para (For) en secuencia'
    ],
    answer: 1,
    explanation: 'Las Torres de Hanói es el problema clásico por excelencia para enseñar y aplicar recursividad.'
  },
  {
    id: 3, tema: 6, type: 'mc',
    question: 'Al programar un juego de adivinanza, ¿cómo se genera la incertidumbre en el jugador?',
    options: [
      'Pidiéndole su edad',
      'Generando un número aleatorio (función Random / Azar)',
      'Mostrándole la respuesta desde el principio',
      'Usando un ciclo infinito'
    ],
    answer: 1,
    explanation: 'Las funciones de generación de números aleatorios (Random o Azar) son la base para crear mecánicas impredecibles en los juegos simples.'
  }
];

export const examConfig = {
  title: 'Taller Práctico - Algoritmos (Programación de Juegos)',
  duration: 60 * 60,
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    6: 3 // 3 preguntas tema juegos
  }
};

export function selectRandomQuestions(count = 3) {
  let selected = [];
  const distribution = examConfig.questionsToSelect;
  for (const tema in distribution) {
    const num = distribution[tema];
    const pool = questionBank.filter(q => q.tema === parseInt(tema));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selected = selected.concat(shuffled.slice(0, num));
  }
  return selected.sort(() => Math.random() - 0.5);
}
