// Vercel Serverless Function
// Genera las 8 voces personalizadas usando Claude API

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userData } = req.body;

    // Validar que userData existe
    if (!userData) {
      return res.status(400).json({ error: 'userData es requerido' });
    }

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
    const prompt = `Eres un experto en crear personajes de voces internas basados en perfiles de personalidad.

Tu tarea es generar 8 voces internas personalizadas para un usuario con el siguiente perfil:

**PERFIL DEL USUARIO:**
- MBTI: ${userData.mbti}
- Signo zodiacal: ${userData.signo}
- Generación: ${userData.generacion}
- Música favorita: ${userData.musica.join(', ')}
- Películas favoritas: ${userData.peliculas.join(', ')}
- Videojuegos favoritos: ${userData.videojuegos.join(', ')}
- Alignment: ${userData.alignment}
- Nivel de presencia online: ${nivelOnlineText} (${userData.nivelOnline}/5)

**LAS 8 VOCES A PERSONALIZAR:**

${arquetipos.map((arq, i) => `${i + 1}. **${arq.nombre}**
   Arquetipo: ${arq.descripcion}`).join('\n\n')}

**INSTRUCCIONES:**

Para CADA voz, genera:

1. **Nombre del personaje**: Un nombre creativo basado en las referencias culturales del usuario (películas, juegos, música). Puede ser en español o inglés, pero debe resonar con su perfil. Ejemplos: "The Architect" (Inception), "Snack Goblin" (internet culture), "Totoro's Whisper" (Ghibli).

2. **Forma de hablar**:
   - Vocabulario característico (2-3 palabras o frases que usa frecuentemente)
   - Tipo de referencias que haría (de sus películas/juegos/música favoritos)
   - Nivel de formalidad (basado en generación y personalidad MBTI)
   - Uso de slang/modismos (especialmente si es muy online)

3. **Catchphrases**: 2 frases típicas que esta voz diría

4. **Ejemplo de mensaje**: Un mensaje corto (1-2 líneas) que esta voz le diría al usuario en una situación típica

**IMPORTANTE:**
- Las voces deben hablar principalmente en español latino neutro, pero pueden usar modismos en inglés típicos de Gen Z y cultura de internet
- Las referencias deben ser específicas a las películas/juegos mencionados
- El tono debe reflejar el MBTI (${userData.mbti})
- Considera el nivel de presencia online: ${nivelOnlineText}
- El alignment ${userData.alignment} debe influir en cómo cada voz juzga situaciones

**FORMATO DE RESPUESTA:**

Responde SOLO con un JSON válido con esta estructura (sin markdown, sin comentarios):

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

    // Llamar a Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

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
