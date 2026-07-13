export const introContent = {
  title: '¿Qué es la Algoritmia?',
  subtitle: 'Fundamentos para el desarrollo de software',
  paragraphs: [
    'La algoritmia es la disciplina que estudia la creación, diseño y análisis de algoritmos. Un algoritmo es una secuencia ordenada de pasos lógicos que permiten resolver un problema de manera sistemática y finita.',
    'En el mundo del desarrollo de software, la algoritmia es la base del pensamiento computacional. Antes de escribir una sola línea de código, un programador debe ser capaz de descomponer un problema complejo en partes más pequeñas, identificar patrones y definir una secuencia lógica de pasos que lleven a la solución.',
    'Dominar la algoritmia no solo mejora la calidad del código, sino que también desarrolla habilidades como el pensamiento crítico, la capacidad de abstracción y la resolución metódica de problemas —competencias esenciales para cualquier desarrollador profesional.'
  ],
  keyConcepts: [
    { term: 'Precisión', desc: 'Cada paso debe estar definido sin ambigüedad' },
    { term: 'Finitud', desc: 'Debe tener un número finito de pasos y terminar en algún momento' },
    { term: 'Eficiencia', desc: 'Debe resolver el problema utilizando la menor cantidad de recursos posible' },
    { term: 'Determinismo', desc: 'Dada una misma entrada, debe producir siempre la misma salida' }
  ]
};

export const ALGORITMIA_SUBJECT = 'Desarrollo Web 1 - Algoritmia';

export const algorithms = [
  {
    id: 1,
    title: 'Promedio de calificaciones',
    icon: '📊',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que calcule el promedio de una lista de N calificaciones. Debe manejar la suma acumulada y el conteo de elementos.',
    problem: {
      scenario: 'Un profesor necesita calcular el promedio de notas de sus estudiantes para generar un reporte académico. Dado un conjunto de N calificaciones (0-100), se requiere obtener el promedio general.',
      example: 'Entrada: [85, 90, 78, 92, 88] → Salida: Promedio = 86.6'
    },
    sequence: [
      { step: 1, desc: 'Inicializar un acumulador suma en 0 y un contador en 0' },
      { step: 2, desc: 'Recorrer cada calificación del conjunto' },
      { step: 3, desc: 'Sumar la calificación actual al acumulador suma' },
      { step: 4, desc: 'Incrementar el contador en 1' },
      { step: 5, desc: 'Al terminar el recorrido, dividir suma entre el contador' },
      { step: 6, desc: 'Retornar el resultado como el promedio final' }
    ],
    solution: `Inicio
  suma ← 0
  contador ← 0
  Para cada calificacion en lista:
    suma ← suma + calificacion
    contador ← contador + 1
  Fin Para
  promedio ← suma / contador
  Escribir "Promedio:", promedio
Fin`,
    conceptosClave: ['Acumuladores', 'Iteración', 'División'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'suma ← 0\ncontador ← 0' },
      { type: 'decision', text: '¿Hay más\ncalificaciones?' },
      { type: 'process', text: 'suma ← suma + calif\ncontador++' },
      { type: 'process', text: 'promedio ← suma / contador' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 2,
    title: 'Determinar el mayor de tres números',
    icon: '🏆',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que reciba tres números y determine cuál es el mayor, sin usar funciones predefinidas de máximo.',
    problem: {
      scenario: 'En un concurso de programación, se ingresan tres puntajes y se debe determinar cuál es el más alto para declarar al ganador. No se permite usar funciones predefinidas de máximo.',
      example: 'Entrada: 45, 78, 32 → Salida: El mayor es 78'
    },
    sequence: [
      { step: 1, desc: 'Leer los tres números A, B y C' },
      { step: 2, desc: 'Comparar A con B: si A es mayor o igual que B, pasar al paso 3; si no, pasar al paso 4' },
      { step: 3, desc: 'Comparar A con C: si A es mayor o igual que C, el mayor es A; si no, el mayor es C' },
      { step: 4, desc: 'Comparar B con C: si B es mayor o igual que C, el mayor es B; si no, el mayor es C' },
      { step: 5, desc: 'Retornar el valor identificado como el mayor' }
    ],
    solution: `Inicio
  Leer A, B, C
  Si A >= B Entonces
    Si A >= C Entonces
      mayor ← A
    Sino
      mayor ← C
    Fin Si
  Sino
    Si B >= C Entonces
      mayor ← B
    Sino
      mayor ← C
    Fin Si
  Fin Si
  Escribir "El mayor es:", mayor
Fin`,
    conceptosClave: ['Condicionales anidados', 'Comparación', 'Toma de decisiones'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer A, B, C' },
      { type: 'decision', text: '¿A >= B?' },
      { type: 'decision', text: '¿A >= C?', branch: 'Sí' },
      { type: 'process', text: 'mayor ← A', branch: 'Sí' },
      { type: 'process', text: 'mayor ← C', branch: 'No (A >= B)' },
      { type: 'decision', text: '¿B >= C?', branch: 'No (A >= B)' },
      { type: 'process', text: 'mayor ← B', branch: 'No (A >= B) → Sí' },
      { type: 'process', text: 'mayor ← C', branch: 'No (A >= B) → No' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 3,
    title: 'Números primos',
    icon: '🔢',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que determine si un número ingresado es primo o no. Recuerda que un número primo solo es divisible por 1 y por sí mismo.',
    problem: {
      scenario: 'Un sistema de criptografía básica necesita determinar si un número ingresado es primo para usarlo en la generación de claves. Un número primo solo es divisible por 1 y por sí mismo.',
      example: 'Entrada: 17 → Salida: Es primo | Entrada: 21 → Salida: No es primo'
    },
    sequence: [
      { step: 1, desc: 'Leer el número N a evaluar' },
      { step: 2, desc: 'Si N es menor o igual a 1, no es primo (fin)' },
      { step: 3, desc: 'Inicializar un divisor en 2 y una bandera esPrimo en verdadero' },
      { step: 4, desc: 'Mientras divisor sea menor que N y esPrimo sea verdadero, repetir:' },
      { step: 5, desc: '  Si N es divisible por divisor (N % divisor = 0), marcar esPrimo como falso' },
      { step: 6, desc: '  Incrementar divisor en 1' },
      { step: 7, desc: 'Al salir del ciclo, si esPrimo es verdadero, N es primo; si no, no lo es' }
    ],
    solution: `Inicio
  Leer N
  Si N <= 1 Entonces
    Escribir "No es primo"
    Terminar
  Fin Si
  esPrimo ← Verdadero
  divisor ← 2
  Mientras divisor < N Y esPrimo = Verdadero:
    Si N % divisor = 0 Entonces
      esPrimo ← Falso
    Fin Si
    divisor ← divisor + 1
  Fin Mientras
  Si esPrimo = Verdadero Entonces
    Escribir N, "es primo"
  Sino
    Escribir N, "no es primo"
  Fin Si
Fin`,
    conceptosClave: ['Ciclos condicionales', 'Operador módulo', 'Banderas lógicas'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer N' },
      { type: 'decision', text: '¿N <= 1?' },
      { type: 'process', text: 'divisor ← 2\nesPrimo ← V', branch: 'No' },
      { type: 'decision', text: '¿divisor < N\ny esPrimo?', branch: 'No' },
      { type: 'decision', text: '¿N % divisor = 0?', branch: 'Sí (ciclo)' },
      { type: 'process', text: 'esPrimo ← F', branch: 'Sí' },
      { type: 'process', text: 'divisor++', branch: 'No' },
      { type: 'decision', text: '¿esPrimo?', branch: 'Sale del ciclo' },
      { type: 'process', text: 'Escribir "Es primo"', branch: 'Sí' },
      { type: 'process', text: 'Escribir "No es primo"', branch: 'No (N<=1)' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 4,
    title: 'Invertir una cadena de texto',
    icon: '🔄',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que reciba una cadena de texto y devuelva la misma cadena pero con los caracteres en orden inverso.',
    problem: {
      scenario: 'Una aplicación de procesamiento de textos necesita invertir cadenas como parte de un algoritmo de encriptación simple. Dada una palabra o frase, se debe devolver su versión invertida carácter por carácter.',
      example: 'Entrada: "HOLA" → Salida: "ALOH" | Entrada: "MUNDO" → Salida: "ODNUM"'
    },
    sequence: [
      { step: 1, desc: 'Leer la cadena de texto original' },
      { step: 2, desc: 'Obtener la longitud total de la cadena (N)' },
      { step: 3, desc: 'Inicializar una variable resultado como cadena vacía' },
      { step: 4, desc: 'Recorrer la cadena desde el último carácter (posición N-1) hasta el primero (posición 0)' },
      { step: 5, desc: '  Concatenar el carácter actual al resultado' },
      { step: 6, desc: 'Retornar la cadena resultado como la versión invertida' }
    ],
    solution: `Inicio
  Leer texto
  N ← longitud(texto)
  resultado ← ""
  Para i desde N-1 hasta 0:
    resultado ← resultado + texto[i]
  Fin Para
  Escribir "Texto invertido:", resultado
Fin`,
    conceptosClave: ['Iteración inversa', 'Concatenación', 'Índices'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer texto\nN ← long(texto)' },
      { type: 'process', text: 'resultado ← ""\ni ← N-1' },
      { type: 'decision', text: '¿i >= 0?' },
      { type: 'process', text: 'resultado ← resultado + texto[i]\ni--' },
      { type: 'process', text: 'Escribir resultado' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 5,
    title: 'Contar vocales en una frase',
    icon: '📝',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que cuente cuántas vocales (a, e, i, o, u) tiene una frase ingresada por el usuario, sin distinguir mayúsculas de minúsculas.',
    problem: {
      scenario: 'Un analizador de texto necesita contar cuántas vocales (a, e, i, o, u) contiene una frase ingresada por el usuario, ignorando mayúsculas y minúsculas. Esto sirve para métricas de legibilidad de textos.',
      example: 'Entrada: "Hola Mundo" → Salida: Vocales = 4 (o, a, u, o)'
    },
    sequence: [
      { step: 1, desc: 'Leer la frase y convertirla a minúsculas para facilitar la comparación' },
      { step: 2, desc: 'Inicializar un contador de vocales en 0' },
      { step: 3, desc: 'Recorrer cada carácter de la frase' },
      { step: 4, desc: '  Si el carácter es "a", "e", "i", "o" o "u", incrementar el contador en 1' },
      { step: 5, desc: 'Al terminar el recorrido, retornar el valor del contador' }
    ],
    solution: `Inicio
  Leer frase
  frase ← minusculas(frase)
  contador ← 0
  Para cada caracter en frase:
    Si caracter = "a" O caracter = "e" O 
       caracter = "i" O caracter = "o" O caracter = "u" Entonces
      contador ← contador + 1
    Fin Si
  Fin Para
  Escribir "Vocales encontradas:", contador
Fin`,
    conceptosClave: ['Recorrido de caracteres', 'Condicionales múltiples', 'Contadores', 'Normalización de datos'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer frase\nfrase ← min(frase)' },
      { type: 'process', text: 'contador ← 0' },
      { type: 'decision', text: '¿Hay más\ncaracteres?' },
      { type: 'decision', text: '¿Es a/e/i/o/u?' },
      { type: 'process', text: 'contador++', branch: 'Sí' },
      { type: 'process', text: 'Escribir contador' },
      { type: 'end', text: 'Fin' }
    ]
  }
];

export function getAlgorithmById(id) {
  return algorithms.find(a => a.id === id);
}
