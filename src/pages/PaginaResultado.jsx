import { useEffect, useRef, useState } from "react";
import Confeti from "../components/Confeti";
import { sonar } from "../services/sonidos";
import { MS_RESULTADO_MINIMO, MS_PAUSA_FINAL, MS_RESULTADO_MAXIMO, MS_REPETIR_AVISO } from "../config";

// Espera la cantidad de milisegundos indicada
const esperar = (ms) => new Promise((listo) => setTimeout(listo, ms));

// Título según cómo le fue: felicita si acertó; si no, avisa y aclara cuál era la respuesta
function armarTitulos(eleccion, acerto, correcta) {
  if (acerto) return { titulo: "¡Muy bien!", aclaracion: "" };
  const aclaracion = correcta === "peligro" ? "Eso es peligroso." : "Eso es seguro.";
  if (eleccion === null) return { titulo: "¡Se acabó el tiempo!", aclaracion };
  return { titulo: correcta === "peligro" ? "¡Cuidado!" : "¡Ups!", aclaracion };
}

// Muestra si acertó o no, explica por qué y espera a que el chico baje las manos
export default function PaginaResultado({ situacion, respuesta, decir, esperarManos, manosAbajo, alTerminar }) {
  const { eleccion, acerto } = respuesta;
  const { titulo, aclaracion } = armarTitulos(eleccion, acerto, situacion.correcta);
  const [termino, setTermino] = useState(false); // ya terminó la devolución

  const alTerminarRef = useRef(alTerminar);
  useEffect(() => {
    alTerminarRef.current = alTerminar;
  });

  // 1) Sonido de acierto o de error
  useEffect(() => {
    sonar(acerto ? "bien" : "mal");
  }, [acerto]);

  // 2) Lee la devolución completa y hace una pausa
  useEffect(() => {
    let cancelado = false;

    async function leerYEsperar() {
      const inicio = Date.now();
      await Promise.race([decir(`${titulo} ${aclaracion} ${situacion.explica}`), esperar(MS_RESULTADO_MAXIMO)]);

      const yaPaso = Date.now() - inicio;
      await esperar(Math.max(MS_PAUSA_FINAL, MS_RESULTADO_MINIMO - yaPaso));

      if (!cancelado) setTermino(true);
    }

    leerYEsperar();
    return () => {
      cancelado = true;
    };
  }, [titulo, aclaracion, situacion, decir]);

  // 3) Pasa a la siguiente cuando terminó la devolución Y (si se juega con cámara) tiene las manos abajo
  useEffect(() => {
    if (termino && (!esperarManos || manosAbajo)) alTerminarRef.current();
  }, [termino, esperarManos, manosAbajo]);

  const esperandoManos = termino && esperarManos && !manosAbajo;

  // 4) Si terminó la devolución y todavía tiene una mano arriba, se lo pide con la voz y lo repite cada tanto
  useEffect(() => {
    if (!esperandoManos) return;

    decir("Bajá las manos para la siguiente pregunta");
    const repetir = setInterval(() => decir("Bajá las manos"), MS_REPETIR_AVISO);

    return () => clearInterval(repetir);
  }, [esperandoManos, decir]);

  return (
    <>
      {acerto && <Confeti tipo="acierto" />}
      {/* Si se equivocó, toda la pantalla parpadea en rojo */}
      {!acerto && <div className="parpadeo-mal pointer-events-none fixed inset-0 z-40" />}

      <div
        className={`rebote w-full max-w-5xl rounded-3xl border-[3px] bg-noche-2/90 px-4 py-3 text-center md:px-6 md:py-4 ${
          acerto ? "border-seguro" : "border-peligro"
        }`}
      >
        <p
          className={`font-titulo text-[max(1.5rem,min(7vh,9vw))] leading-none ${
            acerto ? "text-seguro" : "text-peligro"
          }`}
        >
          {titulo}
        </p>
        <p className="mx-auto mt-2 max-w-[40ch] text-[max(1rem,min(3.4vh,4.5vw))] leading-snug font-extrabold">
          {aclaracion && <span className="text-estrella">{aclaracion} </span>}
          {situacion.explica}
        </p>

        {esperandoManos && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <p className="font-titulo text-[max(1.2rem,min(4.5vh,6vw))] text-estrella">Bajá las manos para seguir</p>
            <button
              onClick={() => alTerminarRef.current()}
              className="rounded-full border-2 border-tinta-suave px-5 py-1.5 font-extrabold text-tinta-suave focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-estrella"
            >
              Seguir igual
            </button>
          </div>
        )}
      </div>
    </>
  );
}
