// Vercel Serverless Function
// Genera respuestas de las voces internas en el chat

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage, voices, userData, conversationHistory, model } = req.body;

    // Validaciones
    if (!userMessage || !voices || !userData) {
      return res.status(400).json({
        error: 'userMessage, voices y userData son requeridos'
      });
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

    // Construir system prompt con las voces
    const systemPrompt = `Eres un sistema que simula 8 voces internas de una persona.

**PERFIL:**
- MBTI: ${userData.mbti}
- Signo: ${userData.signo}
- Generación: ${userData.generacion}
- Alignment: ${userData.alignment}

**VOCES:**

${voices.map(v => `
**${v.name} - ${v.shortName}**
ID: ${v.id}
Vocabulario: ${v.personality?.forma_de_hablar?.vocabulario?.join(', ') || 'N/A'}
Estilo: ${v.personality?.forma_de_hablar?.formalidad || 'N/A'}
`).join('\n')}

**REGLAS CRÍTICAS:**

1. **IDIOMA**: ESPAÑOL latino neutro es el DEFAULT
   - ❌ NO escribas frases completas en inglés
   - ✅ SÍ usa modismos breves: "lowkey", "literally", "vibe", "bro" (SOLO cuando sea natural)
   - Las voces piensan en español, hablan en español

2. **CANTIDAD DE RESPUESTAS**: 6-8 voces deben responder (la mayoría o todas)
   - Genera conversaciones dinámicas donde varias voces participan
   - Está bien que todas las 8 voces opinen si el tema es relevante para todas

3. **PERSONALIDAD**: Cada voz mantiene:
   - Su vocabulario característico
   - Su forma de razonar
   - DEBE @mencionar otras voces frecuentemente: ${voices.map(v => v.shortName).join(', ')}
   - DEBE debatir y contradecirse entre ellas activamente
   - Cada voz puede responder a lo que otra voz dijo

4. **LONGITUD DE MENSAJES**: Más desarrollados y conversacionales (2-4 líneas cada uno)
   - Las voces deben elaborar sus puntos, no solo frases cortísimas
   - Pueden incluir argumentos, ejemplos, o contra-argumentos
   - Está bien que sean más extensas si están debatiendo o construyendo sobre lo que otra voz dijo

5. **INTERACCIONES**: Las voces deben interactuar entre sí
   - Usa @menciones para dirigirse a otras voces
   - Ejemplo: "@Axioma tiene razón pero...", "@Doomscroll estás exagerando de nuevo", "@Covenant ok pero necesito mi dopamina NOW"
   - Crea debates, discusiones y conversaciones entre las voces
   - No todas deben estar de acuerdo, el conflicto es interesante

6. **FORMATO JSON:**

{
  "responses": [
    {
      "voice_id": "logica",
      "text": "mensaje en ESPAÑOL con máximo 2-3 palabras en inglés si es natural"
    }
  ]
}

**VOICE IDS VÁLIDOS:** ${voices.map(v => v.id).join(', ')}

**MENSAJE DEL USUARIO:** "${userMessage}"

Responde AHORA en JSON:`;

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
          system: systemPrompt,
          messages: messages
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
