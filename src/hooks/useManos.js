import { useEffect, useRef, useState } from "react";
import { leerCuerpo } from "../services/detectorCuerpo";
import { MS_PARA_CONFIRMAR } from "../config";

const SIN_LECTURA = { hayPersona: false, eleccion: null, avance: 0, manosAbajo: false };

// Según qué mano tiene levantada, devuelve la respuesta (o null si ninguna o las dos)
function eleccionSegun(cuerpo) {
  if (!cuerpo) return null;
  if (cuerpo.manoIzquierda && !cuerpo.manoDerecha) return "seguro";
  if (cuerpo.manoDerecha && !cuerpo.manoIzquierda) return "peligro";
  return null;
}

// Redondea para no redibujar la pantalla por cambios que no se notan
const redondear = (valor, pasos) => Math.round(valor * pasos) / pasos;

// Mira las manos del chico con la cámara.
// activo: si la cámara está leyendo. puedeElegir: si se puede responder (solo durante la pregunta).
// Devuelve la lectura para la pantalla y "puntosRef": los puntos del cuerpo del último cuadro (para el modo calibración)
export default function useManos(videoRef, activo, puedeElegir, alElegir) {
  const [lectura, setLectura] = useState(SIN_LECTURA);
  const alElegirRef = useRef(alElegir);
  const puntosRef = useRef(null);

  // Guardamos siempre la última versión de la función alElegir
  useEffect(() => {
    alElegirRef.current = alElegir;
  });

  useEffect(() => {
    if (!activo) return;

    let armado = false; // recién se puede responder después de ver las dos manos abajo
    let eleccionSostenida = null;
    let desde = 0;
    let idCuadro;
    let ultimoTiempoVideo = -1;
    let cuerpo = null;
    let ultimaLectura = SIN_LECTURA;

    function cuadro(ahora) {
      const video = videoRef.current;

      // Solo analizamos cuando la cámara trae una imagen nueva (la cámara va a ~30 por segundo, la pantalla a 60)
      if (video && video.currentTime !== ultimoTiempoVideo) {
        ultimoTiempoVideo = video.currentTime;
        cuerpo = leerCuerpo(video);
        puntosRef.current = cuerpo?.puntos ?? null;
      }

      const hayPersona = cuerpo !== null;
      const manosAbajo = hayPersona && !cuerpo.manoIzquierda && !cuerpo.manoDerecha;
      if (manosAbajo) armado = true;

      // La mano solo cuenta si se puede responder y antes estuvieron las dos manos abajo
      const eleccion = puedeElegir && armado ? eleccionSegun(cuerpo) : null;

      // Si cambió de mano (o la bajó), empieza a contar de nuevo
      if (eleccion !== eleccionSostenida) {
        eleccionSostenida = eleccion;
        desde = ahora;
      }

      const avance = eleccion ? Math.min(1, (ahora - desde) / MS_PARA_CONFIRMAR) : 0;

      // Solo actualizamos la pantalla si algo cambió de verdad
      const nueva = { hayPersona, eleccion, avance: redondear(avance, 20), manosAbajo };
      if (
        nueva.hayPersona !== ultimaLectura.hayPersona ||
        nueva.eleccion !== ultimaLectura.eleccion ||
        nueva.avance !== ultimaLectura.avance ||
        nueva.manosAbajo !== ultimaLectura.manosAbajo
      ) {
        ultimaLectura = nueva;
        setLectura(nueva);
      }

      if (avance >= 1) {
        alElegirRef.current(eleccion);
        return; // deja de leer hasta que cambie de pantalla
      }
      idCuadro = requestAnimationFrame(cuadro);
    }

    idCuadro = requestAnimationFrame(cuadro);
    return () => {
      cancelAnimationFrame(idCuadro);
      puntosRef.current = null;
    };
  }, [activo, puedeElegir, videoRef]);

  return { lectura: activo ? lectura : SIN_LECTURA, puntosRef };
}