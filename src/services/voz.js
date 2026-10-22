import { VOZ_PREFERIDA } from "../config";

// Lee textos en voz alta:
// 1) Si la frase tiene un audio grabado con la voz de Elena (en public/audios), reproduce ese audio.
// 2) Si no lo tiene (o falla), usa la voz del navegador, buscando la más natural en español.

// ---------- Audios grabados ----------

let indiceAudios = {}; // frase -> nombre del archivo .mp3 (lo arma "npm run audios")
let audioActual = null;
let avisarFin = null; // función que avisa que terminó el audio actual

// Al abrir el juego, carga el índice de audios (si no existe, se usa la voz del navegador)
fetch("/audios/indice.json")
  .then((respuesta) => (respuesta.ok ? respuesta.json() : {}))
  .then((indice) => {
    indiceAudios = indice;
  })
  .catch(() => {});

// Reproduce un audio. Devuelve una promesa: true si sonó (o lo cortaron), false si no se pudo reproducir
function reproducirAudio(archivo) {
  return new Promise((listo) => {
    const audio = new Audio(`/audios/${archivo}`);
    audioActual = audio;

    const terminar = (sono) => {
      if (audioActual === audio) {
        audioActual = null;
        avisarFin = null;
      }
      listo(sono);
    };
    avisarFin = () => terminar(true);

    audio.onended = () => terminar(true);
    audio.onerror = () => terminar(false);
    audio.play().catch(() => terminar(false));
  });
}

// ---------- Voz del navegador (respaldo) ----------

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

function hablarNavegador(texto) {
  return new Promise((listo) => {
    if (!("speechSynthesis" in window)) return listo();

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

// ---------- Lo que usa el resto del juego ----------

// Corta lo que se esté diciendo (audio o voz del navegador)
export function callar() {
  if (audioActual) audioActual.pause();
  if (avisarFin) avisarFin();
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

// Dice una frase y devuelve una promesa que se cumple cuando termina de hablar
export async function hablar(texto) {
  callar(); // corta lo que estaba diciendo antes

  const archivo = indiceAudios[texto];
  if (archivo) {
    const sono = await reproducirAudio(archivo);
    if (sono) return;
  }
  return hablarNavegador(texto);
}