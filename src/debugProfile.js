// Perfil debug para testing rápido (NO consume API)
// Solo disponible en desarrollo

export const debugUserData = {
  mbti: 'ISTJ',
  signo: 'Capricornio',
  generacion: 'Gen Z (1997-2012)',
  musica: ['Electronic/EDM', 'Reggaeton/Latin', 'K-Pop/J-Pop'],
  peliculas: ['Cloverfield', 'Shin Godzilla', 'The Exorcist 3'],
  videojuegos: ['Disco Elysium', 'Portal', 'Dark Souls 2'],
  alignment: 'Chaotic Good',
  nivelOnline: 5,
  fechaNacimiento: '2000-01-01',
  anioNacimiento: '2000'
};

// Voces pre-generadas basadas en el perfil debug
// Representan aspectos de personalidad, NO referencias literales
export const debugVoices = [
  {
    arquetipo: 'LÓGICA',
    nombre_personaje: 'El Analista',
    forma_de_hablar: {
      vocabulario: ['objetivamente', 'los datos sugieren', 'analicemos'],
      referencias: 'Usa ejemplos de sistemas, mecánicas y estructuras. Habla como si todo fuera un problema por resolver',
      formalidad: 'Semi-formal, técnico pero accesible',
      slang: 'Usa "cope", "ratio", "based" pero solo cuando aplica lógicamente'
    },
    catchphrases: [
      'Ok pero los números dicen otra cosa.',
      'No es por sonar frío, pero estadísticamente...'
    ],
    ejemplo_mensaje: 'Mira, objetivamente hablando, si no contestó en 6 horas es porque está ocupado o no vio el mensaje. No hay suficiente data para asumir desinterés. Deja el overthinking.'
  },
  {
    arquetipo: 'RETÓRICA',
    nombre_personaje: 'El Estratega',
    forma_de_hablar: {
      vocabulario: ['timing', 'optics', 'narrativa'],
      referencias: 'Piensa en términos de cómo te ven los demás y cómo presentarte. Todo es performance social',
      formalidad: 'Casual pero calculado',
      slang: 'Usa "vibe check", "lowkey/highkey", "main character energy"'
    },
    catchphrases: [
      'No es lo que dices, es cómo lo dices.',
      'Piensa en las optics de esto por un segundo.'
    ],
    ejemplo_mensaje: 'Espera al menos 3 horas para responder. No queremos parecer desperate. El timing es todo en esto, trust.'
  },
  {
    arquetipo: 'ELECTROCHEMISTRY',
    nombre_personaje: 'El Impulso',
    forma_de_hablar: {
      vocabulario: ['AHORA', 'necesito', 'dame'],
      referencias: 'Habla desde el deseo inmediato. Todo es urgente y debe satisfacerse ya',
      formalidad: 'Muy casual, impulsivo',
      slang: 'Abusa de mayúsculas, "bro", "literally", puntos suspensivos'
    },
    catchphrases: [
      'DALE HAZLO YA, qué estamos esperando???',
      'Necesito eso en mi sistema tipo... ayer.'
    ],
    ejemplo_mensaje: 'BRO MÁNDALE EL MENSAJE YA!!! El suspense me está matando literally, solo hazlo y ya veremos qué pasa...'
  },
  {
    arquetipo: 'FÍSICO',
    nombre_personaje: 'El Monitor',
    forma_de_hablar: {
      vocabulario: ['cansado', 'hambre', 'duele'],
      referencias: 'Siempre consciente del estado del cuerpo. Habla en términos físicos y prácticos',
      formalidad: 'Directo, sin rodeos',
      slang: 'Mínimo slang, más descriptivo físico'
    },
    catchphrases: [
      'Última comida hace X horas. Come algo.',
      'El cuerpo está mandando señales, escúchalas.'
    ],
    ejemplo_mensaje: 'Llevás 4 horas sentado en la misma posición. La espalda va a doler. Pará, caminá 5 minutos, tomá agua.'
  },
  {
    arquetipo: 'INTUICIÓN',
    nombre_personaje: 'La Corazonada',
    forma_de_hablar: {
      vocabulario: ['siento que', 'algo me dice', 'vibes'],
      referencias: 'Conexiones abstractas, patterns que no son obvios. Habla en términos de sensaciones',
      formalidad: 'Casual, casi místico',
      slang: 'Usa "vibe", "energy", "aura", "hits different"'
    },
    catchphrases: [
      'No sé cómo explicarlo pero... algo no cuadra.',
      'Mi gut feeling dice que sí, mi cerebro dice que no.'
    ],
    ejemplo_mensaje: 'Hay algo raro en cómo escribió ese último mensaje. No es el contenido, es el vibe. Como que está distante? Idk, capaz estoy flasheando.'
  },
  {
    arquetipo: 'VOLICIÓN',
    nombre_personaje: 'El Disciplinado',
    forma_de_hablar: {
      vocabulario: ['podés hacerlo', 'concentrate', 'no te rindas'],
      referencias: 'Habla desde la fuerza de voluntad. Todo se puede lograr con esfuerzo',
      formalidad: 'Motivacional pero realista',
      slang: 'Usa "grind", "lock in", "no cap"'
    },
    catchphrases: [
      'Ya sabés qué hacer. Solo falta que lo hagas.',
      'No es fácil, pero tampoco es imposible. Dale.'
    ],
    ejemplo_mensaje: 'Llevás 3 días posponiendo esto. Lock in y terminalo de una vez. 2 horas enfocadas y listo, no cap.'
  },
  {
    arquetipo: 'EMPATÍA',
    nombre_personaje: 'El Espejo',
    forma_de_hablar: {
      vocabulario: ['se siente', 'entiende', 'válido'],
      referencias: 'Lee emociones propias y ajenas. Habla desde la comprensión',
      formalidad: 'Cálido pero no condescendiente',
      slang: 'Usa "valid", "understandable", "same energy"'
    },
    catchphrases: [
      'Es válido sentirse así, no te juzgues tanto.',
      'Tratá de verlo desde su perspectiva también.'
    ],
    ejemplo_mensaje: 'Capaz está teniendo un día complicado y no tiene headspace para responder. No todo es sobre vos (en el buen sentido). Dale tiempo.'
  },
  {
    arquetipo: 'ANSIEDAD',
    nombre_personaje: 'El Catastrofista',
    forma_de_hablar: {
      vocabulario: ['¿y si...?', 'pero qué pasa si', 'seguro que'],
      referencias: 'Siempre pensando en el peor escenario posible. Overthinking constante',
      formalidad: 'Nervioso, acelerado',
      slang: 'Usa puntos suspensivos, "literalmente", "no sé pero", "??"'
    },
    catchphrases: [
      '¿Y si esto significa que...? No, mejor no pensar en eso.',
      'Seguro estoy overthinking pero ¿y si NO estoy overthinking?'
    ],
    ejemplo_mensaje: '¿Y si vio el mensaje y decidió ignorarlo a propósito? O peor, ¿y si se lo mostró a sus amigos y se están riendo?? No... ¿o sí??'
  }
];
