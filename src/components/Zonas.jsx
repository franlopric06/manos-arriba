import Zona from "./Zona";

// Las dos respuestas: verde a la izquierda (seguro) y roja a la derecha (peligroso).
// "centro" es lo que va entre las dos (el cartelito de "Te veo").
// Pantalla acostada: las respuestas en las esquinas y el centro en el medio, en la misma línea.
// Pantalla parada: las respuestas una al lado de la otra y el centro justo arriba de ellas
export default function Zonas({ lectura, alElegir, centro }) {
  return (
    <div className="relative grid h-[15vh] min-h-20 shrink-0 grid-cols-2 gap-3 landscape:flex landscape:h-[28vh] landscape:justify-between landscape:*:w-[26%]">
      <Zona tipo="seguro" titulo="✓ SEGURO" ayuda="Mano izquierda" lectura={lectura} alElegir={alElegir} />

      {centro && (
        <div className="absolute inset-x-0 bottom-full mb-2 flex justify-center landscape:static landscape:mb-0 landscape:items-end landscape:pb-1">
          {centro}
        </div>
      )}

      <Zona tipo="peligro" titulo="✗ PELIGROSO" ayuda="Mano derecha" lectura={lectura} alElegir={alElegir} />
    </div>
  );
}