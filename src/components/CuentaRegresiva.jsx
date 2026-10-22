import { useEffect, useRef, useState } from "react";
import { sonar } from "../services/sonidos";
import { FRASES } from "../data/frases";

const PASOS = ["3", "2", "1", "¡YA!"];

// Cuenta regresiva gigante antes de la primera pregunta, para que el chico se prepare
export default function CuentaRegresiva({ decir, alTerminar }) {
  const [paso, setPaso] = useState(0);
  const alTerminarRef = useRef(alTerminar);

  useEffect(() => {
    alTerminarRef.current = alTerminar;
  });

  // Al aparecer, la voz avisa
  useEffect(() => {
    decir(FRASES.preparados);
  }, [decir]);

  // Cada paso dura un poquito menos de un segundo; después del "¡YA!" arranca el juego
  useEffect(() => {
    const ultimo = paso === PASOS.length - 1;
    sonar(ultimo ? "ya" : "tic");

    const espera = setTimeout(() => {
      if (ultimo) alTerminarRef.current();
      else setPaso(paso + 1);
    }, ultimo ? 700 : 850);

    return () => clearTimeout(espera);
  }, [paso]);

  return (
    <p
      key={paso}
      className="latido font-titulo text-[min(38vh,40vw)] leading-none text-estrella [text-shadow:0_8px_40px_rgb(0_0_0/0.6)]"
    >
      {PASOS[paso]}
    </p>
  );
}