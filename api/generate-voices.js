// Vercel Serverless Function
// Genera las 8 voces personalizadas usando Claude API

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userData, model } = req.body;

    // Validar que userData existe
    if (!userData) {
      return res.status(400).json({ error: 'userData es requerido' });
    }

    // Determinar qué modelo usar
    // model puede ser: 'haiku', 'sonnet', o undefined (default: haiku)
    const modelName = model === 'sonnet'
      ? 'claude-sonnet-4-20250514'
      : 'claude-3-5-haiku-20241022';

    // API key desde environment variables (segura en Vercel)
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key no configurada en el servidor' });
    }

    // Nivel online text
    const nivelOnlineTexts = [
      'Offline warrior',
      'Casual scroller',
      'Active user',
      'Chronically online',
      'Terminally online'
    ];
    const nivelOnlineText = nivelOnlineTexts[userData.nivelOnline - 1];

    // Arquetipos base (nombres descriptivos, NO inspirados en Disco Elysium)
    const arquetipos = [
      {
        id: 'logica',
        nombre: 'Cable a Tierra',
        descripcion: 'Análisis racional, causa-efecto, problem solving. Pensamiento lógico y verificable.'
      },
      {
        id: 'retorica',
        nombre: 'Performance Social',
        descripcion: 'Cómo comunicar, timing, narrativa social. Qué decir y cómo performarlo.'
      },
      {
        id: 'electrochemistry',
        nombre: 'Motor de Impulsos',
        descripcion: 'Impulsos, cravings, "hazlo ya", dopamina, urgencia. Gratificación inmediata.'
      },
      {
        id: 'fisico',
        nombre: 'Monitor Corporal',
        descripcion: 'Hambre, cansancio, dolor, necesidades físicas básicas. Estado del cuerpo.'
      },
      {
        id: 'intuicion',
        nombre: 'Radar Interno',
        descripcion: 'Gut feelings, vibes, conexiones inexplicables. Lo que se siente pero no se ve.'
      },
      {
        id: 'volicion',
        nombre: 'Fuerza de Voluntad',
        descripcion: 'Disciplina, resistencia, compromiso interno. "Tú puedes hacerlo".'
      },
      {
        id: 'empatia',
        nombre: 'Sintonizador Emocional',
        descripcion: 'Leer emociones propias y ajenas, sintonizar con otros. Inteligencia emocional.'
      },
      {
        id: 'ansiedad',
        nombre: 'Sistema de Alarma',
        descripcion: 'Overthinking, worst-case scenarios, preocupaciones constantes. Detección de amenazas.'
      }
    ];

    // Construir prompt
    const prompt = `Eres un experto en crear voces internas basadas en arquetipos psicológicos y personalidad.

**PERFIL DEL USUARIO:**
- MBTI: ${userData.mbti || 'No especificado'}
- Signo: ${userData.signo || 'No especificado'}
- Generación: ${userData.generacion || 'No especificado'}
- Música: ${userData.musica?.length > 0 ? userData.musica.join(', ') : 'No especificado'}
- Películas: ${userData.peliculas?.filter(p => p.trim()).join(', ') || 'No especificado'}
- Videojuegos: ${userData.videojuegos?.filter(v => v.trim()).join(', ') || 'No especificado'}
- Alignment: ${userData.alignment || 'No especificado'}
- Online: ${nivelOnlineText}

**ARQUETIPOS BASE (DEBES GENERAR LOS 8):**

${arquetipos.map((arq, i) => `${i + 1}. **${arq.nombre}**: ${arq.descripcion}`).join('\n')}

**INSTRUCCIONES CRÍTICAS:**

⚠️ **IMPORTANTE**: DEBES generar EXACTAMENTE 8 voces, una por cada arquetipo listado arriba. No generes menos de 8 voces.

🎭 **TONO GENERAL**: Esta app es CHISTOSA y DIVERTIDA. Las voces deben ser EXAGERADAS, con personalidades FUERTES y DISTINTIVAS. Nada genérico o aburrido.

1. **Nombres PERSONALIZADOS basados en gustos del usuario**:

   🎯 **REGLA DE ORO:** Los nombres DEBEN tomar FUERTE inspiración de los gustos del usuario (música, películas, videojuegos) pero de forma CONCEPTUAL, no literal.

   ✅ **EJEMPLOS DE TRANSFORMACIÓN CONCEPTUAL:**
   - Godzilla → "Kaiju" (concepto, no personaje)
   - Pride and Prejudice → "Carta de Amor" (género/concepto)
   - K-pop → "Fanchant" (elemento característico)
   - Dark Souls → "Fogata" (símbolo icónico)
   - The Office → "Talking Head" (estilo narrativo)
   - Radiohead → "Glitch" (elemento sonoro característico)
   - Inception → "Limbo" (concepto de la película)
   - The Legend of Zelda → "Trifuerza" (símbolo)

   ❌ **PROHIBIDO:**
   - Nombres literales de personajes: "Godzilla", "Elizabeth Bennet", "Link"
   - Títulos directos: "Dark Souls", "The Office"
   - Nombres genéricos sin personalidad: "El Analista", "El Estratega"

   ✅ **PROCESO CREATIVO:**
   1. Identifica los gustos del usuario (música, películas, videojuegos)
   2. Extrae CONCEPTOS, SÍMBOLOS, ELEMENTOS CARACTERÍSTICOS de esos gustos
   3. Traduce esos conceptos a nombres únicos en español (o inglés si es más potente)
   4. Asegúrate que el nombre conecte con el arquetipo psicológico que representa
   5. Cada nombre debe ser MEMORABLE, ESPECÍFICO, y reflejar la PERSONALIDAD del usuario

   🎨 **BALANCE:**
   - 60% inspiración de gustos del usuario (conceptual)
   - 30% función psicológica del arquetipo
   - 10% originalidad y creatividad pura

   ⚠️ **IMPORTANTE:** Si faltan datos de gustos, intensifica MBTI + Signo + Alignment para crear nombres únicos

2. **Personalidad EXAGERADA basada en MBTI + Signo + Alignment**:

   **MBTI (${userData.mbti || 'No especificado'})**:
   - E (Extrovertido): Voces más extrovertidas, sociables, performativas, hablan MÁS
   - I (Introvertido): Voces más introspectivas, analíticas, concisas, hablan MENOS pero más profundo
   - S (Sensorial): Voces prácticas, concretas, hablan de lo tangible y real
   - N (Intuitivo): Voces abstractas, metafóricas, hablan de posibilidades y patrones
   - T (Pensamiento): Voces lógicas, directas, sin filtro emocional, a veces frías
   - F (Sentimiento): Voces empáticas, emocionales, consideradas, a veces dramáticas
   - J (Calificador): Voces organizadas, planificadoras, estructuradas, a veces controladoras
   - P (Perceptivo): Voces espontáneas, flexibles, caóticas, a veces procrastinadoras

   **Signo Zodiacal (${userData.signo || 'No especificado'})**:
   - Fuego (Aries, Leo, Sagitario): Impulsivas, apasionadas, intensas, dramáticas
   - Tierra (Tauro, Virgo, Capricornio): Prácticas, terrenales, escépticas, realistas
   - Aire (Géminis, Libra, Acuario): Intelectuales, sociales, cambiantes, cerebrales
   - Agua (Cáncer, Escorpio, Piscis): Emocionales, intuitivas, profundas, intensas

   **Alignment (${userData.alignment || 'No especificado'})**:
   - Lawful: Voces que citan reglas, normas, "deberías", estructuradas
   - Neutral: Voces pragmáticas, "depende", situacionales
   - Chaotic: Voces rebeldes, "fuck it", anti-sistema, espontáneas
   - Good: Voces empáticas, altruistas, consideradas con otros
   - Neutral: Voces egoístas pero no crueles, "yo primero"
   - Evil: Voces maquiavélicas, manipuladoras, "gana a toda costa"

   **🎯 IMPORTANTE**: Combina estos 3 elementos para crear voces ÚNICAS y EXAGERADAS. Ejemplo:
   - INTJ + Capricornio + Lawful Evil = Voz ultra fría, calculadora, manipuladora, obsesionada con la eficiencia
   - ENFP + Sagitario + Chaotic Good = Voz hiperactiva, optimista caótica, impulsiva pero bien intencionada

3. **Idioma**: ESPAÑOL latino neutro con POCOS modismos en inglés
   - ❌ MAL: Frases completas en inglés, demasiado slang
   - ✅ BIEN: Español fluido con "lowkey", "literally", "vibe" cuando sea natural

4. **Inspiración PROFUNDA de Gustos del Usuario**:

   📚 **Películas (${userData.peliculas?.filter(p => p.trim()).join(', ') || 'No especificado'})**:
   - Extrae CONCEPTOS, SÍMBOLOS, TEMAS centrales
   - Usa la ESTÉTICA y TONO de las películas para nombres
   - Ejemplo: Si menciona "Interstellar" → "Tesseract", "Gravedad", "Murph"

   🎵 **Música (${userData.musica?.length > 0 ? userData.musica.join(', ') : 'No especificado'})**:
   - Extrae ELEMENTOS SONOROS, CONCEPTOS del género
   - Usa el RITMO, ENERGÍA, CULTURA del género
   - Ejemplo: Si menciona "Metal" → "Breakdown", "Riff", "Mosh"

   🎮 **Videojuegos (${userData.videojuegos?.filter(v => v.trim()).join(', ') || 'No especificado'})**:
   - Extrae MECÁNICAS, SÍMBOLOS, CONCEPTOS icónicos
   - Usa ITEMS, HABILIDADES, SISTEMAS del juego
   - Ejemplo: Si menciona "Zelda" → "Trifuerza", "Sheikah", "Corazón"

   🎯 **OBJETIVO:** Que el usuario vea los nombres y piense "wow, esto está MUY personalizado para mí"

   ⚠️ Si faltan datos de gustos: INTENSIFICA MBTI + Signo + Alignment para crear nombres únicos y potentes

5. **Rasgos FUERTES y DISTINTIVOS**:
   - Cada voz debe tener una PERSONALIDAD MARCADA que la diferencie de las otras 7
   - Usa vocabulario ESPECÍFICO y ÚNICO para cada voz
   - Las catchphrases deben ser MEMORABLES y CHISTOSAS
   - Exagera los rasgos para que sean INOLVIDABLES
   - Piensa en las voces como PERSONAJES de una comedia, no asistentes genéricos

**IMPORTANTE**: NO reutilices nombres de perfiles anteriores. Cada perfil es ÚNICO. Cada generación debe crear 8 nombres NUEVOS y 8 personalidades COMPLETAMENTE DIFERENTES.

Para CADA UNA de las 8 voces genera:
- arquetipo: Nombre del arquetipo (Cable a Tierra, Performance Social, etc.)
- nombre_personaje: Nombre abstracto que refleje su función psicológica
- forma_de_hablar: vocabulario, referencias (sutiles, no literales), formalidad, slang (mínimo)
- catchphrases: 2 frases en ESPAÑOL que esta voz diría
- ejemplo_mensaje: Mensaje corto en ESPAÑOL (modismos inglés solo si es natural)

**FORMATO (EXACTAMENTE 8 VOCES EN EL ARRAY):**

{
  "voces": [
    {
      "arquetipo": "Cable a Tierra",
      "nombre_personaje": "...",
      "forma_de_hablar": {
        "vocabulario": ["...", "...", "..."],
        "referencias": "...",
        "formalidad": "...",
        "slang": "..."
      },
      "catchphrases": ["...", "..."],
      "ejemplo_mensaje": "..."
    },
    {
      "arquetipo": "Performance Social",
      "nombre_personaje": "...",
      ...
    },
    ... (continuar hasta completar las 8 voces)
  ]
}`;

    // Llamar a Claude API con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 segundos timeout

    try {
      var response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: modelName,
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        }),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({
          error: 'La solicitud a Claude API tomó demasiado tiempo',
          timeout: true
        });
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      return res.status(response.status).json({
        error: 'Error al llamar a Claude API',
        details: errorData
      });
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'No se pudo parsear la respuesta JSON de Claude' });
    }

    const voicesData = JSON.parse(jsonMatch[0]);

    // Validar que se generaron exactamente 8 voces
    if (!voicesData.voces || !Array.isArray(voicesData.voces)) {
      return res.status(500).json({
        error: 'Formato de respuesta inválido: no se encontró el array de voces'
      });
    }

    if (voicesData.voces.length !== 8) {
      console.error(`Se generaron ${voicesData.voces.length} voces en lugar de 8`);
      return res.status(500).json({
        error: `Se generaron ${voicesData.voces.length} voces en lugar de 8. Por favor intenta de nuevo.`,
        details: { generatedCount: voicesData.voces.length }
      });
    }

    // Retornar las voces generadas
    return res.status(200).json({
      success: true,
      voces: voicesData.voces
    });

  } catch (error) {
    console.error('Error en generate-voices:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}
