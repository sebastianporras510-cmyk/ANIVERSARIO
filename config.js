/* ============================================================
   ⚙️  CONFIGURACIÓN — edita solo este archivo para personalizar
   ============================================================ */
const CONFIG = {

  // Fecha correcta que se debe adivinar (formato DD/MM/AA)
  anniversaryDate: "07/09/25",

  // ----------------------------------------------------------
  // AVATARES DEL LABERINTO
  // Usa type:"emoji" con cualquier emoji, o type:"image" con la
  // ruta/URL de una foto de cada uno (recomendado: foto cuadrada).
  // ----------------------------------------------------------
  brideAvatar: {
    type: "image",              // "emoji" | "image"
    value: "fotos/af5c4a55-8c63-4a34-924e-3546fe4c0efc.jpg"                 // emoji o "fotos/ella.jpg"
  },
  groomAvatar: {
    type: "image",              // "emoji" | "image"
    value: "fotos/WhatsApp Image 2026-09-06 at 11.51.04 PM.jpeg"                 // emoji o "fotos/el.jpg"
  },

  // ----------------------------------------------------------
  // FOTOS Y CANCIÓN DE LA PANTALLA FINAL
  // ----------------------------------------------------------
  finalPhotoSrc:"fotos/finalfoto.jpeg",
  videoSrc: "video/videoplayback.mp4",

  // ----------------------------------------------------------
  // OBSEQUIOS DEL CAMINO (5 en total)
  // Cada uno tiene: el ícono que se ve en el laberinto, el título
  // y texto del mensaje, y opcionalmente una foto ("image").
  // Si "image" queda vacío, esa sección simplemente no se muestra.
  // ----------------------------------------------------------
  gifts: [
    {
      icon: "🎁",
      title: "Una pausa en el camino",
      text: "Cada paso de este laberinto es como un día a tu lado: algunos fáciles, otros difíciles, pero todos me trajeron hasta ti. No cambiaría ni una sola vuelta de este camino, porque cada una terminó llevándome a ti. ❤️",
      image: "fotos/118d96ca-9da2-446a-9fd9-baa92c3c064f.jpg"
    },
    {
      icon: "🌷",
      title: "Recuerdo especial",
      text: "Nuestro ahora ❤️ Cada paso, cada vuelta y cada día me trajeron hasta aquí, a ti. Y no cambiaría nada.",
      image: "fotos/WhatsApp Image 2026-09-07 at 12.04.43 AM (2).jpeg"
    },
    {
      icon: "💌",
      title: "Una carta pequeña",
      text: "Si pudiera regresar el tiempo, elegiría este mismo camino contigo, una y otra vez, sin dudarlo.",
      image: "fotos/WhatsApp Image 2026-09-07 at 12.04.43 AM (1).jpeg"
    },
    {
      icon: "✨",
      title: "Un momento que atesoro",
      text: "Hay recuerdos que se quedan para siempre. Este es uno de los míos contigo.",
      image: "fotos/WhatsApp Image 2026-09-07 at 12.04.43 AM.jpeg"
    },
    {
      icon: "💗",
      title: "Ya casi llegamos",
      text: "Un poco más y estaremos juntos otra vez. Gracias por caminar siempre a mi lado.",
      image: "fotos/e79f6dee-62b9-4782-ab15-c11bb9c4459e.jpg"
    }
  ]
};
