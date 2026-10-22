// Genera los audios del juego con la voz de Elena (argentina), usando la herramienta edge-tts de Python.
// Se corre con:  npm run audios
// Solo genera los audios que faltan, así que se puede volver a correr cada vez que se cambian o agregan preguntas.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import situaciones from "../src/data/situaciones.js";
import { FRASES, fraseResultado } from "../src/data/frases.js";

const VOZ = "es-AR-ElenaNeural";
const CARPETA = "public/audios";
const PYTHON = process.env.PYTHON || "python";
const ESPERA_MAXIMA = 30000; // si Elena tarda más de 30 segundos en una frase, se corta y se sigue con la próxima

// 1) Junta todas las frases que puede decir el juego (sin repetir)
function todasLasFrases() {
  const frases = new Set(Object.values(FRASES));
  for (const s of situaciones) {
    const equivocada = s.correcta === "peligro" ? "seguro" : "peligro";
    frases.add(s.texto); // la pregunta
    frases.add(fraseResultado(s, s.correcta, true)); // si acierta
    frases.add(fraseResultado(s, equivocada, false)); // si se equivoca
    frases.add(fraseResultado(s, null, false)); // si se le acaba el tiempo
  }
  return [...frases];
}

// 2) El nombre de cada audio sale de su texto: si el texto cambia, cambia el nombre (y se genera uno nuevo)
const nombreDe = (frase) => createHash("sha1").update(frase).digest("hex").slice(0, 12) + ".mp3";

mkdirSync(CARPETA, { recursive: true });
const frases = todasLasFrases();
const indice = {};
let nuevos = 0;
let fallados = 0;

for (const [i, frase] of frases.entries()) {
  const archivo = nombreDe(frase);
  const ruta = `${CARPETA}/${archivo}`;

  if (!existsSync(ruta)) {
    console.log(`(${i + 1}/${frases.length}) ${frase}`);
    // Se graba primero en un archivo temporal (.tmp) y recién cuando termina bien se le pone el nombre final.
    // Así, si se corta a la mitad, nunca queda un audio roto con el nombre bueno.
    const temporal = `${ruta}.tmp`;
    try {
      execFileSync(PYTHON, ["-m", "edge_tts", "--voice", VOZ, "--text", frase, "--write-media", temporal], {
        stdio: "inherit",
        timeout: ESPERA_MAXIMA,
      });
      renameSync(temporal, ruta);
      nuevos++;
    } catch {
      // Si falla o se traba (por ejemplo, se cortó internet), se borra lo que quedó a medias y se sigue con la próxima
      if (existsSync(temporal)) unlinkSync(temporal);
      console.log("   No se pudo generar este audio. Volvé a correr npm run audios para reintentar.");
      fallados++;
      continue;
    }
  }
  indice[frase] = archivo;
}

// 3) Borra los audios viejos que ya no se usan (de preguntas que se cambiaron o se sacaron)
const usados = new Set(Object.values(indice));
let borrados = 0;
for (const archivo of readdirSync(CARPETA)) {
  // (también borra los .tmp que hayan quedado de una vez que se cortó)
  if ((archivo.endsWith(".mp3") && !usados.has(archivo)) || archivo.endsWith(".tmp")) {
    unlinkSync(`${CARPETA}/${archivo}`);
    borrados++;
  }
}

// 4) Guarda el índice: qué audio corresponde a cada frase (el juego lo lee para saber qué reproducir)
writeFileSync(`${CARPETA}/indice.json`, JSON.stringify(indice, null, 2));

console.log(`\nListo: ${frases.length} frases, ${nuevos} audios nuevos, ${borrados} viejos borrados, ${fallados} con error.`);