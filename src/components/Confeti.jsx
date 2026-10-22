import { useEffect } from "react";
import confetti from "canvas-confetti";

// Colores del juego: amarillo, verde, rojo, celeste y blanco
const COLORES = ["#ffd23f", "#1fd37a", "#ff4f62", "#7fd8ff", "#f6f4ff"];

// Confeti con la librería canvas-confetti: los papelitos giran, caen y desaparecen solos.
// tipo "acierto": una explosión desde el medio. tipo "ganador": cañones de estrellas desde los dos costados
export default function Confeti({ tipo = "acierto" }) {
  useEffect(() => {
    const base = { colors: COLORES, disableForReducedMotion: true, zIndex: 50 };

    if (tipo === "acierto") {
      confetti({ ...base, particleCount: 140, spread: 90, startVelocity: 45, origin: { y: 0.55 } });
      return;
    }

    // Ganador: durante 2 segundos tira papelitos y estrellas desde las dos esquinas
    const hasta = Date.now() + 2000;
    let idCuadro;
    function tirar() {
      const tanda = { ...base, particleCount: 5, spread: 65, shapes: ["star", "square"] };
      confetti({ ...tanda, angle: 60, origin: { x: 0, y: 0.75 } });
      confetti({ ...tanda, angle: 120, origin: { x: 1, y: 0.75 } });
      if (Date.now() < hasta) idCuadro = requestAnimationFrame(tirar);
    }
    tirar();

    return () => cancelAnimationFrame(idCuadro);
  }, [tipo]);

  // No dibuja nada propio: la librería crea su propia capa encima de todo
  return null;
}
