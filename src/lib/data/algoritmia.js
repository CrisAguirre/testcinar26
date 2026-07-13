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
  },
  {
    id: 6,
    title: 'Factorial de un número',
    icon: '❕',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que calcule el factorial de un número entero positivo N. El factorial de N (N!) es el producto de todos los enteros desde 1 hasta N.',
    problem: {
      scenario: 'En análisis combinatorio se necesita calcular el factorial de un número para determinar permutaciones posibles. El factorial de N (N!) se define como el producto de todos los números enteros positivos desde 1 hasta N.',
      example: 'Entrada: 5 → Salida: 120 (1×2×3×4×5) | Entrada: 0 → Salida: 1 (por definición)'
    },
    sequence: [
      { step: 1, desc: 'Leer el número N' },
      { step: 2, desc: 'Si N es 0 o 1, retornar 1 (casos base)' },
      { step: 3, desc: 'Inicializar un acumulador resultado en 1' },
      { step: 4, desc: 'Desde i = 2 hasta N, repetir:' },
      { step: 5, desc: '  Multiplicar resultado por i y almacenar en resultado' },
      { step: 6, desc: 'Retornar resultado como el factorial de N' }
    ],
    solution: `Inicio
  Leer N
  Si N = 0 O N = 1 Entonces
    Escribir 1
    Terminar
  Fin Si
  resultado ← 1
  Para i desde 2 hasta N:
    resultado ← resultado * i
  Fin Para
  Escribir "Factorial:", resultado
Fin`,
    conceptosClave: ['Acumuladores multiplicativos', 'Ciclos definidos', 'Casos base'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer N' },
      { type: 'decision', text: '¿N = 0 o\nN = 1?' },
      { type: 'process', text: 'resultado ← 1\ni ← 2', branch: 'No' },
      { type: 'decision', text: '¿i <= N?' },
      { type: 'process', text: 'resultado ← resultado * i\ni++' },
      { type: 'process', text: 'Escribir 1', branch: 'Sí' },
      { type: 'process', text: 'Escribir resultado' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 7,
    title: 'Número palíndromo',
    icon: '🔁',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que determine si un número entero es palíndromo (se lee igual al derecho y al revés). Por ejemplo: 1221 es palíndromo, 1234 no lo es.',
    problem: {
      scenario: 'Un sistema de validación de códigos debe verificar si un número de identificación es capicúa (palíndromo numérico), ya que ciertos códigos válidos tienen esta propiedad de simetría.',
      example: 'Entrada: 1221 → Salida: Es palíndromo | Entrada: 1234 → Salida: No es palíndromo'
    },
    sequence: [
      { step: 1, desc: 'Leer el número original N' },
      { step: 2, desc: 'Guardar el número original en una variable temporal' },
      { step: 3, desc: 'Inicializar invertido en 0' },
      { step: 4, desc: 'Mientras temporal sea mayor que 0, repetir:' },
      { step: 5, desc: '  Obtener el último dígito: digito ← temporal % 10' },
      { step: 6, desc: '  Agregar el dígito al invertido: invertido ← invertido * 10 + digito' },
      { step: 7, desc: '  Eliminar el último dígito: temporal ← temporal / 10' },
      { step: 8, desc: 'Comparar invertido con el original: si son iguales, es palíndromo; si no, no lo es' }
    ],
    solution: `Inicio
  Leer N
  original ← N
  invertido ← 0
  Mientras N > 0:
    digito ← N % 10
    invertido ← invertido * 10 + digito
    N ← N / 10
  Fin Mientras
  Si original = invertido Entonces
    Escribir "Es palíndromo"
  Sino
    Escribir "No es palíndromo"
  Fin Si
Fin`,
    conceptosClave: ['Descomposición numérica', 'Operador módulo', 'Inversión', 'Comparación'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer N\noriginal ← N' },
      { type: 'process', text: 'invertido ← 0' },
      { type: 'decision', text: '¿N > 0?' },
      { type: 'process', text: 'digito ← N % 10\ninvertido ← invertido*10 + digito\nN ← N / 10' },
      { type: 'decision', text: '¿original =\ninvertido?' },
      { type: 'process', text: 'Escribir "Es\npalíndromo"', branch: 'Sí' },
      { type: 'process', text: 'Escribir "No es\npalíndromo"', branch: 'No' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 8,
    title: 'Tabla de multiplicar',
    icon: '✖️',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que genere la tabla de multiplicar de un número N ingresado por el usuario, desde el 1 hasta el 10.',
    problem: {
      scenario: 'Una aplicación educativa necesita generar tablas de multiplicar interactivas para ayudar a los estudiantes a practicar operaciones aritméticas básicas.',
      example: 'Entrada: 5 → Salida: 5×1=5, 5×2=10, 5×3=15, ..., 5×10=50'
    },
    sequence: [
      { step: 1, desc: 'Leer el número N para generar su tabla' },
      { step: 2, desc: 'Inicializar un contador i en 1' },
      { step: 3, desc: 'Mientras i sea menor o igual a 10, repetir:' },
      { step: 4, desc: '  Calcular resultado ← N × i' },
      { step: 5, desc: '  Mostrar: "N × i = resultado"' },
      { step: 6, desc: '  Incrementar i en 1' },
      { step: 7, desc: 'Al terminar el ciclo, la tabla está completa' }
    ],
    solution: `Inicio
  Leer N
  i ← 1
  Mientras i <= 10:
    resultado ← N * i
    Escribir N, "x", i, "=", resultado
    i ← i + 1
  Fin Mientras
Fin`,
    conceptosClave: ['Ciclos condicionales', 'Multiplicación', 'Formato de salida', 'Contadores'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer N\ni ← 1' },
      { type: 'decision', text: '¿i <= 10?' },
      { type: 'process', text: 'result ← N * i\nMostrar "N×i=result"\ni++' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 9,
    title: 'Máximo Común Divisor (MCD)',
    icon: '📐',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que calcule el Máximo Común Divisor (MCD) de dos números enteros positivos utilizando el algoritmo de Euclides.',
    problem: {
      scenario: 'En criptografía y simplificación de fracciones se requiere calcular el MCD de dos números. El algoritmo de Euclides es el método más eficiente: se divide el mayor entre el menor y se repite con el residuo hasta obtener cero.',
      example: 'Entrada: 48, 18 → Salida: MCD = 6 (48/18 = 2 residuo 12, 18/12 = 1 residuo 6, 12/6 = 2 residuo 0)'
    },
    sequence: [
      { step: 1, desc: 'Leer los dos números A y B' },
      { step: 2, desc: 'Mientras B sea diferente de 0, repetir:' },
      { step: 3, desc: '  Guardar el residuo de A dividido B: residuo ← A % B' },
      { step: 4, desc: '  Asignar A ← B' },
      { step: 5, desc: '  Asignar B ← residuo' },
      { step: 6, desc: 'Al salir del ciclo, A contiene el MCD' },
      { step: 7, desc: 'Retornar A como el MCD de los números originales' }
    ],
    solution: `Inicio
  Leer A, B
  Mientras B != 0:
    residuo ← A % B
    A ← B
    B ← residuo
  Fin Mientras
  Escribir "MCD:", A
Fin`,
    conceptosClave: ['Algoritmo de Euclides', 'Operador módulo', 'Intercambio de variables', 'Iteración condicional'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer A, B' },
      { type: 'decision', text: '¿B != 0?' },
      { type: 'process', text: 'residuo ← A % B\nA ← B\nB ← residuo' },
      { type: 'process', text: 'Escribir "MCD:", A' },
      { type: 'end', text: 'Fin' }
    ]
  },
  {
    id: 10,
    title: 'Suma de dígitos',
    icon: '➕',
    practicePrompt: 'Escribe en pseudocódigo un algoritmo que sume todos los dígitos de un número entero positivo. Por ejemplo, para 1234 la suma es 1+2+3+4 = 10.',
    problem: {
      scenario: 'Un sistema de validación de tarjetas de crédito utiliza la suma de dígitos como parte del algoritmo de Luhn. Dado un número, se debe descomponer dígito por dígito y calcular la suma total.',
      example: 'Entrada: 1234 → Salida: 10 (1+2+3+4) | Entrada: 987 → Salida: 24 (9+8+7)'
    },
    sequence: [
      { step: 1, desc: 'Leer el número N' },
      { step: 2, desc: 'Inicializar suma en 0' },
      { step: 3, desc: 'Mientras N sea mayor que 0, repetir:' },
      { step: 4, desc: '  Obtener el último dígito: digito ← N % 10' },
      { step: 5, desc: '  Sumar el dígito al acumulador: suma ← suma + digito' },
      { step: 6, desc: '  Eliminar el último dígito: N ← N / 10' },
      { step: 7, desc: 'Retornar suma como el total de los dígitos' }
    ],
    solution: `Inicio
  Leer N
  suma ← 0
  Mientras N > 0:
    digito ← N % 10
    suma ← suma + digito
    N ← N / 10
  Fin Mientras
  Escribir "Suma de dígitos:", suma
Fin`,
    conceptosClave: ['Descomposición numérica', 'Acumuladores', 'Operador módulo', 'División entera'],
    flowchart: [
      { type: 'start', text: 'Inicio' },
      { type: 'process', text: 'Leer N\nsuma ← 0' },
      { type: 'decision', text: '¿N > 0?' },
      { type: 'process', text: 'digito ← N % 10\nsuma ← suma + digito\nN ← N / 10' },
      { type: 'process', text: 'Escribir "Suma:", suma' },
      { type: 'end', text: 'Fin' }
    ]
  }
];

export function getAlgorithmById(id) {
  return algorithms.find(a => a.id === id);
}
