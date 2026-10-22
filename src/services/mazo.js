// "Mazo" de preguntas por modo: como un mazo de cartas, saca preguntas sin repetir
// y recién vuelve a mezclar cuando ya salieron todas. Se guarda en el navegador para que
// el que juega dos veces seguidas no vea las mismas preguntas.

const CLAVE_GUARDADA = "manos-arriba-mazos";

// Mezcla una lista al azar (método de Fisher-Yates: cada orden tiene la misma chance)
export function mezclar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Lee y guarda los mazos en el navegador (si el navegador no deja, el juego sigue igual)
function leerMazos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_GUARDADA)) || {};
  } catch {
    return {};
  }
}
function guardarMazos(mazos) {
  try {
    localStorage.setItem(CLAVE_GUARDADA, JSON.stringify(mazos));
  } catch {
    // sin guardar
  }
}

// Saca "cantidad" preguntas del mazo de un modo. "posibles" son todas las preguntas de ese modo.
// Cada pregunta se reconoce por su texto.
export function sacarPreguntas(claveModo, posibles, cantidad) {
  const mazos = leerMazos();
  const textosPosibles = posibles.map((p) => p.texto);

  // Lo que quedaba en el mazo (sacando preguntas que ya no existan, por si cambiaron)
  let restantes = (mazos[claveModo] || []).filter((t) => textosPosibles.includes(t));
  const elegidas = [];

  while (elegidas.length < cantidad) {
    // Si se terminó el mazo, se mezcla de nuevo (sin las que ya salieron en esta ronda)
    if (restantes.length === 0) {
      restantes = mezclar(textosPosibles.filter((t) => !elegidas.includes(t)));
      if (restantes.length === 0) break;
    }
    elegidas.push(restantes.shift());
  }

  mazos[claveModo] = restantes;
  guardarMazos(mazos);

  return elegidas.map((texto) => posibles.find((p) => p.texto === texto));
}