// Enunciados de ejercicios DFD — fuente única para Actividad de la semana y Editor DFD.
// Nivel 1: Operadores secuenciales (16) · Nivel 2: Condicionales Si/No (22) · Nivel 3: Ciclos (12) · Nivel 4: Funciones (10) · Nivel 5: Arreglos (10) · Nivel 6: Matrices (8) · Nivel 7: Sistemas de Menú (8)

export const problemsN1 = [
	{ id: 1, text: 'Pedir 2 números al usuario y sumarlos, restarlos, multiplicarlos y dividirlos.', propuesto: false },
	{ id: 2, text: 'Convertir Grados Celsius a Grados Fahrenheit', propuesto: true },
	{ id: 3, text: 'Sacar la hipotenusa de un triángulo rectángulo, pidiendo al usuario el valor de los 2 catetos.', propuesto: false },
	{ id: 4, text: 'Hacer un Programa que calcule longitudes de Circunferencia.', propuesto: true },
	{ id: 5, text: 'Hacer un Programa que calcule áreas de trapecios.', propuesto: false },
	{ id: 6, text: 'Calcule la media aritmética de 3 números cualesquiera.', propuesto: true },
	{ id: 7, text: 'Una tienda ofrece un descuento del 15% sobre el total de la compra y un cliente desea saber cuánto deberá pagar finalmente por su compra.', propuesto: false },
	{ id: 8, text: 'Dadas las horas trabajadas de una persona y el valor por hora. Calcular su salario e imprimirlo.', propuesto: true },
	{ id: 9, text: 'Calcular el nuevo salario de un obrero si obtuvo un incremento del 25% sobre su salario anterior.', propuesto: false },
	{ id: 10, text: 'Un alumno desea saber cuál será su calificación final en la materia de Algoritmos. Dicha calificación se compone de los siguientes porcentajes: 55% del promedio de sus tres calificaciones parciales, 30% de la calificación del examen final, 15% de la calificación de un trabajo final.', propuesto: true },
	{ id: 11, text: 'Calcular la cantidad de segundos que están incluidos en el número de horas, minutos y segundos ingresados por el usuario.', propuesto: false },
	{ id: 12, text: 'Hacer un Programa que obtenga la media geométrica de tres numeros.', propuesto: true },
	{ id: 13, text: 'Un maestro desea saber que porcentaje de hombres y que porcentaje de mujeres hay en un grupo de estudiantes.', propuesto: false },
	{ id: 14, text: 'Volumen y Área de un Cubo.', propuesto: true },
	{ id: 15, text: 'Tres personas deciden invertir su dinero para fundar un empresa. Cada una de ellas invierte una cantidad distinta. Obtener el porcentaje que cada quien invierte con respecto a la cantidad total invertida.', propuesto: false },
	{ id: 16, text: 'Volumen y Área de una Esfera.', propuesto: true }
];

export const problemsN2 = [
	{ id: 1, text: 'Determinar si un alumno aprueba o reprueba un curso, sabiendo que aprobará si su promedio de tres calificaciones es mayor o igual a 10.5; reprueba en caso contrario.', propuesto: false },
	{ id: 2, text: 'Mostrar el resultado de la suma de 2 números enteros, si esta supera a 10.', propuesto: true },
	{ id: 3, text: 'Determinar si un número es par, impar o cero.', propuesto: false },
	{ id: 4, text: 'Dado 3 números calcular el mayor.', propuesto: true },
	{ id: 5, text: 'Ingrese 2 números desde el teclado e imprima solo los positivos.', propuesto: false },
	{ id: 6, text: 'Un obrero necesita calcular su salario semanal: si trabaja 40 horas o menos se le paga $16 por hora; si trabaja más de 40 horas se le paga $16 por las primeras 40 y $20 por cada hora extra.', propuesto: true },
	{ id: 7, text: 'Ingresar por teclado el nombre y el signo de cualquier persona e imprima el nombre solo si la persona es signo Aries.', propuesto: false },
	{ id: 8, text: 'Ingresar nombre, edad y sexo e imprima, solo si es masculino y mayor de edad, el nombre de la persona.', propuesto: true },
	{ id: 9, text: 'Calcule el total a pagar por camisas: 3 o más 20% de descuento, menos de 3 un 10%.', propuesto: false },
	{ id: 10, text: 'Supermercado: número al azar; si es menor que 74 descuento 15%, si es mayor o igual a 74 descuento 20%. Calcular descuento.', propuesto: true },
	{ id: 11, text: 'Llantera: cada llanta $800 si se compran menos de 5 y $700 si son 5 o más. Calcular total.', propuesto: false },
	{ id: 12, text: 'Almacén: 20% de descuento si la compra supera $1000. ¿Cuánto pagará?', propuesto: true },
	{ id: 13, text: 'Ecuaciones de segundo grado: Ax^2 + Bx + C. Calcular raíces.', propuesto: false },
	{ id: 14, text: 'Leer 2 números e imprimirlos en forma ascendente.', propuesto: true },
	{ id: 15, text: 'Simular el lanzamiento de una moneda (cara / sello).', propuesto: false },
	{ id: 16, text: 'Motos: Honda 5%, Yamaha 8%, Suzuki 10%, otras marcas 2% de descuento.', propuesto: true },
	{ id: 17, text: 'Bolita: blanca 0%, verde 10%, amarilla 25%, azul 50%, roja 100% de descuento sobre la compra.', propuesto: false },
	{ id: 18, text: 'Pedir tres números y detectar si están en orden creciente.', propuesto: true },
	{ id: 19, text: 'Pedir tres números e indicar si el tercero es igual a la suma de los dos primeros.', propuesto: false },
	{ id: 20, text: 'Tomar tres números y decir si la multiplicación de los dos primeros es igual al tercero.', propuesto: true },
	{ id: 21, text: 'Leer hora en horas:minutos:segundos y decir la hora un segundo después.', propuesto: false },
	{ id: 22, text: 'Tomar dos números y decir si ambos son pares o impares.', propuesto: true }
];

export const problemsN3 = [
	{ id: 1, text: 'Mostrar en pantalla los números del 1 al 10 usando un ciclo Mientras.', propuesto: false },
	{ id: 2, text: 'Pedir un número N y mostrar la suma de todos los números desde 1 hasta N.', propuesto: true },
	{ id: 3, text: 'Pedir un número N y mostrar su tabla de multiplicar del 1 al 10.', propuesto: false },
	{ id: 4, text: 'Pedir un número N y contar cuántos números pares hay entre 1 y N.', propuesto: true },
	{ id: 5, text: 'Pedir la cantidad de notas (N) y luego N notas, para calcular e imprimir el promedio.', propuesto: false },
	{ id: 6, text: 'Pedir un número N y calcular su factorial (N! = 1 × 2 × 3 × … × N).', propuesto: true },
	{ id: 7, text: 'Pedir una base y un exponente, y calcular la potencia usando un ciclo de multiplicaciones.', propuesto: false },
	{ id: 8, text: 'Pedir dos números M y K, y mostrar los K primeros múltiplos de M.', propuesto: true },
	{ id: 9, text: 'Pedir números al usuario hasta que ingrese 0; al final mostrar la suma total ingresada.', propuesto: false },
	{ id: 10, text: 'Pedir una clave numérica al usuario y repetir la solicitud mientras la clave sea incorrecta (la clave correcta es 2026).', propuesto: true },
	{ id: 11, text: 'Pedir un número N y mostrar la serie de cuadrados 1, 4, 9, 16, ... hasta N.', propuesto: false },
	{ id: 12, text: 'Pedir un número N y mostrar los primeros N términos de la serie de Fibonacci (0, 1, 1, 2, 3, 5, …).', propuesto: true }
];

export const problemsN4 = [
	{ id: 1, text: 'Diseñar un algoritmo modular con una función que reciba la base y la altura de un rectángulo, calcule su área y retorne el resultado al programa principal para mostrarlo.', propuesto: false },
	{ id: 2, text: 'Diseñar una función que reciba un número entero como parámetro y devuelva 1 si es par o 0 si es impar. El programa principal muestra el resultado.', propuesto: true },
	{ id: 3, text: 'Crear una función matemática que reciba un valor numérico X y retorne su valor elevado al cubo (X * X * X).', propuesto: false },
	{ id: 4, text: 'Diseñar una función que reciba dos números A y B y retorne el mayor de ellos. Probarla leyendo dos valores desde el teclado.', propuesto: true },
	{ id: 5, text: 'Modularizar la conversión térmica: crear una función que reciba grados Celsius y retorne los grados Fahrenheit equivalentes.', propuesto: false },
	{ id: 6, text: 'Diseñar una función que reciba el salario bruto y el porcentaje de retención, y devuelva el salario neto a pagar tras la deducción.', propuesto: true },
	{ id: 7, text: 'Crear una función que reciba un entero N y calcule su factorial mediante un ciclo acumulador, retornando el resultado final.', propuesto: false },
	{ id: 8, text: 'Diseñar una función que reciba dos parámetros (base B y exponente E) y retorne el resultado de elevar B a la potencia E.', propuesto: true },
	{ id: 9, text: 'Diseñar una función que reciba un valor y dos límites (mínimo y máximo) y retorne 1 si el valor se encuentra dentro del rango inclusivo o 0 en caso contrario.', propuesto: false },
	{ id: 10, text: 'Diseñar una función que reciba el precio unitario, la cantidad y el porcentaje de descuento; debe calcular y retornar el monto final con descuento aplicado.', propuesto: true }
];

export const problemsN5 = [
	{ id: 1, text: 'Crear un algoritmo que declare un arreglo de 5 posiciones, solicite 5 números al usuario para llenarlo y luego los recorra mostrando cada elemento.', propuesto: false },
	{ id: 2, text: 'Pedir 5 números para almacenar en un vector, calcular la suma de todos sus elementos y mostrar el promedio final.', propuesto: true },
	{ id: 3, text: 'Cargar 5 valores en un vector y encontrar cuál es el elemento con el valor más alto y mostrarlo.', propuesto: false },
	{ id: 4, text: 'Almacenar 6 números enteros en un arreglo y contar cuántos de ellos son números pares y cuántos impares.', propuesto: true },
	{ id: 5, text: 'Cargar un arreglo de 5 elementos. Luego pedir un número a buscar e indicar si el número existe en el vector o no.', propuesto: false },
	{ id: 6, text: 'Llenar un arreglo de 5 números, solicitar un factor multiplicador K y mostrar el nuevo valor de cada posición multiplicado por K.', propuesto: true },
	{ id: 7, text: 'Almacenar las calificaciones de 5 estudiantes en un vector, calcular su promedio y determinar cuántos estudiantes obtuvieron una nota superior al promedio.', propuesto: false },
	{ id: 8, text: 'Leer 5 números en un vector y mostrarlos en pantalla en orden inverso al que fueron ingresados (desde la última posición hasta la primera).', propuesto: true },
	{ id: 9, text: 'Ingresar 6 números en un arreglo y clasificar cuántos son mayores que cero, cuántos menores que cero y cuántos son iguales a cero.', propuesto: false },
	{ id: 10, text: 'Llenar un vector A con 5 números y generar un segundo vector B donde cada posición almacene la suma acumulada de los elementos hasta esa posición.', propuesto: true }
];

export const problemsN6 = [
	{ id: 1, text: 'Llenar una matriz cuadrada de 2x2 solicitando sus 4 elementos e imprimirlos fila por fila.', propuesto: false },
	{ id: 2, text: 'Cargar una matriz de 2 filas y 3 columnas (2x3), calcular la suma de todos sus elementos y mostrar el resultado.', propuesto: true },
	{ id: 3, text: 'Diseñar un algoritmo que calcule la suma de los elementos ubicados en la diagonal principal de una matriz cuadrada de 3x3.', propuesto: false },
	{ id: 4, text: 'Cargar una matriz de 2x2 y contar cuántos de sus elementos son pares y cuántos son impares.', propuesto: true },
	{ id: 5, text: 'Encontrar y mostrar el número con mayor valor dentro de una matriz de 2x3.', propuesto: false },
	{ id: 6, text: 'Pedir una constante K y multiplicar cada uno de los elementos de una matriz de 2x2 por dicha constante, mostrando la matriz resultante.', propuesto: true },
	{ id: 7, text: 'Generar e imprimir una matriz identidad de 3x3 (valores 1 en la diagonal principal y 0 en las demás posiciones).', propuesto: false },
	{ id: 8, text: 'Cargar una matriz de 3x3, pedir al usuario el número de una fila (1, 2 o 3) y calcular la suma de los elementos de esa fila.', propuesto: true }
];

export const problemsN7 = [
	{ id: 1, text: 'Diseñar un sistema de menú aritmético que se repita hasta que el usuario elija 0: Opción 1: Sumar dos números, Opción 2: Restar dos números, Opción 3: Multiplicar dos números, Opción 0: Salir.', propuesto: false },
	{ id: 2, text: 'Simular un cajero automático con menú interactivo: 1: Consultar saldo, 2: Consignar dinero, 3: Retirar dinero, 0: Salir. Validar saldo suficiente al retirar.', propuesto: true },
	{ id: 3, text: 'Menú de conversión de longitud (repetitivo): 1: Metros a Kilómetros, 2: Metros a Centímetros, 3: Metros a Milímetros, 0: Salir.', propuesto: false },
	{ id: 4, text: 'Menú de cálculo de áreas geométricas: 1: Círculo (π*r²), 2: Triángulo (b*h/2), 3: Rectángulo (b*h), 0: Salir.', propuesto: true },
	{ id: 5, text: 'Menú de gestión de notas estudiantiles: 1: Ingresar 3 notas y calcular promedio, 2: Determinar si aprueba (>= 3.0), 3: Reiniciar notas, 0: Salir.', propuesto: false },
	{ id: 6, text: 'Menú de caja registradora comercial: 1: Registrar compra y acumular total, 2: Ver total acumulado y cantidad de ventas, 3: Aplicar descuento general del 10%, 0: Cerrar caja.', propuesto: true },
	{ id: 7, text: 'Menú con control de acceso: Solicitar clave numérica (2026). Al acertar, abrir menú de opciones del sistema con opción de salir.', propuesto: false },
	{ id: 8, text: 'Menú de control de inventario de bodega: 1: Ingresar stock inicial, 2: Despachar productos (restar existencias validando que no quede negativo), 3: Ver existencias actuales, 0: Salir.', propuesto: true }
];

/** @type {Record<string, { list: Array<{ id: number, text: string, propuesto: boolean }>, nivel: string, nivelLabel: string }>} */
const LEVELS_CONFIG = {
	'1': { list: problemsN1, nivel: 'nivel1', nivelLabel: 'Nivel 1 — Operadores' },
	'2': { list: problemsN2, nivel: 'nivel2', nivelLabel: 'Nivel 2 — Condicionales' },
	'3': { list: problemsN3, nivel: 'nivel3', nivelLabel: 'Nivel 3 — Ciclos' },
	'4': { list: problemsN4, nivel: 'nivel4', nivelLabel: 'Nivel 4 — Funciones' },
	'5': { list: problemsN5, nivel: 'nivel5', nivelLabel: 'Nivel 5 — Arreglos' },
	'6': { list: problemsN6, nivel: 'nivel6', nivelLabel: 'Nivel 6 — Matrices' },
	'7': { list: problemsN7, nivel: 'nivel7', nivelLabel: 'Nivel 7 — Sistemas de Menú' }
};

/**
 * @param {string} key
 * @returns {{ nivel: string, nivelLabel: string, id: number, text: string, propuesto: boolean, label: string } | null}
 */
export function getExerciseStatement(key) {
	// key: "N1-5" | "N2-12" | "N3-3" | "N4-2" | "N5-4" | "N6-1" | "N7-3"
	if (!key || typeof key !== 'string') return null;
	const m = key.match(/^N([1-7])-(\d{1,2})$/i);
	if (!m) return null;
	const level = LEVELS_CONFIG[m[1]];
	if (!level) return null;
	const id = parseInt(m[2], 10);
	const found = level.list.find((p) => p.id === id);
	if (!found) return null;
	return {
		nivel: level.nivel,
		nivelLabel: level.nivelLabel,
		id: found.id,
		text: found.text,
		propuesto: found.propuesto,
		label: m[1] === '1' ? `Problema ${found.id}` : `N${m[1]}-Problema ${found.id}`
	};
}
