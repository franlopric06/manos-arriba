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

// En cada partida salen al menos 2 seguras y 2 peligrosas, y nunca 3 iguales seguidas
const MINIMO_DE_CADA = 2;
const MAXIMO_SEGUIDAS = 2;

// ¿Hay 3 (o más) respuestas iguales seguidas?
function hayMuchasSeguidas(preguntas) {
  let seguidas = 1;
  for (let i = 1; i < preguntas.length; i++) {
    seguidas = preguntas[i].correcta === preguntas[i - 1].correcta ? seguidas + 1 : 1;
    if (seguidas > MAXIMO_SEGUIDAS) return true;
  }
  return false;
}

// Mezcla el orden de la partida hasta que no queden muchas iguales seguidas
function ordenarMezclado(preguntas) {
  let orden = mezclar(preguntas);
  for (let intento = 0; intento < 100 && hayMuchasSeguidas(orden); intento++) {
    orden = mezclar(preguntas);
  }
  return orden;
}

// Saca "cantidad" preguntas del mazo de un modo. "posibles" son todas las preguntas de ese modo.
// Cada pregunta se reconoce por su texto.
export function sacarPreguntas(claveModo, posibles, cantidad) {
  const mazos = leerMazos();
  const textosPosibles = posibles.map((p) => p.texto);
  const tipoDe = (texto) => posibles.find((p) => p.texto === texto).correcta;

  // Lo que quedaba en el mazo (sacando preguntas que ya no existan, por si cambiaron)
  let restantes = (mazos[claveModo] || []).filter((t) => textosPosibles.includes(t));
  const elegidas = [];
  const cuenta = { seguro: 0, peligro: 0 };

  // Se puede elegir una pregunta de un tipo si todavía queda lugar para el mínimo del otro tipo
  const sePuede = (texto) => cuenta[tipoDe(texto)] < cantidad - MINIMO_DE_CADA;

  while (elegidas.length < cantidad) {
    // La primera del mazo que se pueda elegir (las otras quedan en el mazo para la próxima)
    let posicion = restantes.findIndex(sePuede);

    // Si no hay ninguna, se agrega al mazo una mezcla nueva (sin las que ya salieron en esta partida)
    if (posicion === -1) {
      const nuevas = mezclar(textosPosibles.filter((t) => !elegidas.includes(t) && !restantes.includes(t)));
      if (nuevas.length === 0) break;
      restantes = [...restantes, ...nuevas];
      posicion = restantes.findIndex(sePuede);
      if (posicion === -1) break;
    }

    const [texto] = restantes.splice(posicion, 1);
    elegidas.push(texto);
    cuenta[tipoDe(texto)]++;
  }

  mazos[claveModo] = restantes;
  guardarMazos(mazos);

  return ordenarMezclado(elegidas.map((texto) => posibles.find((p) => p.texto === texto)));
}