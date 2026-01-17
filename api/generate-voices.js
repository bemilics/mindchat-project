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


1. **Nombres**: Deben estar SUTILMENTE inspirados en los gustos, pero NO ser referencias directas obvias
   - ❌ DEMASIADO LITERAL: Copiar nombres de personajes, lugares o elementos directamente de sus gustos
   - ❌ DEMASIADO GENÉRICO: "El Analista", "El Estratega", "La Corazonada"
   - ✅ SWEET SPOT: Nombres abstractos que evoquen SENSACIONES, MECÁNICAS o TEMAS de sus gustos
   - ✅ NO uses artículos ("El/La"), solo el nombre
   - ✅ Crea nombres ORIGINALES que nadie más tendría - piensa en metáforas únicas

2. **Personalidad**: Usa el perfil para entender QUÉ REPRESENTA de la persona:
   - MBTI: Define cómo procesa información (${userData.mbti})
   - Gustos: Úsalos para INSPIRAR nombres sutilmente, NO para copiar referencias directas
   - Alignment: Define su brújula moral (${userData.alignment})
   - Online level: Define vocabulario y referencias (${nivelOnlineText})

3. **Idioma**: ESPAÑOL latino neutro con POCOS modismos en inglés
   - ❌ MAL: Frases completas en inglés, demasiado slang
   - ✅ BIEN: Español fluido con "lowkey", "literally", "vibe" cuando sea natural

4. **Inspiración Sutil**: Los nombres deben ser ÚNICOS y originales basados en los gustos del usuario
   - Toma conceptos ABSTRACTOS de sus películas/juegos/música favoritos
   - Si algún campo está vacío o dice "No especificado", usa MBTI, alignment y nivel online para inspirarte
   - NO copies nombres de personajes, lugares o elementos directamente
   - Piensa en SENSACIONES, MECÁNICAS, TEMAS que representen esos medios
   - Cada perfil debe generar nombres COMPLETAMENTE DIFERENTES
   - Usa el MBTI y alignment para definir el tono de los nombres
   - NUNCA uses estos nombres: Axioma, Encore, Síntesis, Estamina, Kaiju, Covenant, Wavelength, Doomscroll

**IMPORTANTE**: NO reutilices nombres de perfiles anteriores. Cada perfil es ÚNICO. Cada generación debe crear 8 nombres NUEVOS.

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
