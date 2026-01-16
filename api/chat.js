// Vercel Serverless Function
// Genera respuestas de las voces internas en el chat

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage, voices, userData, conversationHistory } = req.body;

    // Validaciones
    if (!userMessage || !voices || !userData) {
      return res.status(400).json({
        error: 'userMessage, voices y userData son requeridos'
      });
    }

    // API key desde environment variables (segura en Vercel)
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key no configurada en el servidor' });
    }

    // Construir system prompt con las voces
    const systemPrompt = `Eres un sistema que simula 8 voces internas de una persona, cada una con su propia personalidad y forma de hablar.

**PERFIL DEL USUARIO:**
- MBTI: ${userData.mbti}
- Signo: ${userData.signo}
- Generación: ${userData.generacion}
- Música: ${userData.musica?.join(', ')}
- Películas: ${userData.peliculas?.join(', ')}
- Videojuegos: ${userData.videojuegos?.join(', ')}
- Alignment: ${userData.alignment}
- Nivel online: ${userData.nivelOnline}/5

**LAS 8 VOCES:**

${voices.map(v => `
**${v.name} (${v.shortName})**
- Arquetipo: ${v.id}
- Vocabulario: ${v.personality?.forma_de_hablar?.vocabulario?.join(', ') || 'N/A'}
- Referencias: ${v.personality?.forma_de_hablar?.referencias || 'N/A'}
- Formalidad: ${v.personality?.forma_de_hablar?.formalidad || 'N/A'}
- Catchphrases: ${v.personality?.catchphrases?.join(' | ') || 'N/A'}
`).join('\n')}

**INSTRUCCIONES:**

1. El usuario escribió: "${userMessage}"

2. Responde desde la perspectiva de 3-5 voces (NO siempre las 8, solo las más relevantes para este mensaje específico)

3. Cada voz debe:
   - Mantener su personalidad y forma de hablar única
   - Usar vocabulario y referencias características
   - Responder de forma natural y conversacional
   - Puede @mencionar a otras voces por su nombre (${voices.map(v => v.shortName).join(', ')})
   - Puede estar en desacuerdo o debatir con otras voces

4. Las voces hablan en español latino neutro con modismos en inglés cuando es natural

5. Responde en este formato JSON (sin markdown, sin comentarios):

{
  "responses": [
    {
      "voice_id": "logica",
      "text": "mensaje de la voz aquí"
    },
    {
      "voice_id": "ansiedad",
      "text": "otro mensaje aquí, puede incluir @menciones a otras voces"
    }
  ]
}

**IMPORTANTE:**
- Los voice_id deben corresponder exactamente a: ${voices.map(v => v.id).join(', ')}
- No inventes voice_ids que no existan
- 3-5 voces máximo por respuesta
- Mantén los mensajes cortos (1-3 líneas cada uno)`;

    // Construir historial de conversación (opcional, para contexto)
    const messages = [
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Si hay historial previo, agregarlo como contexto
    // (limitado a últimos 10 mensajes para no gastar muchos tokens)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      const historyContext = recentHistory
        .filter(msg => msg.voice !== 'system')
        .map(msg => {
          if (msg.voice === 'user') {
            return `Usuario: ${msg.text}`;
          } else {
            return `${msg.voice.shortName}: ${msg.text}`;
          }
        })
        .join('\n');

      messages[0].content = `CONTEXTO DE CONVERSACIÓN RECIENTE:\n${historyContext}\n\nNUEVO MENSAJE DEL USUARIO: "${userMessage}"`;
    }

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
        max_tokens: 2000,
        system: systemPrompt,
        messages: messages
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
      console.error('No JSON found in response:', content);
      return res.status(500).json({
        error: 'No se pudo parsear la respuesta JSON de Claude',
        rawResponse: content.substring(0, 200)
      });
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Validar que las respuestas tengan el formato correcto
    if (!parsedData.responses || !Array.isArray(parsedData.responses)) {
      return res.status(500).json({ error: 'Formato de respuesta inválido' });
    }

    // Retornar las respuestas
    return res.status(200).json({
      success: true,
      responses: parsedData.responses
    });

  } catch (error) {
    console.error('Error en chat:', error);
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
}
