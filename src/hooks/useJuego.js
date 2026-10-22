import { useRef, useState } from "react";
import situaciones from "../data/situaciones";
import { MODOS } from "../config";
import { sacarPreguntas } from "../services/mazo";

// Reglas del juego: en qué pantalla estamos, qué pregunta va y cuántos puntos lleva
export default function useJuego() {
  const [pantalla, setPantalla] = useState("inicio"); // inicio | cuenta | pregunta | resultado | fin
  const [modo, setModo] = useState(MODOS.medianos);
  const [ronda, setRonda] = useState([]);
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [respuesta, setRespuesta] = useState({ eleccion: null, acerto: false });

  // Evita que una misma pregunta se responda dos veces (por ejemplo, cámara y teclado a la vez)
  const yaRespondio = useRef(false);
  // Arma la ronda con preguntas del mazo de ese modo (no se repiten hasta que salgan todas) y arranca la cuenta regresiva
  function empezar(claveModo) {
    const elegido = MODOS[claveModo];
    const posibles = situaciones.filter((s) => elegido.niveles.includes(s.nivel));

    setModo(elegido);
       setRonda(sacarPreguntas(claveModo, posibles, elegido.preguntas));
    setIndice(0);
    setPuntos(0);
    yaRespondio.current = false;
    setPantalla("cuenta");
  }

  // Cuando termina el 3, 2, 1 aparece la primera pregunta
  function comenzar() {
    if (pantalla === "cuenta") setPantalla("pregunta");
  }

  // eleccion: "seguro", "peligro" o null si se acabó el tiempo
  function responder(eleccion) {
    if (pantalla !== "pregunta" || yaRespondio.current) return;
    yaRespondio.current = true;

    const acerto = eleccion === ronda[indice].correcta;
    if (acerto) setPuntos((p) => p + 1);
    setRespuesta({ eleccion, acerto });
    setPantalla("resultado");
  }

  // Pasa a la siguiente pregunta o al final (lo llama la pantalla de resultado cuando termina)
  function siguiente() {
    if (pantalla !== "resultado") return;
    yaRespondio.current = false;

    if (indice + 1 < ronda.length) {
      setIndice(indice + 1);
      setPantalla("pregunta");
    } else {
      setPantalla("fin");
    }
  }

  return {
    pantalla,
    modo,
    situacion: ronda[indice],
    numero: indice + 1,
    total: ronda.length,
    puntos,
    respuesta,
    empezar,
    comenzar,
    responder,
    siguiente,
    volverAlInicio: () => setPantalla("inicio"),
  };
}
