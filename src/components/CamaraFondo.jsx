// Imagen de la cámara a pantalla completa y en espejo, para que el chico se vea como en un espejo
export default function CamaraFondo({ videoRef, visible }) {
  return (
    <video
      ref={videoRef}
      playsInline
      muted
      className={`pointer-events-none absolute inset-0 size-full -scale-x-100 object-cover ${
        visible ? "" : "hidden"
      }`}
    />
  );
}
