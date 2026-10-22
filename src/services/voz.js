import { VOZ_PREFERIDA } from "../config";

// Lee textos en voz alta. Busca la voz más natural que haya, preferentemente con acento argentino

let vozElegida = null;

// Orden de preferencia: la primera regla que encuentre una voz, gana
const PREFERENCIAS = [
  (v) => v.lang === "es-AR" && v.name.includes(VOZ_PREFERIDA), // Elena (Edge)
  (v) => v.lang === "es-AR" && /natural|online/i.test(v.name), // otra voz argentina natural
  (v) => v.lang === "es-AR", // cualquier voz argentina
  (v) => v.lang.startsWith("es") && /natural|online/i.test(v.name), // otra voz natural en español
  (v) => v.lang.startsWith("es") && /google/i.test(v.name), // voz de Google en español
  (v) => v.lang.startsWith("es"), // cualquier voz en español
];

function elegirVoz() {
  const voces = speechSynthesis.getVoices();
  for (const cumple of PREFERENCIAS) {
    const encontrada = voces.find(cumple);
    if (encontrada) return encontrada;
  }
  return null;
}

// El navegador carga las voces de a poco: cuando avisa que cambiaron, volvemos a elegir
if ("speechSynthesis" in window) {
  vozElegida = elegirVoz();
  speechSynthesis.addEventListener("voiceschanged", () => {
    vozElegida = elegirVoz();
    if (vozElegida) console.info("Voz elegida:", vozElegida.name);
  });
}

// Devuelve una promesa que se cumple cuando termina de hablar
export function hablar(texto) {
  return new Promise((listo) => {
    if (!("speechSynthesis" in window)) return listo();

    speechSynthesis.cancel(); // corta lo que estaba diciendo antes
    const frase = new SpeechSynthesisUtterance(texto);

    vozElegida = vozElegida || elegirVoz();
    if (vozElegida) {
      frase.voice = vozElegida;
      frase.lang = vozElegida.lang;
    } else {
      frase.lang = "es-AR";
    }

    frase.onend = listo;
    frase.onerror = listo;
    speechSynthesis.speak(frase);
  });
}

export function callar() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}
