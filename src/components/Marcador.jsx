// Barra de arriba: nombre del juego, modo, número de pregunta y puntos
export default function Marcador({ modo, numero, total, puntos }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <span className="rounded-full bg-noche/80 px-3 py-0.5 font-titulo text-[max(1.2rem,min(4.5vh,2.25rem))] text-estrella">
        ¡Manos arriba!
      </span>

      <div className="flex gap-2 text-[max(0.8rem,min(2.4vh,1rem))] font-extrabold tabular-nums">
        {modo && <span className="rounded-full bg-noche-2/90 px-3 py-1 text-tinta-suave">{modo}</span>}
        {total > 0 && (
          <span className="rounded-full bg-noche-2/90 px-3 py-1">
            Pregunta {numero}/{total}
          </span>
        )}
        <span className="rounded-full bg-noche-2/90 px-3 py-1">
          <span className="text-estrella">★</span> {puntos}
        </span>
      </div>
    </header>
  );
}
