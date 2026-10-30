import { useEffect } from "react";
import Reloj from "../components/Reloj";
import Icono from "../components/Icono";

// Muestra la situación arriba en una tarjeta compacta (para que se vea la cámara), la lee y corre el tiempo
export default function PaginaPregunta({ situacion, segundos, decir, alTerminarTiempo }) {
  useEffect(() => {
    decir(situacion.texto);
  }, [situacion, decir]);

  return (
    <div className="entrar flex w-full max-w-5xl items-center gap-4 rounded-3xl border-[3px] border-panel-borde bg-panel/80 px-4 py-3 shadow-[0_0_30px_rgb(127_216_255/0.35)] backdrop-blur-sm md:gap-6 md:px-6">
      <Reloj segundos={segundos} alTerminar={alTerminarTiempo}>
        <Icono nombre={situacion.icono} emoji={situacion.emoji} className="size-full" />
      </Reloj>
      <p className="font-titulo text-[max(1.1rem,min(5vh,6.5vw))] leading-tight text-balance">{situacion.texto}</p>
    </div>
  );
}