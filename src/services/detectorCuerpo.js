import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { RUTA_WASM, RUTAS_MODELO, MARGEN_MANO, VISIBILIDAD_MINIMA } from "../config";

// Números de los puntos del cuerpo que usamos (el modelo devuelve 33)
export const PUNTOS = {
  NARIZ: 0,
  HOMBRO_IZQUIERDO: 11,
  HOMBRO_DERECHO: 12,
  CODO_IZQUIERDO: 13,
  CODO_DERECHO: 14,
  MUNECA_IZQUIERDA: 15,
  MUNECA_DERECHA: 16,
};

let detector = null;
let cargando = null;

// Opciones del detector: modo video y una sola persona
function opciones(modelo, procesador) {
  return {
    baseOptions: { modelAssetPath: modelo, delegate: procesador },
    runningMode: "VIDEO",
    numPoses: 1,
  };
}

// Prueba los modelos en orden (primero el completo) y, para cada uno, la placa de video y después el procesador
async function crearDetector() {
  const archivos = await FilesetResolver.forVisionTasks(RUTA_WASM);
  let ultimoError = null;

  for (const modelo of RUTAS_MODELO) {
    for (const procesador of ["GPU", "CPU"]) {
      try {
        const nuevo = await PoseLandmarker.createFromOptions(archivos, opciones(modelo, procesador));
        console.info(`Detector listo: ${modelo} con ${procesador === "GPU" ? "placa de video" : "procesador"}`);
        return nuevo;
      } catch (error) {
        ultimoError = error;
      }
    }
  }
  throw ultimoError;
}

// Carga el detector una sola vez, aunque se llame varias veces
export function cargarDetector() {
  if (!cargando) {
    cargando = crearDetector()
      .then((d) => (detector = d))
      .catch((error) => {
        cargando = null; // permite reintentar
        throw error;
      });
  }
  return cargando;
}

// Si el detector está bastante seguro de que ve ese punto
export const seVe = (punto) => (punto.visibility ?? 1) > VISIBILIDAD_MINIMA;

// Una mano cuenta como levantada si la muñeca llega a la altura del hombro (o más arriba).
// Si la muñeca se sale de la imagen, alcanza con que el codo llegue a la altura del hombro.
// (En la imagen, "y" crece hacia abajo: más arriba = número más chico)
function manoLevantada(cuerpo, muneca, codo, hombro) {
  const puntoHombro = cuerpo[hombro];
  if (!seVe(puntoHombro)) return false;

  const puntoMuneca = cuerpo[muneca];
  if (seVe(puntoMuneca) && puntoMuneca.y < puntoHombro.y - MARGEN_MANO) return true;

  const puntoCodo = cuerpo[codo];
  return seVe(puntoCodo) && puntoCodo.y < puntoHombro.y;
}

// Lee un cuadro de la cámara. Devuelve null si no ve a nadie, o:
// { manoIzquierda: sí/no, manoDerecha: sí/no, puntos: los 33 puntos (para el modo calibración) }
export function leerCuerpo(video) {
  if (!detector || video.readyState < 2) return null;

  const resultado = detector.detectForVideo(video, performance.now());
  const cuerpo = resultado.landmarks[0];
  if (!cuerpo) return null;

  // "Izquierda" es la mano izquierda del chico, que en la pantalla espejada aparece a la izquierda
  return {
    manoIzquierda: manoLevantada(cuerpo, PUNTOS.MUNECA_IZQUIERDA, PUNTOS.CODO_IZQUIERDO, PUNTOS.HOMBRO_IZQUIERDO),
    manoDerecha: manoLevantada(cuerpo, PUNTOS.MUNECA_DERECHA, PUNTOS.CODO_DERECHO, PUNTOS.HOMBRO_DERECHO),
    puntos: cuerpo,
  };
}