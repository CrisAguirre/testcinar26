export const questionBank = [
  // Nivel 1
  {
    id: 1, tema: 1, type: 'mc',
    question: 'En un diagrama de flujo, si solicitas el año de nacimiento para calcular la edad actual (asumiendo que ya cumplió años este año), ¿cuál es la expresión aritmética correcta?',
    options: [
      'Edad = Año de Nacimiento - Año Actual',
      'Edad = Año Actual - Año de Nacimiento',
      'Edad = Año de Nacimiento + Año Actual',
      'Edad = (Año Actual + Año de Nacimiento) / 2'
    ],
    answer: 1,
    explanation: 'Para calcular la edad se debe restar el año de nacimiento al año actual.'
  },
  {
    id: 2, tema: 1, type: 'mc',
    question: 'Si inicializas una variable con el valor X = 10 y en el paso siguiente ejecutas la instrucción X = X + 5. ¿Qué efecto tiene esta operación?',
    options: [
      'Genera un error porque X no puede ser igual a sí misma más 5.',
      'Crea una nueva variable matemática.',
      'Actualiza el valor de X incrementando su valor original en 5 (X ahora es 15).',
      'Asigna a X el valor estricto de 5.'
    ],
    answer: 2,
    explanation: 'En programación, la asignación evalúa la parte derecha (10 + 5) y la almacena en la variable de la izquierda.'
  },
  // Nivel 2
  {
    id: 3, tema: 2, type: 'mc',
    question: 'Al utilizar una estructura condicional, si la condición evaluada es (Edad >= 18 Y Tiene_Licencia == "Sí"), ¿qué sucederá si el usuario tiene 25 años pero NO tiene licencia?',
    options: [
      'El flujo irá por el camino de "Verdadero" porque cumple con la edad.',
      'El flujo irá por el camino de "Falso" porque ambas condiciones deben cumplirse.',
      'El programa se detendrá por un error lógico.',
      'El flujo evalúa solo la primera condición y aprueba.'
    ],
    answer: 1,
    explanation: 'El operador Y (AND) requiere que TODAS las condiciones sean verdaderas para ir por el flujo de Verdadero.'
  },
  {
    id: 4, tema: 2, type: 'mc',
    question: '¿Para qué caso de uso es estrictamente necesario implementar condicionales anidados (un condicional dentro del "Sí" o "No" de otro)?',
    options: [
      'Para solicitar varias variables al mismo tiempo.',
      'Para realizar operaciones matemáticas complejas.',
      'Para tomar decisiones secundarias que solo tienen sentido si se cumplió (o no) una decisión principal.',
      'Para repetir una tarea varias veces.'
    ],
    answer: 2,
    explanation: 'Los condicionales anidados permiten ramificar el flujo lógicamente dependiendo de las decisiones anteriores.'
  },
  {
    id: 5, tema: 2, type: 'mc',
    question: 'Si se requiere diseñar un algoritmo que determine si un número ingresado por el usuario es par o impar, ¿qué operador es fundamental incluir en la evaluación de la condición?',
    options: [
      'División exacta (/)',
      'Multiplicación (*)',
      'Módulo o Resto de la división (MOD o %)',
      'Raíz Cuadrada'
    ],
    answer: 2,
    explanation: 'El operador módulo devuelve el resto de una división. Si un número MOD 2 es igual a 0, significa que el número es par.'
  },
  // Ejercicios Prácticos (Files)
  {
    id: 6, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 - Secuencial):\n\nDiseña un algoritmo que solicite una cantidad de dinero en Pesos Colombianos y calcule a cuántos Dólares, Euros y Yenes equivale. Asume las siguientes tasas de cambio fijas:\n- 1 Dólar = 4000 Pesos\n- 1 Euro = 4300 Pesos\n- 1 Yen = 28 Pesos\nEl algoritmo debe imprimir en pantalla los tres resultados finales.',
    options: [],
    answer: 0,
    explanation: ''
  },
  {
    id: 7, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 - Condicionales):\n\nDiseña un algoritmo para una tienda de zapatos. El algoritmo debe solicitar la talla del zapato y el número de pares a comprar.\n- Si la talla es mayor a 40, cada par cuesta $80.000, de lo contrario, cada par cuesta $60.000.\n- Adicionalmente, si la cantidad de pares a comprar es igual o mayor a 3, se aplica un descuento del 15% sobre el total neto.\nEl algoritmo debe calcular e imprimir el total final a pagar (después de aplicar el descuento si aplica).',
    options: [],
    answer: 0,
    explanation: ''
  }
];

export const examConfig = {
  title: 'Taller 1 - Algoritmos (Niveles 1 y 2)',
  duration: 90 * 60, // 90 minutos
  maxScore: 70,
  passingScore: 40,
  questionsToSelect: {
    1: 2, // 2 preguntas nivel 1
    2: 3, // 3 preguntas nivel 2
    3: 2  // 2 ejercicios practicos
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
  // Poner los ejercicios prácticos al final
  const mcQuestions = selected.filter(q => q.type !== 'file');
  const fileQuestions = selected.filter(q => q.type === 'file');
  return [...mcQuestions, ...fileQuestions];
}
