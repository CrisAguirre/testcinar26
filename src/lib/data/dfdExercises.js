// Enunciados de ejercicios DFD — fuente única para Actividad de la semana y Editor DFD.
// Nivel 1: Operadores secuenciales (16) · Nivel 2: Condicionales Si/No (22)

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

export function getExerciseStatement(key) {
	// key: "N1-5" | "N2-12"
	if (!key || typeof key !== 'string') return null;
	const m = key.match(/^N([12])-(\d{1,2})$/i);
	if (!m) return null;
	const isN2 = m[1] === '2';
	const id = parseInt(m[2], 10);
	const list = isN2 ? problemsN2 : problemsN1;
	const found = list.find((p) => p.id === id);
	if (!found) return null;
	return {
		nivel: isN2 ? 'nivel2' : 'nivel1',
		nivelLabel: isN2 ? 'Nivel 2 — Condicionales' : 'Nivel 1 — Operadores',
		id: found.id,
		text: found.text,
		propuesto: found.propuesto,
		label: isN2 ? `N2-Problema ${found.id}` : `Problema ${found.id}`
	};
}
