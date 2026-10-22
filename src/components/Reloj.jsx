import { useEffect, useRef } from "react";

// Largo del borde del círculo (2 × π × radio). Sirve para "vaciar" el anillo de a poco
const RADIO = 45;
const PERIMETRO = 2 * Math.PI * RADIO;

// Reloj en forma de anillo alrededor del ícono: se vacía con el tiempo y al final se pone rojo.
// Cuando llega a cero avisa con alTerminar
export default function Reloj({ segundos, alTerminar, children }) {
  const anilloRef = useRef(null);
  const alTerminarRef = useRef(alTerminar);

  useEffect(() => {
    alTerminarRef.current = alTerminar;
  });

    useEffect(() => {
    // Sin tiempo: el anillo queda lleno y nunca se termina
    if (!segundos) return;

    const duracion = segundos * 1000;

    // Mismos colores que --color-estrella y --color-peligro de index.css
    const animacion = anilloRef.current.animate(
      [
        { strokeDashoffset: 0, stroke: "#ffd23f" },
        { offset: 0.7, stroke: "#ffd23f" },
        { strokeDashoffset: PERIMETRO, stroke: "#ff4f62" },
      ],
      { duration: duracion, fill: "forwards" }
    );
    const espera = setTimeout(() => alTerminarRef.current(), duracion);

    return () => {
      animacion.cancel();
      clearTimeout(espera);
    };
  }, [segundos]);

  return (
    <div className="relative grid size-[min(15vh,22vw)] shrink-0 place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
        <circle cx="50" cy="50" r={RADIO} fill="none" strokeWidth="7" className="stroke-black/30" />
        <circle
          ref={anilloRef}
          cx="50"
          cy="50"
          r={RADIO}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={PERIMETRO}
          className="stroke-estrella"
        />
      </svg>
      <div className="grid size-[68%] place-items-center">{children}</div>
    </div>
  );
}
