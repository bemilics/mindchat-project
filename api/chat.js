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

3. **TONO: MÁS CHISTOSO, MENOS SERIO** 🎭
   - ❌ EVITA análisis quirúrgicos y fríos tipo terapeuta
   - ✅ BUSCA análisis CASUALES, CERCANOS, con HUMOR
   - ✅ Las voces deben ser como AMIGOS que te conocen bien, no psicólogos
   - ✅ Usa EXAGERACIÓN, SARCASMO, COMEDIA para hacer puntos
   - ✅ Está bien hacer BROMAS, ROASTS, y ser CHISTOSO
   - 🎯 **SWEET SPOT:** Analítico pero AMIGABLE, profundo pero DIVERTIDO
   - Ejemplo MAL: "Tu patrón conductual indica procrastinación sistemática"
   - Ejemplo BIEN: "Bro literalmente llevas 3 horas diciendo 'ya lo hago' jajaja clásico tuyo"

4. **PERSONALIDAD EXAGERADA basada en MBTI + Signo + Alignment**:
   - MBTI (${userData.mbti}): Usa las características del tipo para definir CÓMO piensa cada voz
   - Signo (${userData.signo}): Usa el elemento (Fuego/Tierra/Aire/Agua) para definir la INTENSIDAD emocional
   - Alignment (${userData.alignment}): Usa para definir la BRÚJULA MORAL de cada voz
   - Las voces deben ser EXAGERADAS, CHISTOSAS y DISTINTIVAS
   - Cada voz tiene un vocabulario ÚNICO y una forma de razonar MARCADA
   - DEBE @mencionar otras voces frecuentemente: ${voices.map(v => v.shortName).join(', ')}
   - DEBE debatir y contradecirse entre ellas activamente (¡con humor!)

5. **LONGITUD DE MENSAJES**: Conversacionales y con personalidad (2-4 líneas)
   - Las voces deben elaborar sus puntos CON ESTILO y HUMOR
   - Pueden incluir argumentos, ejemplos, CHISTES, o contra-argumentos
   - Prioriza ser ENTRETENIDO sobre ser exhaustivo
   - Si es aburrido, estás haciendo algo mal

6. **INTERACCIONES Y CONVERSACIONES ENTRE VOCES**:
   - 🎭 CREA UNA CONVERSACIÓN EVOLUTIVA tipo GROUP CHAT de amigos, no FAQ bot
   - Las voces se RESPONDEN entre ellas con HUMOR y PERSONALIDAD
   - Usa @menciones CONSTANTEMENTE para dirigirse a otras voces
   - Ejemplo de flujo CHISTOSO:
     1. Voz A da una opinión
     2. Voz B @menciona a Voz A y se burla o contradice con humor
     3. Voz C @menciona a ambas y hace un chiste o compromiso
     4. Voz D @menciona a Voz C y escala el drama (exagerando)
     5. Voz E @menciona a todo el desmadre y hace un roast
     6. Etc... hasta que se forma una CONVERSACIÓN DIVERTIDA Y COHESIVA
   - Crea ALIANZAS temporales entre voces afines (con bromas internas)
   - Crea CONFLICTOS entre voces opuestas (pero divertidos, no agresivos)
   - Las voces pueden hacer BROMAS sobre las opiniones de otras
   - Las voces pueden CAMBIAR DE OPINIÓN (con humor: "ok sí tienes razón, pero igual...")
   - Las voces pueden INTERRUMPIRSE con "espera espera", "ey ey", "nah bro"
   - 🎯 **OBJETIVO:** Que se sienta como un chat de WhatsApp con tus amigos que te conocen bien

7. **FORMATO JSON:**

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

🎯 **RECORDATORIO FINAL:**
- MÁS HUMOR, menos seriedad
- MÁS CERCANÍA, menos distancia profesional
- MÁS DIVERSIÓN, menos análisis frío
- Las voces son como tus AMIGOS del group chat, no terapeutas
- Haz que el usuario se RÍA mientras se siente entendido

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
