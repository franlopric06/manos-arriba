import { useState } from "react";

// Ícono 3D de la situación (imágenes de public/iconos). Si la imagen no carga, muestra el emoji
export default function Icono({ nombre, emoji, className = "" }) {
  const [fallo, setFallo] = useState(false);

  if (fallo || !nombre) {
    return <span className={`grid place-items-center text-[min(8vh,12vw)] leading-none ${className}`}>{emoji}</span>;
  }

  return (
    <img
      src={`/iconos/${nombre}.webp`}
      alt=""
      draggable="false"
      onError={() => setFallo(true)}
      className={`object-contain drop-shadow-[0_6px_10px_rgb(0_0_0/0.35)] ${className}`}
    />
  );
}
