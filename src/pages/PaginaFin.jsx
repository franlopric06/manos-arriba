import { useEffect } from "react";
import Confeti from "../components/Confeti";
import { sonar } from "../services/sonidos";
import { FRASES } from "../data/frases";

// Resultado final: puntos, estrellas y si se gana la golosina
export default function PaginaFin({ puntos, total, puntosGolosina, decir, alOtraVez }) {
  const gano = puntos >= puntosGolosina;
  const estrellas = Math.max(1, Math.round((puntos / total) * 5));
  const mensaje = gano ? FRASES.gano : FRASES.casi;

  useEffect(() => {
    if (gano) sonar("bien");
    decir(mensaje);
  }, [gano, mensaje, decir]);

  return (
    <div className="flex flex-col items-center gap-[min(2.5vh,1.25rem)] text-center">
      {gano && <Confeti tipo="ganador" />}

      <div className="rebote w-full max-w-3xl rounded-3xl border-[3px] border-tinta-suave bg-noche-2/90 px-6 py-[min(3vh,2rem)]">
        {gano && <p className="font-titulo text-[max(1.2rem,min(5vh,2.25rem))] text-seguro">Guardián Digital</p>}
        <p className="font-titulo text-[min(12vh,14vw)] leading-none tabular-nums">
          {puntos} de {total}
        </p>
        <p className="mt-1 text-[min(8vh,10vw)] leading-tight tracking-widest">
          <span className="text-estrella">{"★".repeat(estrellas)}</span>
          <span className="text-tinta-suave/30">{"★".repeat(5 - estrellas)}</span>
        </p>
        <p className="mx-auto mt-2 max-w-[34ch] text-[max(1rem,min(4vh,1.875rem))] font-extrabold">{mensaje}</p>
      </div>

      <button
        onClick={alOtraVez}
        className="rounded-full bg-estrella px-10 py-[min(1.8vh,0.9rem)] font-titulo text-[max(1.3rem,min(5vh,2.25rem))] text-noche focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-tinta"
      >
        Jugar otra vez
      </button>
    </div>
  );
}