export interface TallerQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const tallerQuestions: TallerQuestion[] = [
  {
    id: 'taller_1',
    question: '1. Un algoritmo calcula el área de un triángulo usando la fórmula Área = (Base * Altura) / 2. Si la Base ingresada es 4 y la Altura es 5, ¿qué resultado arrojará el algoritmo tras ejecutar la operación?',
    options: ['10', '20', '9', '2.5'],
    correctAnswer: 0
  },
  {
    id: 'taller_2',
    question: '2. En un algoritmo que utiliza bloques lógicos, ¿qué condición se utiliza típicamente con el operador módulo (%) para determinar si una variable N es par?',
    options: ['N % 2 == 1', 'N % 2 == 0', 'N / 2 == 0', 'N % 10 == 0'],
    correctAnswer: 1
  },
  {
    id: 'taller_3',
    question: '3. Si un algoritmo de conversión de temperatura utiliza la fórmula F = (C * 9/5) + 32, y la entrada es C=10, ¿cuál es la salida correcta?',
    options: ['32', '42', '50', '68'],
    correctAnswer: 2
  },
  {
    id: 'taller_4',
    question: '4. Un trabajador gana $15 por hora. Si trabaja 40 horas, ¿qué operación realiza correctamente el algoritmo para calcular su salario semanal?',
    options: ['Salario = (15 * 40) / 2', 'Salario = 15 + 40', 'Salario = 40 / 15', 'Salario = 15 * 40'],
    correctAnswer: 3
  },
  {
    id: 'taller_5',
    question: '5. Para verificar si una persona es mayor de edad (18 años o más) dentro de un diagrama de flujo, ¿cuál es la estructura condicional correcta?',
    options: ['Si edad >= 18 Entonces', 'Si edad > 18 Entonces', 'Si edad = 18 Entonces', 'Si edad <= 18 Entonces'],
    correctAnswer: 0
  }
];
