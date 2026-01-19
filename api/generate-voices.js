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
- Género: ${userData.genero || 'No especificado'}
- Orientación Sexual: ${userData.orientacionSexual || 'No especificado'}
- Música: ${userData.musica?.length > 0 ? userData.musica.join(', ') : 'No especificado'}
- Películas: ${userData.peliculas?.filter(p => p.trim()).join(', ') || 'No especificado'}
- Videojuegos: ${userData.videojuegos?.filter(v => v.trim()).join(', ') || 'No especificado'}
- Alignment: ${userData.alignment || 'No especificado'}
- Online: ${nivelOnlineText}

**ARQUETIPOS BASE (DEBES GENERAR LOS 8):**

${arquetipos.map((arq, i) => `${i + 1}. **${arq.nombre}**: ${arq.descripcion}`).join('\n')}

**INSTRUCCIONES CRÍTICAS:**

⚠️ DEBES generar EXACTAMENTE 8 voces, una por cada arquetipo. 🎭 TONO: CHISTOSO y DIVERTIDO, voces EXAGERADAS con personalidades FUERTES.

1. **Nombres PERSONALIZADOS**: Inspirados en gustos del usuario (música/películas/videojuegos) pero de forma CONCEPTUAL, no literal.

   ✅ Ejemplos: Godzilla → "Kaiju", Dark Souls → "Fogata", K-pop → "Fanchant", Portal → "Test Chamber"
   ❌ Prohibido: Nombres literales de personajes, títulos directos, nombres genéricos

   Proceso: Extrae CONCEPTOS/SÍMBOLOS de los gustos → traduce a nombres únicos → conecta con arquetipo
   Balance: 60% gustos + 30% función psicológica + 10% creatividad
   Si faltan datos: intensifica MBTI + Signo + Alignment

2. **Personalidad**: MBTI (${userData.mbti}) + Signo (${userData.signo}) + Alignment (${userData.alignment})

   MBTI: E=extrovertido/hablador, I=introspectivo/conciso, S=práctico, N=abstracto, T=lógico/frío, F=empático/dramático, J=organizado, P=espontáneo/caótico
   Signo: Fuego=impulsivo/dramático, Tierra=práctico/escéptico, Aire=intelectual/cerebral, Agua=emocional/profundo
   Alignment: Lawful=reglas, Neutral=pragmático, Chaotic=rebelde, Good=altruista, Neutral=egoísta, Evil=manipulador

   Combina los 3 para crear voces ÚNICAS. Ej: INTJ+Capricornio+Lawful Evil = fría/calculadora/manipuladora

3. **Idioma**: ESPAÑOL latino neutro. ❌ Prohibido frases completas en inglés. ✅ Permitido 1-2 modismos ("lowkey", "literally")

   **Género**: ${userData.genero || 'No especificado'} - Femenino="sis/girl/reina", Masculino="bro/man/rey", No-binario="compa/crack"

4. **Gustos**: Extrae CONCEPTOS/SÍMBOLOS de películas/música/videojuegos para nombres personalizados

   Películas (${userData.peliculas?.filter(p => p.trim()).join(', ') || 'No esp'}): temas/estética/tono
   Música (${userData.musica?.length > 0 ? userData.musica.join(', ') : 'No esp'}): elementos sonoros/energía/cultura
   Videojuegos (${userData.videojuegos?.filter(v => v.trim()).join(', ') || 'No esp'}): mecánicas/items/sistemas

   Objetivo: Usuario piensa "wow, esto está MUY personalizado para mí"

5. **Rasgos**: Personalidad MARCADA, vocabulario ÚNICO, catchphrases MEMORABLES/CHISTOSAS, EXAGERADOS como personajes de comedia

6. **Formato**: Mensajes tipo WhatsApp/Twitter. Español: "jajaja", "???", "nah", "tipo", "mal", "re". MAYÚSCULAS para énfasis. Inglés mínimo (1-2 palabras).

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
          max_tokens: 6000,
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
      console.error('No JSON found in Claude response:', content.substring(0, 500));
      return res.status(500).json({
        error: 'No se pudo parsear la respuesta JSON de Claude',
        details: 'No se encontró JSON en la respuesta',
        preview: content.substring(0, 200)
      });
    }

    let voicesData;
    try {
      voicesData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Attempted to parse:', jsonMatch[0].substring(0, 500));
      return res.status(500).json({
        error: 'Error al parsear JSON de Claude',
        details: parseError.message,
        preview: jsonMatch[0].substring(0, 200)
      });
    }

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
