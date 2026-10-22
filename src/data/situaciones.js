// Banco de situaciones del juego. Están escritas como si un chico le contara a otro lo que le pasó.
// nivel: 1 = Chicos (5 a 7), 2 = Medianos (8 a 10), 3 = Grandes (11 o más). Cada modo usa solo su nivel.
// icono: nombre de la imagen 3D en public/iconos — emoji: se muestra si la imagen no carga
// correcta: "seguro" o "peligro"
// explica: lo que se lee después de responder. Dice por qué y qué hacer.
// (no felicita ni reta: eso lo dice el título según si el chico acertó o no)

const situaciones = [
  // ---------- Nivel 1: Chicos (5 a 7 años) ----------
  { nivel: 1, icono: "foto", emoji: "📸", correcta: "peligro", texto: "Un chico que no conozco me pidió una foto mía por el celu", explica: "¡No se la mandes! No sabés quién es ni qué va a hacer con tu foto. Mostrale el mensaje a tu mamá o a tu papá." },
  { nivel: 1, icono: "llave", emoji: "🔑", correcta: "peligro", texto: "Le pasé mi contraseña de Roblox a mi mejor amigo", explica: "La contraseña es como la llave de tu casa: no se le da a nadie, ni a tu mejor amigo. Solo la saben vos y tus papás." },
  { nivel: 1, icono: "numeros", emoji: "🔢", correcta: "peligro", texto: "Mi contraseña del Free Fire es 123456", explica: "¡Esa la adivina cualquiera! Armá una más larga, mezclando letras y números." },
  { nivel: 1, icono: "casa", emoji: "🏠", correcta: "peligro", texto: "En el chat del juego puse en qué barrio vivo", explica: "Eso lo puede leer cualquiera, hasta gente mala. Dónde vivís es un secreto de la familia." },
  { nivel: 1, icono: "videollamada", emoji: "🎥", correcta: "peligro", texto: "Me llamó por videollamada alguien que no conozco y atendí", explica: "A los desconocidos no se los atiende. Si te pasa, cortá y avisale a un grande." },
  { nivel: 1, icono: "silencio", emoji: "🤫", correcta: "peligro", texto: "Uno que conocí jugando me dijo: «No les cuentes a tus papás que hablamos»", explica: "¡Alerta! Un amigo de verdad no te pide secretos con tus papás. Contales enseguida." },
  { nivel: 1, icono: "enojado", emoji: "😡", correcta: "peligro", texto: "Le mandé cosas feas a un compañero en el grupo del grado", explica: "Eso lastima un montón, aunque sea por el celu. Tratá a los demás como te gusta que te traten." },
  { nivel: 1, icono: "regalo", emoji: "🎁", correcta: "peligro", texto: "Uno del Free Fire me dijo que me regala un personaje si le digo dónde vivo", explica: "Es una trampa: nadie regala nada. Dónde vivís no se le dice a nadie de internet." },
  { nivel: 1, icono: "tarjeta", emoji: "💳", correcta: "peligro", texto: "En Roblox me apareció «Comprá Robux» y toqué Comprar con la tarjeta de mi papá", explica: "¡Ojo! Eso es plata de verdad de tus papás. Antes de comprar algo en un juego, siempre preguntá." },
  { nivel: 1, icono: "selfie", emoji: "🤳", correcta: "peligro", texto: "Me saqué una foto y la subí a las redes sin preguntarle a nadie", explica: "Antes de subir una foto, preguntale a tu mamá o a tu papá. Una vez que la subís, la puede ver cualquiera." },
  { nivel: 1, icono: "mensaje", emoji: "💬", correcta: "peligro", texto: "Uno del juego me insultó y yo le contesté con insultos", explica: "Mejor no le contestes, porque se pone peor. Bloquealo y contale a un grande." },
  { nivel: 1, icono: "videojuego", emoji: "🎮", correcta: "seguro", texto: "Antes de bajarme un jueguito, le pregunté a mi mamá", explica: "Eso estuvo bien: algunos jueguitos traen virus, que son programas que rompen el celu. Preguntar siempre suma." },
  { nivel: 1, icono: "stop", emoji: "🛑", correcta: "seguro", texto: "Uno me molestaba en Roblox: lo bloqueé y le conté a mi papá", explica: "¡Eso es lo que hay que hacer! Bloquear y contarle a un grande." },
  { nivel: 1, icono: "familia", emoji: "🫂", correcta: "seguro", texto: "Me llegó un mensaje raro y se lo mostré a mi familia", explica: "Eso estuvo bien. Si algo te parece raro, pedir ayuda siempre es lo mejor." },
  { nivel: 1, icono: "no", emoji: "🙅", correcta: "seguro", texto: "Uno me pidió una foto y le dije que no", explica: "Eso estuvo muy bien: siempre podés decir que no. Nadie te puede obligar." },
  { nivel: 1, icono: "maestra", emoji: "🧑‍🏫", correcta: "seguro", texto: "Le conté a la seño que en el grupo del grado me hacen sentir mal", explica: "Eso estuvo bien: los grandes te pueden ayudar. No te lo guardes." },
  { nivel: 1, icono: "pelota", emoji: "⚽", correcta: "seguro", texto: "Dejé el celu un rato y salí a jugar a la pelota", explica: "Eso estuvo bien: no está bueno estar todo el día con el celular. Salir a jugar con tus amigos también es re divertido." },
  { nivel: 1, icono: "ojos", emoji: "👀", correcta: "seguro", texto: "Vi un video que me dio miedo y se lo conté a mi mamá", explica: "Eso estuvo bien. Si algo te asusta en internet, contáselo a un grande." },

  // ---------- Nivel 2: Medianos (8 a 10 años) ----------
  { nivel: 2, icono: "moneda", emoji: "🪙", correcta: "peligro", texto: "En Free Fire uno me ofreció diamantes gratis si le pasaba mi usuario y contraseña", explica: "Nadie regala diamantes: lo que quiere es entrar a tu cuenta y quedársela. Tu contraseña no se la pasás a nadie." },
  { nivel: 2, icono: "web", emoji: "🌐", correcta: "peligro", texto: "Encontré una página que dice «Robux gratis» y puse mi usuario y contraseña", explica: "Esas páginas son truchas: no te dan nada y te roban la cuenta. Los Robux gratis no existen." },
  { nivel: 2, icono: "tarjeta", emoji: "💳", correcta: "peligro", texto: "Agarré la tarjeta de mi mamá sin avisar para comprar diamantes y pasar de nivel", explica: "Los juegos te traban a propósito para que gastes plata de verdad. Nunca uses la tarjeta sin permiso: hablalo con tus papás." },
  { nivel: 2, icono: "videojuego", emoji: "🎮", correcta: "peligro", texto: "Me bajé el Minecraft «gratis» de una página rara", explica: "Las versiones truchas suelen traer virus. Los juegos se bajan solo de la tienda oficial, con permiso de tus papás." },
  { nivel: 2, icono: "regalo", emoji: "🎁", correcta: "peligro", texto: "Me llegó un mensaje que decía «¡Ganaste un celu! Tocá acá»", explica: "Es una trampa para que toques. Nadie regala celus así nomás. Borralo y no toques nada." },
  { nivel: 2, icono: "mensaje", emoji: "💬", correcta: "peligro", texto: "Alguien me pidió el código que me llegó por mensaje al celu", explica: "Con ese código te pueden robar el WhatsApp. Ese código es solo tuyo: no se lo pases a nadie." },
  { nivel: 2, icono: "apreton", emoji: "🤝", correcta: "peligro", texto: "Acepté de amigo en el juego a uno que no conozco", explica: "En internet no todos son quien dicen ser: un grande se puede hacer pasar por un chico. Aceptá solo a los que conocés de verdad." },
  { nivel: 2, icono: "clip", emoji: "📎", correcta: "peligro", texto: "Abrí un archivo que me mandó uno que no conozco", explica: "Puede traer un virus escondido, que es un programa que te roba cosas o rompe el celu. Si no sabés quién es, no lo abras." },
  { nivel: 2, icono: "link", emoji: "🔗", correcta: "peligro", texto: "Me llegó un mensaje: «Mirá esta foto tuya» con un link", explica: "Es un truco para que toques el link y te roben tus datos. No lo abras y mostráselo a un grande." },
  { nivel: 2, icono: "escuela", emoji: "🏫", correcta: "peligro", texto: "Subí una foto con el guardapolvo y se ve el nombre de la escuela", explica: "Así cualquiera sabe dónde encontrarte. Antes de subir una foto, fijate bien qué se ve." },
  { nivel: 2, icono: "selfie", emoji: "🤳", correcta: "peligro", texto: "Puse mi nombre completo y mi escuela en el perfil del juego", explica: "Con esos datos cualquiera te puede encontrar. Mejor usá un apodo." },
  { nivel: 2, icono: "llave-vieja", emoji: "🗝️", correcta: "peligro", texto: "Uso la misma contraseña para todos los juegos", explica: "Si alguien descubre una, entra a todas tus cuentas. Mejor tener una distinta para cada una." },
  { nivel: 2, icono: "familia", emoji: "🫂", correcta: "seguro", texto: "Antes de comprar algo en el Free Fire, le pregunté a mi papá", explica: "Eso estuvo bien: es plata de verdad, y tus papás te ayudan a ver si vale la pena o si es una trampa." },
  { nivel: 2, icono: "puerta", emoji: "🚪", correcta: "seguro", texto: "Cerré mi cuenta cuando terminé de usar la compu de la escuela", explica: "Eso estuvo bien: si la dejás abierta, el que viene después puede entrar a tu cuenta." },
  { nivel: 2, icono: "candado", emoji: "🔒", correcta: "seguro", texto: "Tengo mi perfil privado en las redes", explica: "Eso está bien: así solo te ven los que vos elegís, y no cualquier desconocido." },
  { nivel: 2, icono: "camara", emoji: "📷", correcta: "seguro", texto: "Tapé la camarita de la compu cuando no la uso", explica: "Eso está bien: así nadie te puede espiar." },
  { nivel: 2, icono: "candado-llave", emoji: "🔐", correcta: "seguro", texto: "Mi contraseña es larga y tiene letras y números", explica: "Eso está bien: así es re difícil de adivinar." },
  { nivel: 2, icono: "ojos", emoji: "👀", correcta: "seguro", texto: "Antes de subir una foto con mi amigo, le pregunté si quería salir", explica: "Eso estuvo bien: las fotos de los demás también hay que cuidarlas." },

  // ---------- Nivel 3: Grandes (11 años o más) — tienen trampa ----------
  { nivel: 3, icono: "banco", emoji: "🏦", correcta: "peligro", texto: "Me llegó un mail «del banco» que dice que si no pongo la clave me bloquean la cuenta", explica: "Los bancos nunca te piden la clave por mail ni por mensaje. Es una estafa para robarte la plata." },
  { nivel: 3, icono: "paquete", emoji: "📦", correcta: "peligro", texto: "Me llegó un mensaje: «Tu paquete está trabado, pagá $500 acá» con un link", explica: "Es una estafa re común: el link te lleva a una página trucha que te roba los datos de la tarjeta. Si esperás un paquete, preguntá directo en el correo." },
  { nivel: 3, icono: "mensaje", emoji: "💬", correcta: "peligro", texto: "Me escribieron de «soporte de WhatsApp» pidiéndome el código de 6 números", explica: "WhatsApp nunca te pide ese código. Si lo pasás, te roban la cuenta y les escriben a tus contactos haciéndose pasar por vos." },
  { nivel: 3, icono: "selfie", emoji: "🤳", correcta: "peligro", texto: "Me escribió un amigo desde un número nuevo pidiéndome plata urgente", explica: "Puede ser alguien haciéndose pasar por él. Antes de mandar nada, llamalo a su número de siempre." },
  { nivel: 3, icono: "microfono", emoji: "🎙️", correcta: "peligro", texto: "Me llegó un audio con la voz de mi primo pidiéndome un código", explica: "Hoy, con inteligencia artificial, se puede copiar la voz de cualquiera. Confirmá llamándolo vos." },
  { nivel: 3, icono: "videollamada", emoji: "🎥", correcta: "peligro", texto: "Vi un video de un famoso pidiendo que transfiera plata para un sorteo", explica: "Con inteligencia artificial se pueden hacer videos falsos de famosos. Los sorteos de verdad no te piden plata." },
  { nivel: 3, icono: "tarjeta", emoji: "💳", correcta: "peligro", texto: "Una página me ofreció el pase del Free Fire a mitad de precio si ponía los datos de la tarjeta", explica: "Si una oferta es demasiado buena, es trampa: quieren los datos de la tarjeta. Comprá solo dentro del juego y con permiso." },
  { nivel: 3, icono: "moneda", emoji: "🪙", correcta: "peligro", texto: "Alguien que conocí en un juego me pidió fotos y me ofreció diamantes a cambio", explica: "Es una trampa muy peligrosa. Cortá la charla, no mandes nada y contale enseguida a un adulto de confianza." },
  { nivel: 3, icono: "wifi", emoji: "📶", correcta: "peligro", texto: "Me conecté al wifi gratis de la plaza para entrar a mi cuenta", explica: "En un wifi público otros pueden espiar lo que hacés. Para entrar a tus cuentas, usá tus datos o el wifi de tu casa." },
  { nivel: 3, icono: "link", emoji: "🔗", correcta: "peligro", texto: "Escaneé un código QR pegado en la calle que prometía premios", explica: "Un QR también te puede llevar a una página trucha. Si no sabés de dónde viene, no lo escanees." },
  { nivel: 3, icono: "rompecabezas", emoji: "🧩", correcta: "peligro", texto: "Una app de jueguitos me pidió ver mis contactos y mis fotos, y le di permiso", explica: "Un juego no necesita tus contactos ni tus fotos. Si una app pide permisos raros, decile que no." },
  { nivel: 3, icono: "lupa", emoji: "🔎", correcta: "peligro", texto: "Compartí una noticia increíble sin fijarme si era verdad", explica: "Muchas noticias son falsas y se arman para engañar. Antes de compartir, fijate si lo dicen otros lugares confiables." },
  { nivel: 3, icono: "dos-pasos", emoji: "📲", correcta: "seguro", texto: "Activé la verificación en dos pasos en mi cuenta", explica: "Eso está bien: aunque alguien sepa tu contraseña, no puede entrar sin el código que te llega al celu." },
  { nivel: 3, icono: "web", emoji: "🌐", correcta: "seguro", texto: "Antes de poner mis datos, me fijé que la página fuera la oficial", explica: "Eso estuvo bien: hay páginas truchas que copian a las de verdad. Mirar bien la dirección te salva." },
  { nivel: 3, icono: "camara", emoji: "📷", correcta: "seguro", texto: "Reviso qué apps pueden usar mi cámara y mi micrófono", explica: "Eso está bien: así sabés quién te puede ver o escuchar." },
  { nivel: 3, icono: "candado-llave", emoji: "🔐", correcta: "seguro", texto: "Tengo una contraseña distinta para cada cuenta", explica: "Eso está bien: si te roban una, las demás siguen a salvo." },
  { nivel: 3, icono: "actualizar", emoji: "🔄", correcta: "seguro", texto: "Hago copia de seguridad de mis fotos", explica: "Eso está bien: si se te rompe o te roban el celu, no perdés tus recuerdos." },
  { nivel: 3, icono: "basura", emoji: "🗑️", correcta: "seguro", texto: "Antes de regalar mi celu viejo, lo reseteé de fábrica", explica: "Eso estuvo bien: así se borran tus fotos, tus mensajes y tus cuentas, y nadie más las puede ver." },
];

export default situaciones;