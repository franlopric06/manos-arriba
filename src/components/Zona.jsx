// Colores de cada zona (escritos completos para que Tailwind los encuentre)
const ESTILOS = {
  seguro: { fondo: "bg-seguro-osc/90 border-seguro", relleno: "bg-seguro" },
  peligro: { fondo: "bg-peligro-osc/90 border-peligro", relleno: "bg-peligro" },
};

// Una respuesta: se puede tocar, y se va llenando mientras el chico mantiene la mano arriba
export default function Zona({ tipo, titulo, ayuda, lectura, alElegir }) {
  const estilo = ESTILOS[tipo];
  const activa = lectura.eleccion === tipo;
  const relleno = activa ? lectura.avance * 100 : 0;

  return (
    <button
      onClick={() => alElegir(tipo)}
      className={`relative flex flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-4 px-2 transition-transform focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-estrella ${
        estilo.fondo
      } ${activa ? "scale-[1.04]" : ""}`}
    >
      <div
        className={`absolute inset-y-0 left-0 opacity-50 ${estilo.relleno}`}
        style={{ width: `${relleno}%` }}
      />
      <span className="relative font-titulo text-[max(1.1rem,min(5vh,6vw))] leading-none">{titulo}</span>
      <small className="relative text-[max(0.7rem,min(2.2vh,3.2vw))] font-extrabold opacity-90">{ayuda}</small>
    </button>
  );
}
