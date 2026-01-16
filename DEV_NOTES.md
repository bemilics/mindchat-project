# 📋 Notas de Desarrollo - MindChat

## 🎯 Estado Actual

### ✅ Completado

**Onboarding:**
- ✅ Flow completo de 9 pasos
- ✅ Input manual de MBTI, signo, generación
- ✅ Test de 10 preguntas MBTI
- ✅ Inputs de música (3), películas (3), videojuegos (3)
- ✅ Alignment chart interactivo
- ✅ Slider de nivel online
- ✅ Validación de inputs requeridos

**Generación de Voces:**
- ✅ Integración con Claude API (Sonnet 4)
- ✅ Prompt detallado para personalización
- ✅ Mapeo de 8 arquetipos base
- ✅ Display de voces generadas con cards
- ✅ Export de JSON
- ✅ Botón para continuar al chat

**Chat Interface:**
- ✅ UI estilo WhatsApp/Discord
- ✅ 8 voces con colores únicos
- ✅ Pills de voces en header
- ✅ Sistema de mensajes usuario/voces
- ✅ Rate limiting visual (50/50)
- ✅ Typing indicator
- ✅ Auto-scroll
- ✅ @menciones con highlight

**Infraestructura:**
- ✅ React + Vite setup
- ✅ Tailwind configurado
- ✅ Routing entre vistas (App.jsx)
- ✅ Variables de entorno
- ✅ Configs de Vercel
- ✅ README completo
- ✅ Setup guide para Linux

---

## 🚧 Por Implementar

### 1. Chat - Integración Real con Claude API

**Prioridad: ALTA**

Actualmente el chat usa respuestas hardcodeadas. Necesitamos:

```javascript
// En Chat.jsx, función generateVoiceResponses()

const generateVoiceResponses = async (userMessage) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  // Construir system prompt con:
  // 1. Las 8 voces y sus personalidades
  // 2. Instrucción de responder desde cada perspectiva
  // 3. Formato de respuesta (JSON con array de voces)
  
  const systemPrompt = `
  Eres un sistema que simula 8 voces internas de una persona.
  
  VOCES:
  ${voices.map(v => `
  - ${v.name} (${v.shortName}):
    Personalidad: ${JSON.stringify(v.personality)}
  `).join('\n')}
  
  PERFIL DEL USUARIO:
  ${JSON.stringify(userData)}
  
  INSTRUCCIONES:
  - El usuario escribió: "${userMessage}"
  - Responde desde la perspectiva de 3-5 voces (no siempre las 8)
  - Las voces pueden @mencionarse entre ellas
  - Mantén el tono y referencias de cada voz
  - Responde en español latino neutro con modismos en inglés donde aplique
  
  FORMATO:
  Responde SOLO con JSON:
  {
    "responses": [
      {
        "voice_id": "logica",
        "text": "mensaje de la voz"
      }
    ]
  }
  `;
  
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
      messages: [
        { role: 'user', content: userMessage }
      ]
    })
  });
  
  const data = await response.json();
  const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch[0]);
  
  return parsed.responses.map(r => ({
    id: Date.now() + Math.random(),
    voice: voices.find(v => v.id === r.voice_id),
    text: r.text,
    timestamp: new Date()
  }));
};
```

**Testing necesario:**
- Probar con diferentes tipos de mensajes
- Afinar el system prompt para mejores respuestas
- Manejar errores de API
- Implementar retry logic

---

### 2. Persistencia de Datos

**Prioridad: MEDIA**

Opciones:

**Opción A: localStorage (Simple)**
```javascript
// Guardar userData y voces
localStorage.setItem('mindchat_user', JSON.stringify(userData));
localStorage.setItem('mindchat_voices', JSON.stringify(voices));

// Cargar en App.jsx
const savedUser = JSON.parse(localStorage.getItem('mindchat_user'));
const savedVoices = JSON.parse(localStorage.getItem('mindchat_voices'));
```

**Opción B: Vercel Postgres (Mejor)**
- Crear tabla `users` (perfil)
- Crear tabla `voices` (voces generadas)
- Crear tabla `conversations` (historial)
- Implementar autenticación básica

---

### 3. Rate Limiting Real

**Prioridad: MEDIA**

Actualmente es solo client-side. Para producción:

```javascript
// Crear /api/chat.js en Vercel Functions

export default async function handler(req, res) {
  const { userId, message } = req.body;
  
  // Check rate limit en DB
  const usage = await db.getUserUsage(userId);
  if (usage.messagesRemaining <= 0) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  // Llamar a Claude API (server-side)
  // ...
  
  // Decrementar contador
  await db.decrementMessages(userId);
  
  return res.json({ responses });
}
```

---

### 4. Features Adicionales

**Análisis Mensual:**
```javascript
// Endpoint: /api/analysis
// Analiza patrones de conversación
// - Qué voz habló más
// - Temas recurrentes
// - Mood general
```

**Voces Desbloqueables:**
```javascript
// Agregar voces "premium":
// - "Demonio Interior" (shadow self)
// - "Niño Interior" (inner child)
// - "Crítico Externo" (external judge)
```

**Share Cards:**
```javascript
// Generar imágenes para Instagram Stories
// Mostrar insights del mes
// Estilo similar a Roastbeat
```

---

## 🔧 Mejoras Técnicas

### Optimizaciones:

1. **Lazy Loading de Componentes**
```javascript
const Chat = lazy(() => import('./components/Chat'));
```

2. **Memoización de Voces**
```javascript
const voices = useMemo(() => 
  generatedVoices.map(...), 
  [generatedVoices]
);
```

3. **Debounce en Input**
```javascript
const debouncedSend = debounce(handleSendMessage, 500);
```

4. **Error Boundaries**
```javascript
<ErrorBoundary>
  <Chat />
</ErrorBoundary>
```

---

## 📱 Mobile Responsiveness

Actualmente diseñado para desktop. Para mobile:

1. **Onboarding:**
   - ✅ Ya es responsive
   - Mejorar spacing en móviles pequeños

2. **VoiceGenerator:**
   - Cards de voces en grid 1 columna en mobile
   - Botones más grandes

3. **Chat:**
   - ⚠️ Pills de voces scroll horizontal
   - Input fijo necesita ajustes
   - Sidebar de voces como modal en mobile

---

## 🎨 Mejoras de UX

1. **Loading States:**
   - Skeleton screens en generación de voces
   - Shimmer effect mientras cargan

2. **Animaciones:**
   - Transiciones entre vistas
   - Entrada de mensajes con fade-in
   - Voces "typing" con bounce

3. **Feedback Visual:**
   - Toast notifications para errores
   - Confetti cuando completas onboarding
   - Progress bar más visible

4. **Accesibilidad:**
   - Keyboard navigation
   - Screen reader friendly
   - ARIA labels

---

## 🐛 Bugs Conocidos

1. **Scroll en Chat:**
   - A veces no auto-scroll si hay muchos mensajes
   - Solución: Mejorar el useEffect de scroll

2. **Voces Duplicadas:**
   - Si se genera dos veces, puede duplicar
   - Solución: Limpiar estado antes de regenerar

3. **MBTI Test:**
   - No calcula 100% correctamente todos los tipos
   - Solución: Mejorar algoritmo o agregar más preguntas

---

## 📊 Métricas a Trackear

(Para futuro analytics):

1. **Onboarding:**
   - % que completa cada paso
   - Tiempo promedio en completar
   - Paso con más drop-off

2. **Chat:**
   - Mensajes promedio por sesión
   - Voces más activas
   - Temas más comunes

3. **Retention:**
   - DAU (Daily Active Users)
   - Tiempo en app
   - Return rate

---

## 💡 Ideas Futuras

**Integración con Apps:**
- Export a Notion
- Sincronizar con calendario
- Slack bot con tus voces

**Gamificación:**
- Achievements por usar todas las voces
- Streaks de días consecutivos
- Desbloqueables por milestones

**Social:**
- Comparar voces con amigos
- Compatibilidad de voces
- Challenges grupales

**Premium Features:**
- Más de 50 mensajes/día
- Voces customizables adicionales
- Historial ilimitado
- Análisis avanzados

---

## 🎯 Prioridades Inmediatas

1. ✅ Setup del proyecto - **DONE**
2. 🔄 Integrar API real en Chat - **NEXT**
3. 🔄 Persistencia básica (localStorage)
4. 🔄 Testing en producción
5. 🔄 Pulir mobile responsive
6. 🔄 Deploy v1.0

---

## 📝 Notas Técnicas

**Costos Estimados Claude API:**
- Input: ~$3 por 1M tokens
- Output: ~$15 por 1M tokens
- Promedio por mensaje: ~500 tokens input + 1000 tokens output
- Costo por mensaje: ~$0.0195
- 50 mensajes/usuario/día: ~$0.98/usuario/día

**Optimizaciones de costo:**
- Usar Haiku para respuestas simples
- Caché de system prompts
- Limit de mensajes estricto
- Batch processing donde aplique

---

**Última actualización:** Enero 2026
