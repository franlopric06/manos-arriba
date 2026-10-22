// Todas las frases que dice la voz del juego, en un solo lugar.
// Las usan las pantallas y también el generador de audios (scripts/generar-audios.mjs),
// así el texto es siempre el mismo y el juego encuentra el audio de cada frase.

// Frases fijas
export const FRASES = {
  preparados: "¡Preparados!",
  bajarManos: "Bajá las manos para la siguiente pregunta",
  bajarManosCorto: "Bajá las manos",
  gano: "¡Sos un Guardián Digital! Ganaste una golosina.",
  casi: "¡Casi! Probá otra vez para ganar la golosina.",
};

// Título y aclaración de la pantalla de resultado: felicita si acertó; si no, avisa cuál era la respuesta
export function armarTitulos(eleccion, acerto, correcta) {
  if (acerto) return { titulo: "¡Muy bien!", aclaracion: "" };
  const aclaracion = correcta === "peligro" ? "Eso es peligroso." : "Eso es seguro.";
  if (eleccion === null) return { titulo: "¡Se acabó el tiempo!", aclaracion };
  return { titulo: correcta === "peligro" ? "¡Cuidado!" : "¡Ups!", aclaracion };
}

// Lo que dice la voz en la pantalla de resultado: título + aclaración + explicación
export function fraseResultado(situacion, eleccion, acerto) {
  const { titulo, aclaracion } = armarTitulos(eleccion, acerto, situacion.correcta);
  return [titulo, aclaracion, situacion.explica].filter(Boolean).join(" ");
}