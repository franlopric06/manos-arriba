// Sonidos del juego generados por el navegador (Web Audio), sin archivos de audio

let contexto = null;

// Cada sonido es una lista de notas (frecuencias en Hz) y un tipo de onda
const MELODIAS = {
  bien: { notas: [523, 659, 784, 1046], tipo: "square" },
  mal: { notas: [220, 180, 220, 180], tipo: "sawtooth" },
  tic: { notas: [660], tipo: "square" },
  ya: { notas: [784, 1046], tipo: "square" },
};

export function sonar(nombre) {
  try {
    contexto = contexto || new AudioContext();
    const { notas, tipo } = MELODIAS[nombre];

    notas.forEach((frecuencia, i) => {
      const oscilador = contexto.createOscillator();
      const volumen = contexto.createGain();

      oscilador.type = tipo;
      oscilador.frequency.value = frecuencia;
      volumen.gain.value = 0.06;

      oscilador.connect(volumen);
      volumen.connect(contexto.destination);

      // Cada nota suena un poquito después de la anterior
      const inicio = contexto.currentTime + i * 0.12;
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.11);
    });
  } catch {
    // Si el navegador no permite sonido, el juego sigue igual
  }
}
