export const questionBank = [
  // Nivel 1
  {
    id: 1, tema: 1, type: 'mc',
    question: 'En un algoritmo puramente secuencial (Nivel 1), si se requiere intercambiar los valores de dos variables A y B, ¿cuál es el procedimiento correcto?',
    options: [
      'Asignar A = B y luego B = A',
      'Usar una tercera variable auxiliar C (C = A, A = B, B = C)',
      'Multiplicar A por B y dividir',
      'Es imposible sin usar una estructura condicional'
    ],
    answer: 1,
    explanation: 'Para no perder el valor original de A al sobreescribirlo con B, se necesita guardarlo temporalmente en una variable auxiliar.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: 'Al calcular el promedio de 3 calificaciones enteras en un diagrama de flujo, ¿qué tipo de dato se debe esperar como resultado final?',
    options: [
      'Entero (Integer)',
      'Cadena de texto (String)',
      'Real o Flotante (Float)',
      'Booleano (Boolean)'
    ],
    answer: 2,
    explanation: 'La división de números enteros puede generar decimales, por lo que el tipo de dato resultante debe soportar valores Reales (Float).'
  },
  // Nivel 2
  {
    id: 3, tema: 2, type: 'mc',
    question: 'En una estructura condicional anidada (Nivel 2), ¿cuándo se evalúa la condición interna?',
    options: [
      'Al mismo tiempo que la externa',
      'Solo si la condición externa resulta ser Verdadera (o Falsa, dependiendo del flujo diseñado)',
      'Independientemente del resultado de la condición externa',
      'Al finalizar todo el algoritmo'
    ],
    answer: 1,
    explanation: 'Las condicionales anidadas dependen del resultado de la condicional padre en la jerarquía del flujo.'
  },
  {
    id: 4, tema: 2, type: 'mc',
    question: '¿Qué operador lógico debes usar si necesitas que una acción se ejecute SOLO cuando dos condiciones diferentes se cumplan al mismo tiempo?',
    options: [
      'OR (O)',
      'NOT (NO)',
      'XOR (O Exclusivo)',
      'AND (Y)'
    ],
    answer: 3,
    explanation: 'El operador AND (Y lógico) exige que todas las condiciones conectadas sean evaluadas como verdaderas.'
  },
  {
    id: 5, tema: 2, type: 'mc',
    question: 'Si en un diagrama de flujo tienes la condición "A > 5 O B < 10", ¿en qué caso el flujo se irá por la rama del FALSO?',
    options: [
      'Cuando A = 6 y B = 8',
      'Cuando A = 4 y B = 12',
      'Cuando A = 10 y B = 2',
      'Cuando A = 5 y B = 9'
    ],
    answer: 1,
    explanation: 'Como es un OR (O), para ser falso AMBAS condiciones deben ser falsas. Si A = 4 (no es mayor a 5) y B = 12 (no es menor a 10), toda la expresión es Falsa.'
  },
  // Ejercicio Práctico (File)
  {
    id: 6, tema: 3, type: 'file',
    question: 'Ejercicio Práctico en DFD (Elige UNO y sube el archivo .dfd):\n\nOpción A (Nivel 1): Diseña un algoritmo que calcule el salario neto de un trabajador conociendo el valor de la hora, la cantidad de horas trabajadas, y descontando un 8% por concepto de seguridad social.\n\nOpción B (Nivel 2): Diseña un algoritmo que solicite 3 números diferentes y determine imprimiendo en pantalla si fueron ingresados en orden "Ascendente", "Descendente" o "Desordenados".',
    options: [],
    answer: 0,
    explanation: ''
  }
];

export const examConfig = {
  title: 'Taller 1 - Algoritmos (Niveles 1 y 2)',
  duration: 90 * 60, // 90 minutos
  maxScore: 50,
  passingScore: 30,
  questionsToSelect: {
    1: 2, // 2 preguntas nivel 1
    2: 3, // 3 preguntas nivel 2
    3: 1  // 1 ejercicio practico
  }
};

export function selectRandomQuestions() {
  let selected = [];
  const distribution = examConfig.questionsToSelect;
  for (const tema in distribution) {
    const num = distribution[tema];
    const pool = questionBank.filter(q => q.tema === parseInt(tema));
    // Mezclar solo las preguntas de selección múltiple (temas 1 y 2)
    if (parseInt(tema) === 3) {
      selected = selected.concat(pool.slice(0, num));
    } else {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      selected = selected.concat(shuffled.slice(0, num));
    }
  }
  // Poner el ejercicio práctico al final
  const mcQuestions = selected.filter(q => q.type !== 'file');
  const fileQuestion = selected.filter(q => q.type === 'file');
  return [...mcQuestions, ...fileQuestion];
}
