// Cartelito que le avisa al chico si la cámara lo está viendo y qué mano detecta
export default function EstadoCamara({ lectura }) {
    let texto = "No te veo: ponete frente a la cámara";
  let estilo = "bg-peligro-osc/90 text-tinta border-peligro";

  if (lectura.hayPersona) {
    if (lectura.eleccion === "seguro") texto = "Veo tu mano izquierda ✓";
    else if (lectura.eleccion === "peligro") texto = "Veo tu mano derecha ✓";
    else texto = "Te veo ✓";
    estilo = "bg-noche-2/90 text-tinta border-seguro";
  }

  return (
    <p
      className={`rounded-full border-2 px-4 py-1 text-center text-[max(0.8rem,min(2.4vh,1rem))] font-extrabold ${estilo}`}
    >
      {texto}
    </p>
  );
}