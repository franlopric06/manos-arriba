import { useEffect, useRef, useState } from "react";
import { cargarDetector } from "../services/detectorCuerpo";

const CLAVE_GUARDADA = "manos-arriba-camara";

// Lee y guarda la cámara elegida en el navegador (si el navegador no deja, sigue igual)
function leerGuardada() {
  try {
    return localStorage.getItem(CLAVE_GUARDADA) || "";
  } catch {
    return "";
  }
}
function guardar(id) {
  try {
    localStorage.setItem(CLAVE_GUARDADA, id);
  } catch {
    // sin guardar
  }
}

// Si hay una cámara "integrada" (la de la notebook) y otra más, prefiere la otra: la webcam externa
function elegirExterna(lista) {
  const esIntegrada = (c) => /integrat|integrad|built-in|facetime|internal/i.test(c.label);
  if (!lista.some(esIntegrada)) return "";
  return lista.find((c) => c.label && !esIntegrada(c))?.deviceId || "";
}

// Opciones de video: una cámara puntual si se eligió, si no la de adelante (la de las selfies en el celu)
function opcionesVideo(id) {
  const calidad = { width: { ideal: 1280 }, height: { ideal: 720 } };
  return id ? { deviceId: { exact: id }, ...calidad } : { facingMode: "user", ...calidad };
}

// Prende la webcam, deja listo el detector del cuerpo y permite elegir qué cámara usar
export default function useCamara() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [estado, setEstado] = useState("apagada"); // apagada | prendiendo | lista | error
  const [camaras, setCamaras] = useState([]);
  const [camaraId, setCamaraId] = useState(leerGuardada);

  // Lista de cámaras conectadas (los nombres aparecen recién después de dar permiso una vez)
  async function listarCamaras() {
    try {
      const dispositivos = await navigator.mediaDevices.enumerateDevices();
      const lista = dispositivos.filter((d) => d.kind === "videoinput");
      setCamaras(lista);
      return lista;
    } catch {
      return [];
    }
  }

  // Al abrir el juego, y cada vez que se enchufa o desenchufa una cámara, actualiza la lista
  useEffect(() => {
    if (!navigator.mediaDevices) return;
    listarCamaras();
    navigator.mediaDevices.addEventListener("devicechange", listarCamaras);
    return () => navigator.mediaDevices.removeEventListener("devicechange", listarCamaras);
  }, []);

  function apagar() {
    streamRef.current?.getTracks().forEach((pista) => pista.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  async function prender() {
    if (estado === "lista") return true;
    setEstado("prendiendo");

    try {
      const id = camaraId || elegirExterna(camaras);
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: opcionesVideo(id) });
      } catch (error) {
        if (!id) throw error;
        // La cámara elegida ya no está (por ejemplo, la desenchufaron): usa la que haya
        stream = await navigator.mediaDevices.getUserMedia({ video: opcionesVideo("") });
      }

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      await cargarDetector();
      listarCamaras(); // ahora ya se ven los nombres de las cámaras
      setEstado("lista");
      return true;
    } catch (error) {
      console.warn("No se pudo usar la cámara:", error);
      apagar(); // si la cámara llegó a prenderse, la apagamos para que no quede la luz encendida
      setEstado("error");
      return false;
    }
  }

  // Cambiar de cámara: guarda la elección y apaga la actual; se prende la nueva al tocar "Jugar"
  function elegirCamara(id) {
    setCamaraId(id);
    guardar(id);
    apagar();
    setEstado("apagada");
  }

  return { videoRef, estado, prender, camaras, camaraId, elegirCamara };
}