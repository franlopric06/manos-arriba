// Cartel que cuenta que el juego lo hicieron estudiantes de la carrera (para promocionarla en las expos).
// tamaño "grande": cartel completo con el logo (pantalla final) — tamaño "chico": una línea al pie (pantalla de inicio)
const LOGO = "/logo-iest.webp";

export default function Propaganda({ tamaño = "grande" }) {
  if (tamaño === "chico") {
    return (
      <p className="flex items-center justify-center gap-2 text-[max(0.75rem,min(2.2vh,0.95rem))] font-extrabold text-tinta-suave">
        <img src={LOGO} alt="Logo del IEST" className="size-[max(2rem,min(5vh,2.75rem))] shrink-0" />
        <span>
          Hecho por estudiantes de la <span className="text-estrella">Tecnicatura Superior en Desarrollo de Software</span>{" "}
          · IEST Tinogasta
        </span>
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-3xl items-center gap-4 rounded-2xl border-2 border-estrella/60 bg-noche/90 px-5 py-[min(2vh,1rem)]">
      <img src={LOGO} alt="Logo del IEST" className="size-[max(4rem,min(13vh,6.5rem))] shrink-0" />
      <div className="flex-1 text-center">
        <p className="text-[max(0.85rem,min(2.6vh,1.15rem))] font-extrabold text-tinta-suave">
          💻 Este juego lo creamos los estudiantes de la
        </p>
        <p className="font-titulo text-[max(1.2rem,min(4.4vh,2rem))] leading-tight text-estrella">
          Tecnicatura Superior en Desarrollo de Software
        </p>
        <p className="text-[max(0.85rem,min(2.6vh,1.15rem))] font-extrabold">
          IEST Tinogasta · <span className="text-seguro">¡Vos también podés crear el tuyo!</span>
        </p>
      </div>
    </div>
  );
}