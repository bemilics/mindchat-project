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

    // Arquetipos base
    const arquetipos = [
      {
        id: 'logica',
        nombre: 'LÓGICA',
        descripcion: 'Análisis racional, causa-efecto, problem solving. Detective analítico.'
      },
      {
        id: 'retorica',
        nombre: 'RETÓRICA',
        descripcion: 'Cómo comunicar, performance social, qué decir y cómo. Social strategist.'
      },
      {
        id: 'electrochemistry',
        nombre: 'ELECTROCHEMISTRY',
        descripcion: 'Impulsos, cravings, "hazlo ya", dopamina, placer/dolor. Hedonist demon.'
      },
      {
        id: 'fisico',
        nombre: 'FÍSICO',
        descripcion: 'Hambre, cansancio, dolor, necesidades básicas del cuerpo. Body status monitor.'
      },
      {
        id: 'intuicion',
        nombre: 'INTUICIÓN',
        descripcion: 'Gut feelings, vibes, creatividad, conexiones raras. Mystical weirdo.'
      },
      {
        id: 'volicion',
        nombre: 'VOLICIÓN',
        descripcion: 'Willpower, autodisciplina, resistencia, "tú puedes". Inner coach.'
      },
      {
        id: 'empatia',
        nombre: 'EMPATÍA',
        descripcion: 'Leer emociones propias y ajenas, sensibilidad social. Emotional intelligence.'
      },
      {
        id: 'ansiedad',
        nombre: 'ANSIEDAD',
        descripcion: 'Overthinking, worst-case scenarios, preocupaciones. Catastrophic thinker.'
      }
    ];

    // Construir prompt
    const prompt = `Eres un experto en crear voces internas basadas en arquetipos psicológicos y personalidad.

**PERFIL DEL USUARIO:**
- MBTI: ${userData.mbti}
- Signo: ${userData.signo}
- Generación: ${userData.generacion}
- Música: ${userData.musica.join(', ')}
- Películas: ${userData.peliculas.join(', ')}
- Videojuegos: ${userData.videojuegos.join(', ')}
- Alignment: ${userData.alignment}
- Online: ${nivelOnlineText}

**ARQUETIPOS BASE (no cambiar):**

${arquetipos.map((arq, i) => `${i + 1}. **${arq.nombre}**: ${arq.descripcion}`).join('\n')}

**INSTRUCCIONES CRÍTICAS:**

1. **Nombres**: Deben estar SUTILMENTE inspirados en los gustos, pero NO ser referencias directas obvias
   - ❌ DEMASIADO LITERAL: "GLadOS" (si puso Portal), "Godzilla" (si puso Godzilla), "Electrochemistry" (nombre del juego)
   - ❌ DEMASIADO GENÉRICO: "El Analista", "El Estratega", "La Corazonada"
   - ✅ SWEET SPOT: "Kaiju" (si puso Godzilla - referencia sutil), "Axioma" (si puso Portal - lógica/puzzles), "Covenant" (si puso Dark Souls - pactos), "Encore" (si puso K-Pop - shows)
   - ✅ NO uses artículos ("El/La"), solo el nombre: "Axioma", "Kaiju", "Encore", "Síntesis"

2. **Personalidad**: Usa el perfil para entender QUÉ REPRESENTA de la persona:
   - MBTI: Define cómo procesa información (${userData.mbti})
   - Gustos: Úsalos para INSPIRAR nombres sutilmente, NO para copiar referencias directas
   - Alignment: Define su brújula moral (${userData.alignment})
   - Online level: Define vocabulario y referencias (${nivelOnlineText})

3. **Idioma**: ESPAÑOL latino neutro con POCOS modismos en inglés
   - ❌ MAL: Frases completas en inglés, demasiado slang
   - ✅ BIEN: Español fluido con "lowkey", "literally", "vibe" cuando sea natural

4. **Inspiración Sutil**: Si el usuario puso:
   - Godzilla/Kaijus → "Kaiju", "Tremor", "Coloso"
   - Portal → "Axioma", "Calibrador", "Protocolo"
   - K-Pop → "Encore", "Fanchant", "Showcase"
   - EDM/Electronic → "Síntesis", "Drop", "BPM"
   - Dark Souls → "Estamina", "Covenant", "Bonfire"
   - Terminally Online → "Doomscroll", "Timeline", "Thread"

Para CADA voz genera:
- nombre_personaje: Nombre abstracto que refleje su función psicológica
- forma_de_hablar: vocabulario, referencias (sutiles, no literales), formalidad, slang (mínimo)
- catchphrases: 2 frases en ESPAÑOL que esta voz diría
- ejemplo_mensaje: Mensaje corto en ESPAÑOL (modismos inglés solo si es natural)

**FORMATO:**

{
  "voces": [
    {
      "arquetipo": "LÓGICA",
      "nombre_personaje": "...",
      "forma_de_hablar": {
        "vocabulario": ["...", "...", "..."],
        "referencias": "...",
        "formalidad": "...",
        "slang": "..."
      },
      "catchphrases": ["...", "..."],
      "ejemplo_mensaje": "..."
    }
  ]
}`;

    // Llamar a Claude API con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 segundos timeout

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
