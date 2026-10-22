// Reglas del juego: cambiando estos números se ajusta la dificultad sin tocar el resto del código

// Modos por edad: cada modo tiene su propio nivel de preguntas (no se repiten entre modos).
// Qué niveles de preguntas salen, cuántas, cuántos segundos hay y cuántos aciertos dan golosina
// segundos: null = sin tiempo (los más chiquitos responden tranquilos)
export const MODOS = {
  chicos: { nombre: "Chicos", edades: "5 a 7 años", niveles: [1], preguntas: 6, segundos: null, puntosGolosina: 4 },
  medianos: { nombre: "Medianos", edades: "8 a 10 años", niveles: [2], preguntas: 8, segundos: 15, puntosGolosina: 6 },
  grandes: { nombre: "Grandes", edades: "11 años o más", niveles: [3], preguntas: 8, segundos: 8, puntosGolosina: 6 },
};

// Cuánto tiempo tiene que mantener la mano levantada para que cuente como respuesta
export const MS_PARA_CONFIRMAR = 700;

// Tiempos de la pantalla de resultado: espera a que la voz termine de leer la devolución
export const MS_RESULTADO_MINIMO = 4000; // nunca menos que esto (por si la voz está apagada)
export const MS_PAUSA_FINAL = 1500; // pausa después de que la voz termina
export const MS_RESULTADO_MAXIMO = 15000; // si la voz se traba, sigue igual
export const MS_REPETIR_AVISO = 6000; // cada cuánto repite "bajá las manos" si el chico no las baja

// Desde qué altura cuenta una mano como levantada, comparando la muñeca con el hombro
// (fracción de la altura de la imagen: 0 = a la altura del hombro; 0.03 = un poquito más arriba; -0.03 = un poquito más abajo)
export const MARGEN_MANO = 0;

// Qué tan seguro tiene que estar el detector de que ve un punto del cuerpo (0 a 1)
export const VISIBILIDAD_MINIMA = 0.3;

// Voz que se busca primero (Edge trae "Elena", con acento argentino)
export const VOZ_PREFERIDA = "Elena";

// Archivos del detector guardados en public/ para que funcione sin internet
export const RUTA_WASM = "/mediapipe/wasm";
// Se prueba primero el modelo "completo" (más preciso); si no está en la carpeta, usa el "liviano"
export const RUTAS_MODELO = ["/mediapipe/pose_landmarker_full.task", "/mediapipe/pose_landmarker_lite.task"];

// Tecla para mostrar u ocultar los puntitos del cuerpo (modo calibración, para armar el stand)
export const TECLA_CALIBRACION = "c";