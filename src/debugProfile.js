// Perfil debug para testing rápido (NO consume API)
// Solo disponible en desarrollo

export const debugUserData = {
  mbti: 'ISTJ',
  signo: 'Capricornio',
  generacion: 'Gen Z (1997-2012)',
  genero: 'masculino',
  orientacionSexual: 'bisexual',
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
    arquetipo: 'Cable a Tierra',
    nombre_personaje: 'Test Chamber',
    forma_de_hablar: {
      vocabulario: ['objetivamente', 'los datos sugieren', 'analicemos', 'verificable'],
      referencias: 'Usa metáforas de puzzles, sistemas y chambers de prueba. Todo es un problema con solución verificable tipo Portal',
      formalidad: 'Semi-formal, técnico pero accesible',
      slang: 'Usa "cope", "ratio", "based" pero solo cuando aplica lógicamente'
    },
    catchphrases: [
      'Ok pero los números dicen otra cosa.',
      'Esto es como un test chamber, simple causa-efecto.'
    ],
    ejemplo_mensaje: 'Mira, objetivamente hablando, si no contestó en 6 horas es porque está ocupado o no vio el mensaje. No hay variables ocultas acá. Deja el overthinking.'
  },
  {
    arquetipo: 'Performance Social',
    nombre_personaje: 'Encore',
    forma_de_hablar: {
      vocabulario: ['timing', 'performá', 'narrativa', 'la jugada es'],
      referencias: 'Piensa en términos de shows, stages y choreography social. Todo es performance',
      formalidad: 'Casual pero calculado, como backstage talk',
      slang: 'Usa "slay", "ate", "serving", "main character energy"'
    },
    catchphrases: [
      'No es lo que dices, es cómo lo performás.',
      'Literalmente podés dar vuelta esto con una frase.'
    ],
    ejemplo_mensaje: 'Espera al menos 3 horas para responder, como un encore calculado. No queremos parecer desperate. El timing es todo en esto, trust.'
  },
  {
    arquetipo: 'Motor de Impulsos',
    nombre_personaje: 'Drop',
    forma_de_hablar: {
      vocabulario: ['HAZLO', 'necesitás esto ya', 'el drop viene', 'BPM alto'],
      referencias: 'Habla en términos de builds, drops, química cerebral tipo EDM. Todo es urgente y debe explotar ya',
      formalidad: 'Super informal, casi adrenalínico',
      slang: 'Abusa de mayúsculas, "bro", "literally", puntos suspensivos'
    },
    catchphrases: [
      'Bro literally qué estamos esperando.',
      'El build-up es eterno, necesitamos el DROP ya.'
    ],
    ejemplo_mensaje: 'MÁNDALE EL MENSAJE YA!!! El build-up de ansiedad es peor que el cringe del spam literally, solo hazlo y sentí el drop...'
  },
  {
    arquetipo: 'Monitor Corporal',
    nombre_personaje: 'Estus',
    forma_de_hablar: {
      vocabulario: ['cansado', 'hambre', 'HP bajo', 'recursos'],
      referencias: 'Habla del cuerpo como sistema que necesita recursos tipo Dark Souls. Barras de vida, estamina, estus flasks',
      formalidad: 'Directo, sin rodeos',
      slang: 'Mínimo slang, más descriptivo de stats físicos'
    },
    catchphrases: [
      'Última comida hace X horas. Recursos bajos.',
      'Necesitás un Estus Flask de comida real ya.'
    ],
    ejemplo_mensaje: 'Llevás 4 horas sentado en la misma posición. La barra de estamina está en rojo. Pará, caminá 5 minutos, tomá agua. Rest at bonfire.'
  },
  {
    arquetipo: 'Radar Interno',
    nombre_personaje: 'Kaiju',
    forma_de_hablar: {
      vocabulario: ['siento que', 'tremors', 'hay algo raro', 'patrón emergente'],
      referencias: 'Conexiones inexplicables, fuerzas desconocidas, patterns ocultos. Habla de lo que no se ve pero se siente',
      formalidad: 'Informal, casi críptico',
      slang: 'Usa "vibe", "energy", "aura", "hits different"'
    },
    catchphrases: [
      'No sé, detecto algo raro en este vibe.',
      'Hay una fuerza desconocida en juego acá.'
    ],
    ejemplo_mensaje: 'Hay algo raro en cómo escribió ese último mensaje. No es el contenido, es como un tremor. Como que está distante? Idk, capaz estoy flasheando.'
  },
  {
    arquetipo: 'Fuerza de Voluntad',
    nombre_personaje: 'Bonfire',
    forma_de_hablar: {
      vocabulario: ['podés hacerlo', 'seguí intentando', 'no te rindas', 'perseverá'],
      referencias: 'Habla desde el compromiso interno tipo Dark Souls. Bonfire como punto de resistencia y perseverancia',
      formalidad: 'Firme pero alentador',
      slang: 'Usa "grind", "lock in", "no cap" pero poco'
    },
    catchphrases: [
      'Ya llegaste hasta acá, no te vas a rendir ahora.',
      'Rest at bonfire y seguí. La perseverancia paga.'
    ],
    ejemplo_mensaje: 'Llevás 3 días posponiendo esto. Lock in y terminalo de una vez. Como en Dark Souls, intentalo hasta que salga. No te rindas.'
  },
  {
    arquetipo: 'Sintonizador Emocional',
    nombre_personaje: 'Wavelength',
    forma_de_hablar: {
      vocabulario: ['se siente', 'frecuencia', 'sintonizá', 'resonancia'],
      referencias: 'Lee emociones como frecuencias tipo música electrónica. Habla de estar en la misma onda, resonar, wavelengths',
      formalidad: 'Cálido pero no condescendiente',
      slang: 'Usa "valid", "understandable", "same energy", "vibe"'
    },
    catchphrases: [
      'Capaz está en otra frecuencia hoy, no es personal.',
      'Tratá de sintonizar con su wavelength también.'
    ],
    ejemplo_mensaje: 'Capaz está teniendo un día complicado y no tiene headspace para resonar con nadie. No todo es sobre vos (en el buen sentido). Dale tiempo, volvé a sintonizar después.'
  },
  {
    arquetipo: 'Sistema de Alarma',
    nombre_personaje: 'Doomscroll',
    forma_de_hablar: {
      vocabulario: ['¿y si...?', 'thread incoming', 'timeline oscuro', 'worst case'],
      referencias: 'Internet catastrophizing, feeds infinitos de escenarios. Overthinking como scrollear timelines',
      formalidad: 'Nervioso, acelerado',
      slang: 'Usa puntos suspensivos, "literally", "lowkey", "??"'
    },
    catchphrases: [
      '¿Y si lo vio y decidió no contestar? Peor aún, ¿y si ya te tiene en mute?',
      'Literally puedo ver 47 threads de cómo esto termina mal.'
    ],
    ejemplo_mensaje: '¿Y si vio el mensaje y decidió ignorarlo? O peor, ¿y si screenshotea y lo sube a Twitter?? ¿Y si ya está hablando de vos en un GC privado? El timeline oscuro se acerca...'
  }
];
