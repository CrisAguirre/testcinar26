/**
 * Banco Parcial 1 — Algoritmos (19 y 20/10/2026 · todo el día).
 * Basado en el Taller 1 y ampliado a los 3 niveles:
 *   Nivel 1 — Operadores/secuenciales · Nivel 2 — Condicionales · Nivel 3 — Ciclos.
 *
 * Composición del examen (20 preguntas):
 *   - 15 teóricas: 5 por nivel (selección única de 4 opciones y de 2 opciones).
 *   - 5 prácticas: ejercicios DFD (archivos .dfd), con al menos 1 por nivel.
 *
 * Banco: 51 teóricas (17 por nivel) y 20 prácticas (7 N1 + 7 N2 + 6 N3).
 * Prácticas tipo 'file': el estudiante resuelve en el editor DFD y sube el .dfd.
 */

export const examConfig = {
  title: 'Parcial 1 - Algoritmos',
  dateLabel: 'Lunes 19 y martes 20/10/2026 · todo el día',
  duration: 120 * 60, // 2 horas (120 min) por intento, contadas desde el inicio
  totalQuestions: 20,
  theoryPerLevel: 5,
  practicalCount: 5,
  levelLabels: {
    1: 'Nivel 1 — Operadores',
    2: 'Nivel 2 — Condicionales',
    3: 'Nivel 3 — Ciclos'
  }
};

export const questionBank = [
  // ================= NIVEL 1 — Operadores (teóricas) =================
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
  {
    id: 4, tema: 1, type: 'mc',
    question: '¿Cuál es el resultado de la expresión 8 + 4 * 2, siguiendo la jerarquía de operadores?',
    options: [
      '24',
      '16',
      '12',
      '20'
    ],
    answer: 1,
    explanation: 'La multiplicación se resuelve antes que la suma: 4 * 2 = 8 y luego 8 + 8 = 16.'
  },
  {
    id: 5, tema: 1, type: 'mc',
    question: 'Se desea intercambiar los valores de las variables A y B (A tiene 5 y B tiene 9). ¿Qué secuencia de instrucciones lo logra correctamente?',
    options: [
      'A = B ; B = A',
      'Aux = A ; A = B ; B = Aux',
      'B = A ; A = B',
      'A = A + B ; B = A'
    ],
    answer: 1,
    explanation: 'Se necesita una variable auxiliar que guarde el valor original para no perderlo al reasignar.'
  },
  {
    id: 6, tema: 1, type: 'mc',
    question: 'Para calcular el área de un rectángulo con base (b) y altura (h), ¿cuál expresión es la correcta?',
    options: [
      'b + h',
      'b * h',
      '(b + h) * 2',
      'b * h / 2'
    ],
    answer: 1,
    explanation: 'El área de un rectángulo es base por altura. (b + h) * 2 sería el perímetro.'
  },
  {
    id: 7, tema: 1, type: 'mc',
    question: 'En un diagrama de flujo, ¿qué figura se utiliza para representar una asignación o proceso (por ejemplo, "suma = a + b")?',
    options: [
      'El rectángulo',
      'El rombo',
      'El óvalo',
      'El círculo'
    ],
    answer: 0,
    explanation: 'El rectángulo representa procesos u operaciones; el rombo, decisiones; y el óvalo, inicio/fin.'
  },
  {
    id: 8, tema: 1, type: 'mc',
    question: '¿Qué figura del diagrama de flujo representa la entrada y salida de datos (Leer / Escribir)?',
    options: [
      'El rectángulo',
      'El rombo',
      'El paralelogramo',
      'El óvalo'
    ],
    answer: 2,
    explanation: 'El paralelogramo se usa para leer datos del usuario o escribir resultados en pantalla.'
  },
  {
    id: 9, tema: 1, type: 'mc',
    question: 'Si inicializas una variable con el valor X = 10 y en el paso siguiente ejecutas la instrucción X = X + 5, ¿qué efecto tiene esta operación?',
    options: [
      'Genera un error porque X no puede ser igual a sí misma más 5.',
      'Crea una nueva variable matemática.',
      'Actualiza el valor de X incrementando su valor original en 5 (X ahora es 15).',
      'Asigna a X el valor estricto de 5.'
    ],
    answer: 2,
    explanation: 'La asignación X = X + 5 toma el valor actual (10), le suma 5 y guarda el resultado (15) en la misma variable.'
  },
  {
    id: 10, tema: 1, type: 'mc',
    question: 'Para convertir grados Celsius (C) a grados Fahrenheit (F), ¿cuál es la fórmula correcta?',
    options: [
      'F = C * 1.8 + 32',
      'F = C + 32',
      'F = (C - 32) * 1.8',
      'F = C * 32'
    ],
    answer: 0,
    explanation: 'La conversión correcta es multiplicar por 1.8 y sumar 32: F = C * 1.8 + 32.'
  },
  {
    id: 11, tema: 1, type: 'mc',
    question: '¿Qué representan los óvalos (elipses) en un diagrama de flujo?',
    options: [
      'Inicio y Fin del algoritmo',
      'Las decisiones',
      'Las asignaciones o cálculos',
      'Las entradas de datos'
    ],
    answer: 0,
    explanation: 'El óvalo marca dónde comienza y dónde termina el diagrama de flujo.'
  },
  {
    id: 12, tema: 1, type: 'mc',
    question: '¿Cuál es el orden correcto de las fases de un algoritmo secuencial?',
    options: [
      'Entrada, Proceso, Salida',
      'Proceso, Entrada, Salida',
      'Salida, Proceso, Entrada',
      'Entrada, Salida, Proceso'
    ],
    answer: 0,
    explanation: 'Primero se leen los datos (entrada), luego se procesan (cálculos) y finalmente se muestran los resultados (salida).'
  },
  {
    id: 13, tema: 1, type: 'mc',
    question: 'Verdadero o Falso: una división por cero dentro de un algoritmo produce un error y debe evitarse.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'La división por cero no está definida matemáticamente y genera errores en la ejecución.'
  },
  {
    id: 14, tema: 1, type: 'mc',
    question: '¿Cuál de estas expresiones calcula el 20% de un valor V?',
    options: ['V * 20', 'V * 0.20'],
    answer: 1,
    explanation: 'El 20% equivale a multiplicar por 0.20 (20/100). Multiplicar por 20 daría un valor veinte veces mayor.'
  },
  {
    id: 15, tema: 1, type: 'mc',
    question: 'Verdadero o Falso: la expresión (a + b) * c es equivalente a a + b * c.',
    options: ['Verdadero', 'Falso'],
    answer: 1,
    explanation: 'En a + b * c primero se multiplica (jerarquía); los paréntesis cambian el orden y el resultado.'
  },
  {
    id: 16, tema: 1, type: 'mc',
    question: 'Para calcular el doble de un número N y luego sumarle 5, ¿cuál expresión usarías?',
    options: ['N * 2 + 5', '(N + 5) * 2'],
    answer: 0,
    explanation: 'Primero el doble (N * 2) y luego la suma de 5. (N + 5) * 2 duplicaría también el 5.'
  },
  {
    id: 17, tema: 1, type: 'mc',
    question: 'Verdadero o Falso: en un algoritmo secuencial las instrucciones se ejecutan una tras otra, de arriba hacia abajo.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'Esa es la característica principal de la estructura secuencial: sin saltos ni repeticiones.'
  },

  // ================= NIVEL 2 — Condicionales (teóricas) =================
  {
    id: 18, tema: 2, type: 'mc',
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
    id: 19, tema: 2, type: 'mc',
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
    id: 20, tema: 2, type: 'mc',
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
  {
    id: 21, tema: 2, type: 'mc',
    question: '¿Qué condición verifica que un número N esté entre 1 y 100 (ambos incluidos)?',
    options: [
      'N >= 1 Y N <= 100',
      'N >= 1 O N <= 100',
      'N > 1 Y N < 100',
      'N == 1 Y N == 100'
    ],
    answer: 0,
    explanation: 'Se necesitan las dos condiciones unidas con Y (AND) e inclusivas: N >= 1 y N <= 100.'
  },
  {
    id: 22, tema: 2, type: 'mc',
    question: 'Un descuento aplica solo si el cliente es frecuente Y compra más de $100.000. ¿Qué operador lógico debe usarse para unir las dos condiciones?',
    options: [
      'O (OR)',
      'Y (AND)',
      'NO (NOT)',
      'XOR'
    ],
    answer: 1,
    explanation: 'El operador Y (AND) exige que ambas condiciones se cumplan al mismo tiempo.'
  },
  {
    id: 23, tema: 2, type: 'mc',
    question: '¿Cuál condición verifica correctamente que una persona es mayor de edad (18 años o más)?',
    options: [
      'Edad > 18',
      'Edad >= 18',
      'Edad <= 18',
      'Edad == 18'
    ],
    answer: 1,
    explanation: 'Mayor de edad incluye exactamente los 18: por eso se usa mayor o igual (>=).'
  },
  {
    id: 24, tema: 2, type: 'mc',
    question: '¿Qué figura del diagrama de flujo representa una decisión condicional?',
    options: [
      'El rectángulo',
      'El rombo',
      'El óvalo',
      'El paralelogramo'
    ],
    answer: 1,
    explanation: 'El rombo tiene dos salidas (Verdadero/Sí y Falso/No) y representa la evaluación de una condición.'
  },
  {
    id: 25, tema: 2, type: 'mc',
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
    id: 26, tema: 2, type: 'mc',
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
    id: 27, tema: 2, type: 'mc',
    question: 'Dado el fragmento: Si (a > b) Entonces mayor = a Sino mayor = b FinSi — ¿qué calcula este algoritmo?',
    options: [
      'El mayor de dos números',
      'El menor de dos números',
      'La suma de dos números',
      'El promedio de dos números'
    ],
    answer: 0,
    explanation: 'Si a es mayor que b guarda a; en caso contrario guarda b. Siempre queda el mayor de los dos.'
  },
  {
    id: 28, tema: 2, type: 'mc',
    question: 'En una estructura Según sea (Switch), si el valor evaluado no coincide con ningún caso y no existe un caso por defecto, ¿qué ocurre?',
    options: [
      'Se ejecuta el primer caso.',
      'No se ejecuta ningún caso.',
      'Se genera un error de sintaxis.',
      'El algoritmo se detiene.'
    ],
    answer: 1,
    explanation: 'Sin coincidencia y sin caso por defecto, simplemente no se ejecuta ninguna opción y el flujo continúa.'
  },
  {
    id: 29, tema: 2, type: 'mc',
    question: 'Verdadero o Falso: una estructura Si-Entonces puede ejecutarse sin la palabra Sino (else).',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'El Sino es opcional: si la condición es falsa y no hay Sino, simplemente no se hace nada.'
  },
  {
    id: 30, tema: 2, type: 'mc',
    question: '¿Cuál condición verifica correctamente que una contraseña ingresada coincide con la esperada "1234"?',
    options: ['contrasena == "1234"', 'contrasena = "1234"'],
    answer: 0,
    explanation: 'El operador de comparación es ==. Un solo = asigna el valor, no compara.'
  },
  {
    id: 31, tema: 2, type: 'mc',
    question: 'Verdadero o Falso: la condición N mod 2 == 1 se cumple cuando N es impar.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'Si el residuo de dividir entre 2 es 1, el número es impar.'
  },
  {
    id: 32, tema: 2, type: 'mc',
    question: 'Para decidir entre dos caminos mutuamente excluyentes (solo uno puede ocurrir), ¿qué estructura es más adecuada?',
    options: ['Si-Sino (If-Else)', 'Dos Si separados (If / If)'],
    answer: 0,
    explanation: 'Si-Sino garantiza que exactamente uno de los dos caminos se ejecute.'
  },
  {
    id: 33, tema: 2, type: 'mc',
    question: 'Verdadero o Falso: en un diagrama de flujo, del rombo de decisión siempre salen dos caminos etiquetados (Verdadero/Sí y Falso/No).',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'La decisión siempre tiene dos salidas posibles según el resultado de la condición.'
  },
  {
    id: 34, tema: 2, type: 'mc',
    question: 'Si peso = 80, ¿cuál de estas condiciones es verdadera?',
    options: ['peso >= 80', 'peso > 80'],
    answer: 0,
    explanation: 'peso >= 80 incluye el valor exacto 80; peso > 80 lo excluiría.'
  },

  // ================= NIVEL 3 — Ciclos (teóricas) =================
  {
    id: 35, tema: 3, type: 'mc',
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
    id: 36, tema: 3, type: 'mc',
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
    id: 37, tema: 3, type: 'mc',
    question: 'Para crear un menú que pregunta "Desea salir (S/N)" y se repite, ¿qué bucle garantiza al menos una ejecución?',
    options: [
      'Hacer-Mientras (Do-While / Repetir Hasta)',
      'Para (For)',
      'Mientras (While) básico',
      'If anidado'
    ],
    answer: 0,
    explanation: 'El bucle Hacer-Mientras o Repetir-Hasta ejecuta el bloque de código al menos una vez antes de evaluar la condición de salida.'
  },
  {
    id: 38, tema: 3, type: 'mc',
    question: 'En un ciclo, ¿qué es un contador?',
    options: [
      'Una variable que acumula sumas de valores.',
      'Una variable que aumenta o disminuye un valor fijo en cada iteración.',
      'La condición de salida del ciclo.',
      'Un tipo especial de ciclo.'
    ],
    answer: 1,
    explanation: 'El contador lleva la cuenta de las vueltas (por ejemplo: i = i + 1 en cada iteración).'
  },
  {
    id: 39, tema: 3, type: 'mc',
    question: '¿Qué es un acumulador dentro de un ciclo?',
    options: [
      'Una variable que guarda el último valor leído.',
      'Una variable que va sumando valores en cada iteración.',
      'Una variable que controla las vueltas del ciclo.',
      'Una condición lógica del ciclo.'
    ],
    answer: 1,
    explanation: 'El acumulador totaliza valores (por ejemplo: suma = suma + numero dentro del ciclo).'
  },
  {
    id: 40, tema: 3, type: 'mc',
    question: 'Si el contador i inicia en 1, ¿cuál condición de un ciclo Mientras permite recorrer los números del 1 al 10 (inclusive)?',
    options: [
      'Mientras i < 10',
      'Mientras i <= 10',
      'Mientras i > 10',
      'Mientras i == 10'
    ],
    answer: 1,
    explanation: 'Con <= 10 el ciclo incluye el 10 y se detiene en la iteración 11.'
  },
  {
    id: 41, tema: 3, type: 'mc',
    question: '¿Qué ocurre si la condición de un ciclo Mientras nunca llega a ser falsa?',
    options: [
      'Se produce un error de sintaxis.',
      'Se produce un ciclo infinito.',
      'El ciclo no se ejecuta nunca.',
      'Se produce un error de división.'
    ],
    answer: 1,
    explanation: 'Sin una actualización que rompa la condición, el ciclo se repite indefinidamente (ciclo infinito).'
  },
  {
    id: 42, tema: 3, type: 'mc',
    question: '¿En qué momento se evalúa la condición de un ciclo Mientras (While)?',
    options: [
      'Al final del ciclo.',
      'Antes de cada iteración.',
      'Solo la primera vez.',
      'Dentro del cuerpo del ciclo.'
    ],
    answer: 1,
    explanation: 'El ciclo Mientras verifica la condición antes de cada vuelta; si es falsa desde el inicio, no se ejecuta nunca.'
  },
  {
    id: 43, tema: 3, type: 'mc',
    question: 'Dado el fragmento: suma = 0, i = 1, Mientras i <= 3: suma = suma + i ; i = i + 1, FinMientras. ¿Cuánto vale suma al final?',
    options: [
      '3',
      '6',
      '10',
      '0'
    ],
    answer: 1,
    explanation: 'El ciclo suma 1 + 2 + 3 = 6 antes de que i alcance el valor 4 y la condición falle.'
  },
  {
    id: 44, tema: 3, type: 'mc',
    question: 'Para calcular el factorial de N con un ciclo, ¿qué operación debe realizarse en cada iteración?',
    options: [
      'Sumar el valor actual al acumulador.',
      'Multiplicar el acumulador por el contador.',
      'Dividir el acumulador entre el contador.',
      'Evaluar una condición múltiple.'
    ],
    answer: 1,
    explanation: 'El factorial es un producto: acumulador = acumulador * i en cada vuelta.'
  },
  {
    id: 45, tema: 3, type: 'mc',
    question: '¿Qué característica distingue al ciclo Repetir-Hasta (Do-While)?',
    options: [
      'Garantiza que el cuerpo se ejecute al menos una vez.',
      'Evalúa la condición antes de la primera vuelta.',
      'Solo funciona con números.',
      'No permite acumuladores.'
    ],
    answer: 0,
    explanation: 'El Repetir-Hasta evalúa la condición al final, por lo que el cuerpo siempre se ejecuta al menos una vez.'
  },
  {
    id: 46, tema: 3, type: 'mc',
    question: 'Verdadero o Falso: la variable que controla un ciclo (contador) debe actualizarse dentro del ciclo para evitar ciclos infinitos.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'Si el contador nunca cambia, la condición puede quedarse verdadera para siempre.'
  },
  {
    id: 47, tema: 3, type: 'mc',
    question: 'Cuando NO se sabe cuántas veces se repetirá un proceso, ¿qué ciclo es más adecuado?',
    options: ['Mientras (While)', 'Para (For)'],
    answer: 0,
    explanation: 'El Mientras repite mientras la condición se cumpla, sin necesidad de conocer el número de vueltas.'
  },
  {
    id: 48, tema: 3, type: 'mc',
    question: 'Verdadero o Falso: el ciclo Para (For) se usa cuando se conoce de antemano el número de repeticiones.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'El Para está diseñado para recorrer un rango conocido: desde, hasta y paso.'
  },
  {
    id: 49, tema: 3, type: 'mc',
    question: 'Para imprimir la serie 1, 2, 3, …, 10 con un ciclo Mientras, ¿qué instrucción debe ir dentro del ciclo para que avance?',
    options: ['i = i + 1', 'i = 1'],
    answer: 0,
    explanation: 'Cada vuelta debe incrementar el contador; si se deja i = 1, el ciclo sería infinito.'
  },
  {
    id: 50, tema: 3, type: 'mc',
    question: 'Si contador = 5 y la condición de un ciclo es "Mientras contador < 5", ¿qué ocurre?',
    options: ['El ciclo no se ejecuta nunca.', 'El ciclo se ejecuta infinitamente.'],
    answer: 0,
    explanation: 'La condición es falsa desde el inicio, por lo que el cuerpo del Mientras no se ejecuta.'
  },
  {
    id: 51, tema: 3, type: 'mc',
    question: 'Verdadero o Falso: un ciclo anidado es un ciclo que se ejecuta dentro de otro ciclo.',
    options: ['Verdadero', 'Falso'],
    answer: 0,
    explanation: 'Los ciclos anidados permiten recorrer estructuras como tablas o matrices (fila por fila y columna por columna).'
  },

  // ================= PRÁCTICAS DFD — NIVEL 1 =================
  {
    id: 101, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nDiseña un algoritmo que pida al usuario dos números y muestre el resultado de su suma, resta, multiplicación y división.\n\nImprime cada resultado con un mensaje claro, por ejemplo: "La suma es: " y el valor.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 102, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nDiseña un algoritmo que pida el radio (r) de un círculo y calcule e imprima su área y su perímetro. Usa π = 3.1416.\n\nPistas: Área = π · r² · Perímetro = 2 · π · r',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 103, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nDiseña un algoritmo que pida una temperatura en grados Celsius (C) y muestre su equivalente en grados Fahrenheit (F), usando la fórmula: F = C * 1.8 + 32.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 104, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nDiseña un algoritmo que pida las horas trabajadas de una persona y el valor por hora. Calcula su salario y muéstralo en pantalla.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 105, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nDiseña un algoritmo que pida 3 calificaciones, calcule su promedio e imprima el resultado.\n\nPista: el promedio es la suma de las calificaciones dividida entre 3.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 106, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nUna tienda ofrece un descuento del 15% sobre el total de la compra. Diseña un algoritmo que pida el valor total de la compra y muestre cuánto debe pagar finalmente el cliente.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 107, tema: 1, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 1 — Secuencial):\n\nDiseña un algoritmo que pida el precio unitario de un producto y la cantidad de unidades compradas. Calcula e imprime el total a pagar.',
    options: [],
    answer: null,
    explanation: ''
  },

  // ================= PRÁCTICAS DFD — NIVEL 2 =================
  {
    id: 108, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida un número y determine si es positivo, negativo o cero. Imprime el mensaje correspondiente en cada caso.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 109, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida dos números y muestre cuál de los dos es el mayor.\n\nConsidera qué hacer si los números son iguales (puedes indicar "Son iguales").',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 110, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida la edad de una persona y muestre "Es mayor de edad" si tiene 18 años o más, o "Es menor de edad" en caso contrario.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 111, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida 3 notas, calcule el promedio y muestre "Aprueba" si el promedio es mayor o igual a 3.0, o "Reprueba" en caso contrario.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 112, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida el valor de una compra. Si la compra supera $100.000, se aplica un descuento del 10%; si no, no hay descuento. Muestra el total final a pagar.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 113, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida un número entero y determine si es par o impar. Usa el operador módulo (mod) para evaluar la condición.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 114, tema: 2, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 2 — Condicionales):\n\nDiseña un algoritmo que pida dos números. Si ambos son mayores que 0, muestra "Ambos son positivos"; en caso contrario muestra "Al menos uno no es positivo".\n\nPista: usa una condición compuesta con el operador lógico Y (AND).',
    options: [],
    answer: null,
    explanation: ''
  },

  // ================= PRÁCTICAS DFD — NIVEL 3 =================
  {
    id: 115, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 3 — Ciclos):\n\nDiseña un algoritmo que muestre en pantalla los números del 1 al 10 usando un ciclo Mientras.\n\nRecuerda inicializar el contador antes del ciclo y actualizarlo dentro del mismo.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 116, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 3 — Ciclos):\n\nDiseña un algoritmo que pida un número N y calcule la suma de todos los números desde 1 hasta N usando un ciclo. Imprime el resultado final.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 117, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 3 — Ciclos):\n\nDiseña un algoritmo que pida un número N y muestre su tabla de multiplicar del 1 al 10 usando un ciclo.\n\nFormato sugerido: "N x 1 = resultado", "N x 2 = resultado", etc.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 118, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 3 — Ciclos):\n\nDiseña un algoritmo que pida números al usuario hasta que ingrese un 0 (el 0 no se cuenta). Al finalizar, muestra la suma total de los números ingresados y cuántos de ellos fueron mayores que cero.',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 119, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 3 — Ciclos):\n\nDiseña un algoritmo que pida cuántos términos se desean (N) y muestre los primeros N términos de la serie de Fibonacci, comenzando en 0 y 1.\n\nEjemplo con N = 6: 0, 1, 1, 2, 3, 5',
    options: [],
    answer: null,
    explanation: ''
  },
  {
    id: 120, tema: 3, type: 'file',
    question: 'Ejercicio Práctico DFD (Nivel 3 — Ciclos):\n\nDiseña un algoritmo que pida un número N (mayor o igual a 0) y calcule su factorial usando un ciclo.\n\nRecuerda: el factorial se calcula multiplicando 1 × 2 × 3 × … × N. Ejemplo: 5! = 120.',
    options: [],
    answer: null,
    explanation: ''
  }
];

/** @param {any[]} arr */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * @param {any[]} pool
 * @param {number} n
 */
function pick(pool, n) {
  return shuffle(pool).slice(0, n);
}

export const LEVELS = [1, 2, 3];

/**
 * Examen de 20 preguntas:
 *  - 15 teóricas: 5 por nivel (5 N1 + 5 N2 + 5 N3), mezcladas.
 *  - 5 prácticas: al menos 1 por nivel, el resto aleatorias del banco.
 * Las teóricas van primero y las prácticas al final.
 */
export function selectRandomQuestions() {
  const theory = [];
  for (const nivel of LEVELS) {
    const pool = questionBank.filter((q) => q.tema === nivel && q.type === 'mc');
    if (pool.length < examConfig.theoryPerLevel) {
      throw new Error(`Banco insuficiente en el nivel ${nivel}: se requieren ${examConfig.theoryPerLevel} teóricas y hay ${pool.length}`);
    }
    theory.push(...pick(pool, examConfig.theoryPerLevel));
  }

  // Prácticas: garantizar al menos una por nivel y completar con el resto del banco.
  const practicals = [];
  const rest = [];
  for (const nivel of LEVELS) {
    const pool = shuffle(questionBank.filter((q) => q.tema === nivel && q.type === 'file'));
    if (pool.length === 0) {
      throw new Error(`Banco sin prácticas para el nivel ${nivel}`);
    }
    practicals.push(pool[0]);
    rest.push(...pool.slice(1));
  }
  const missing = examConfig.practicalCount - practicals.length;
  if (rest.length < missing) {
    throw new Error(`Banco insuficiente de prácticas: faltan ${missing}, hay ${rest.length}`);
  }
  practicals.push(...pick(rest, missing));

  return [...shuffle(theory), ...shuffle(practicals)];
}

/**
 * Totales del banco por bucket (para pruebas y auditoría).
 */
export function getBucketCounts() {
  /** @type {{ theory: Record<number, number>, practical: Record<number, number> }} */
  const counts = {
    theory: { 1: 0, 2: 0, 3: 0 },
    practical: { 1: 0, 2: 0, 3: 0 }
  };
  for (const q of questionBank) {
    const bucket = q.type === 'file' ? counts.practical : counts.theory;
    bucket[q.tema]++;
  }
  return counts;
}
