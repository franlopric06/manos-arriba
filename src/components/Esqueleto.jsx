import { useEffect, useRef } from "react";
import { PUNTOS, seVe } from "../services/detectorCuerpo";

// Líneas que unen los puntos: hombros, brazos
const UNIONES = [
  [PUNTOS.HOMBRO_IZQUIERDO, PUNTOS.HOMBRO_DERECHO],
  [PUNTOS.HOMBRO_IZQUIERDO, PUNTOS.CODO_IZQUIERDO],
  [PUNTOS.CODO_IZQUIERDO, PUNTOS.MUNECA_IZQUIERDA],
  [PUNTOS.HOMBRO_DERECHO, PUNTOS.CODO_DERECHO],
  [PUNTOS.CODO_DERECHO, PUNTOS.MUNECA_DERECHA],
];

// Modo calibración: dibuja sobre la cámara los puntos del cuerpo que ve el detector.
// Sirve para acomodar la distancia, la altura de la cámara y la luz cuando arman el stand
export default function Esqueleto({ videoRef, puntosRef }) {
  const lienzoRef = useRef(null);

  useEffect(() => {
    const lienzo = lienzoRef.current;
    const ctx = lienzo.getContext("2d");
    let idCuadro;

    function dibujar() {
      lienzo.width = lienzo.clientWidth;
      lienzo.height = lienzo.clientHeight;
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);

      const video = videoRef.current;
      const puntos = puntosRef.current;
      if (video && puntos && video.videoWidth) {
        // El video está "recortado para cubrir" la pantalla: calculamos la misma escala y el mismo corrimiento
        const escala = Math.max(lienzo.width / video.videoWidth, lienzo.height / video.videoHeight);
        const anchoVideo = video.videoWidth * escala;
        const altoVideo = video.videoHeight * escala;
        const corrX = (lienzo.width - anchoVideo) / 2;
        const corrY = (lienzo.height - altoVideo) / 2;
        // Pasa un punto del detector (0 a 1) a la pantalla, en espejo como se ve el video
        const enPantalla = (p) => [corrX + (1 - p.x) * anchoVideo, corrY + p.y * altoVideo];

        ctx.lineWidth = 6;
        ctx.strokeStyle = "rgb(255 210 63 / 0.85)";
        for (const [a, b] of UNIONES) {
          if (!seVe(puntos[a]) || !seVe(puntos[b])) continue;
          ctx.beginPath();
          ctx.moveTo(...enPantalla(puntos[a]));
          ctx.lineTo(...enPantalla(puntos[b]));
          ctx.stroke();
        }

        for (const indice of Object.values(PUNTOS)) {
          const p = puntos[indice];
          ctx.fillStyle = seVe(p) ? "#1fd37a" : "#ff4f62"; // verde = lo ve bien, rojo = no está seguro
          const [x, y] = enPantalla(p);
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      idCuadro = requestAnimationFrame(dibujar);
    }

    idCuadro = requestAnimationFrame(dibujar);
    return () => cancelAnimationFrame(idCuadro);
  }, [videoRef, puntosRef]);

  return (
    <>
      <canvas ref={lienzoRef} className="pointer-events-none absolute inset-0 z-[5] size-full" />
      <p className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-noche/90 px-3 py-1 text-xs font-extrabold text-estrella">
        Modo calibración (tecla C) · verde = lo ve bien · rojo = no está seguro
      </p>
    </>
  );
}