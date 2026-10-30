import { useState } from "react";
import { MODOS } from "../config";
import Propaganda from "../components/Propaganda";

// Pantalla de bienvenida: muestra cómo se juega, opciones de cámara y voz, y un botón por cada modo
export default function PaginaInicio({ estadoCamara, camaras, camaraId, alElegirCamara, alJugar }) {
  const [conCamara, setConCamara] = useState(true);
  const [conVoz, setConVoz] = useState(true);

  const preparando = estadoCamara === "prendiendo";
  let aviso = "Ponete delante de la cámara, donde se te vean los hombros y las manos.";
  if (preparando) aviso = "Preparando la cámara…";
  if (estadoCamara === "error") aviso = "No se pudo usar la cámara. Se juega tocando las respuestas o con las flechas ← →";

  return (
    <div className="entrar flex w-full max-w-3xl flex-col items-center gap-[min(1.8vh,1rem)] rounded-3xl bg-noche-2/90 px-4 py-[min(2.5vh,1.75rem)] sm:px-5 text-center">
      <h1 className="font-titulo text-[min(10vh,12vw)] leading-[0.95] text-estrella">¡Manos arriba!</h1>

      {/* Cómo se juega: mano izquierda = seguro, mano derecha = peligroso */}
      <div className="flex items-end justify-center gap-[min(4vw,3rem)]">
        <figure className="flex flex-col items-center gap-1">
          <img src="/iconos/mano.webp" alt="" className="h-[min(9vh,12vw)]" />
          <figcaption className="rounded-full bg-black/55 px-3 py-0.5 whitespace-nowrap text-[max(0.75rem,min(2.6vh,3.6vw,1.1rem))] font-extrabold text-seguro">Izquierda = seguro</figcaption>
        </figure>
        <figure className="flex flex-col items-center gap-1">
          <img src="/iconos/mano.webp" alt="" className="h-[min(9vh,12vw)] -scale-x-100" />
          <figcaption className="rounded-full bg-black/55 px-3 py-0.5 whitespace-nowrap text-[max(0.75rem,min(2.6vh,3.6vw,1.1rem))] font-extrabold text-peligro">Derecha = peligroso</figcaption>
        </figure>
      </div>

      <p className="font-titulo text-[max(1.1rem,min(4.5vh,1.9rem))]">¿Quién juega?</p>

      {/* Un botón por modo: tocar uno arranca el juego */}
      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-3">
        {Object.entries(MODOS).map(([clave, modo]) => (
          <button
            key={clave}
            disabled={preparando}
            onClick={() => alJugar({ modo: clave, conCamara, conVoz })}
            className="flex flex-col items-center rounded-2xl sm:min-w-[8.5rem] bg-estrella px-5 py-[min(1.4vh,0.6rem)] text-noche transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-tinta disabled:opacity-60"
          >
            <span className="font-titulo text-[max(1.2rem,min(5vh,6.5vw,2rem))] leading-none">{modo.nombre}</span>
            <span className="text-[max(0.65rem,min(2vh,3vw,0.9rem))] font-extrabold whitespace-nowrap">{modo.edades}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[max(0.8rem,min(2.4vh,1rem))] font-extrabold">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            id="opcion-camara"
            type="checkbox"
            checked={conCamara}
            onChange={(e) => setConCamara(e.target.checked)}
            className="size-5 accent-estrella"
          />
          Jugar con la cámara
        </label>
        {/* Si hay más de una cámara (por ejemplo, la de la notebook y una webcam), se puede elegir cuál usar */}
        {conCamara && camaras.length > 1 && (
          <label className="flex items-center gap-2">
            Cámara:
            <select
              id="opcion-camara-elegida"
              value={camaraId}
              onChange={(e) => alElegirCamara(e.target.value)}
              className="max-w-[14rem] rounded-lg bg-noche px-2 py-1 font-semibold text-tinta"
            >
              <option value="">Automática</option>
              {camaras.map((c, i) => (
                <option key={c.deviceId} value={c.deviceId}>
                  {c.label || `Cámara ${i + 1}`}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex cursor-pointer items-center gap-2">
          <input
            id="opcion-voz"
            type="checkbox"
            checked={conVoz}
            onChange={(e) => setConVoz(e.target.checked)}
            className="size-5 accent-estrella"
          />
          Leer en voz alta
        </label>
      </div>

      <p className="max-w-[46ch] text-[max(0.75rem,min(2.2vh,0.95rem))] font-semibold text-tinta-suave">{aviso}</p>

      <Propaganda tamaño="chico" />
    </div>
  );
}