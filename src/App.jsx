import { useCallback, useEffect, useState } from "react";
import useJuego from "./hooks/useJuego";
import useCamara from "./hooks/useCamara";
import useManos from "./hooks/useManos";
import { sonar } from "./services/sonidos";
import { hablar, callar } from "./services/voz";
import { TECLA_CALIBRACION } from "./config";
import CamaraFondo from "./components/CamaraFondo";
import Marcador from "./components/Marcador";
import Zonas from "./components/Zonas";
import CuentaRegresiva from "./components/CuentaRegresiva";
import EstadoCamara from "./components/EstadoCamara";
import Esqueleto from "./components/Esqueleto";
import PaginaInicio from "./pages/PaginaInicio";
import PaginaPregunta from "./pages/PaginaPregunta";
import PaginaResultado from "./pages/PaginaResultado";
import PaginaFin from "./pages/PaginaFin";

// Une todo: reglas del juego, cámara, manos y la pantalla que toca mostrar
export default function App() {
  const juego = useJuego();
  const camara = useCamara();
  const [usaCamara, setUsaCamara] = useState(false);
  const [usaVoz, setUsaVoz] = useState(true);
  const [calibrando, setCalibrando] = useState(false);

  const camaraActiva = usaCamara && camara.estado === "lista";
  const enJuego = juego.pantalla === "pregunta" || juego.pantalla === "resultado";
  const enInicio = juego.pantalla === "inicio";

  // La cámara mira las manos en la pregunta y en el resultado, pero solo se puede responder en la pregunta
  const { lectura, puntosRef } = useManos(
    camara.videoRef,
    camaraActiva && enJuego,
    juego.pantalla === "pregunta",
    juego.responder
  );

  // Habla solo si eligieron "Leer en voz alta". Siempre devuelve una promesa para poder esperarla
  const decir = useCallback(
    (texto) => (usaVoz ? hablar(texto) : Promise.resolve()),
    [usaVoz]
  );

  async function jugar({ modo, conCamara, conVoz }) {
    sonar("tic");
    setUsaVoz(conVoz);
    if (!conVoz) callar();
    const camaraOk = conCamara ? await camara.prender() : false;
    setUsaCamara(camaraOk);
    juego.empezar(modo);
  }

  // Teclado: ← seguro, → peligroso, C muestra u oculta el modo calibración
  // (sin dependencias: siempre usa la versión más nueva de responder)
  useEffect(() => {
    function alApretar(e) {
      if (e.key === "ArrowLeft") juego.responder("seguro");
      if (e.key === "ArrowRight") juego.responder("peligro");
      if (e.key.toLowerCase() === TECLA_CALIBRACION) setCalibrando((c) => !c);
    }
    window.addEventListener("keydown", alApretar);
    return () => window.removeEventListener("keydown", alApretar);
  });

  return (
    <div className="relative h-full overflow-hidden">
      {/* La cámara ocupa toda la pantalla, detrás de todo */}
      <CamaraFondo videoRef={camara.videoRef} visible={camaraActiva} />
      {calibrando && camaraActiva && enJuego && <Esqueleto videoRef={camara.videoRef} puntosRef={puntosRef} />}

      <div className="relative z-10 flex h-full flex-col gap-3 px-3 py-3 md:px-4">
        <Marcador
          modo={enInicio ? null : juego.modo.nombre}
          numero={juego.numero}
          total={enJuego ? juego.total : 0}
          puntos={juego.puntos}
        />

        {enJuego ? (
          <>
            {/* Pregunta o resultado arriba, en una tarjeta compacta */}
            <section className="flex justify-center">
              {juego.pantalla === "pregunta" && (
                <PaginaPregunta
                  key={juego.numero}
                  situacion={juego.situacion}
                  segundos={juego.modo.segundos}
                  decir={decir}
                  alTerminarTiempo={() => juego.responder(null)}
                />
              )}
              {juego.pantalla === "resultado" && (
                <PaginaResultado
                  situacion={juego.situacion}
                  respuesta={juego.respuesta}
                  decir={decir}
                  esperarManos={camaraActiva}
                  manosAbajo={lectura.manosAbajo}
                  alTerminar={juego.siguiente}
                />
              )}
            </section>

            {/* Espacio libre en el medio: ahí el chico se ve en la cámara */}
            <div className="min-h-0 flex-1" />

            {/* Las respuestas, con el aviso de si la cámara lo ve en el medio */}
            <Zonas
              lectura={lectura}
              alElegir={juego.responder}
              centro={camaraActiva ? <EstadoCamara lectura={lectura} /> : null}
            />
          </>
        ) : (
          <main className="flex min-h-0 flex-1 flex-col items-center justify-center">
            {enInicio && (
              <PaginaInicio
                estadoCamara={camara.estado}
                camaras={camara.camaras}
                camaraId={camara.camaraId}
                alElegirCamara={camara.elegirCamara}
                alJugar={jugar}
              />
            )}
            {juego.pantalla === "cuenta" && <CuentaRegresiva decir={decir} alTerminar={juego.comenzar} />}
            {juego.pantalla === "fin" && (
              <PaginaFin
                puntos={juego.puntos}
                total={juego.total}
                puntosGolosina={juego.modo.puntosGolosina}
                decir={decir}
                alOtraVez={juego.volverAlInicio}
              />
            )}
          </main>
        )}
      </div>
    </div>
  );
}