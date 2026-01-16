# 🔒 Setup con Serverless Functions (API Key Segura)

Este proyecto usa **Vercel Serverless Functions** para mantener la API key de Anthropic segura en el backend.

## 🎯 Arquitectura de Seguridad

```
Frontend (React)          Backend (Serverless)         Claude API
    │                            │                          │
    │  POST /api/chat            │                          │
    ├──────────────────────────► │                          │
    │                            │  Headers:                │
    │                            │  x-api-key: [SECRET]     │
    │                            ├─────────────────────────►│
    │                            │                          │
    │                            │◄─────────────────────────┤
    │◄───────────────────────────┤                          │
    │                            │                          │

✅ API key NUNCA expuesta al cliente
✅ Rate limiting server-side posible
✅ Logs y control centralizados
```

---

## 📁 Estructura de Archivos API

```
/api
├── generate-voices.js    # POST: Genera las 8 voces personalizadas
└── chat.js               # POST: Respuestas de las voces en el chat
```

---

## 🛠️ Setup para Desarrollo Local

### Opción 1: Vercel CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login a Vercel
vercel login

# 3. Link el proyecto (primera vez)
vercel link

# 4. Configurar la API key localmente
# Editar .env.local:
nano .env.local

# Agregar:
ANTHROPIC_API_KEY=sk-ant-api03-tu-key-aqui

# 5. Correr el proyecto con serverless functions
vercel dev
```

**Ventajas de `vercel dev`:**
- ✅ Simula el ambiente de producción exacto
- ✅ Serverless functions funcionan como en prod
- ✅ Hot reload
- ✅ Variables de entorno automáticas

### Opción 2: Vite Dev (Solo para frontend)

Si solo quieres testear el frontend sin las funciones:

```bash
npm run dev
```

**Nota:** Las llamadas a `/api/*` fallarán. Útil solo para UI testing.

---

## 🚀 Deploy a Vercel

### Primer Deploy

```bash
# 1. Push tu código a GitHub
git add .
git commit -m "Add serverless functions"
git push

# 2. Conectar repo en Vercel
# Ve a https://vercel.com/new
# Importa tu repo de GitHub

# 3. Configurar Environment Variable
# En Vercel Dashboard:
# Settings → Environment Variables → Add

Name:  ANTHROPIC_API_KEY
Value: sk-ant-api03-tu-key-aqui
Scope: Production, Preview, Development

# 4. Deploy
vercel --prod
```

### Deploys Siguientes

```bash
# Automático con cada push a main
git push

# O manualmente:
vercel --prod
```

---

## 🔌 Endpoints Disponibles

### POST /api/generate-voices

Genera las 8 voces personalizadas basadas en userData.

**Request:**
```json
{
  "userData": {
    "mbti": "ISTJ",
    "signo": "Capricornio",
    "generacion": "Gen Z",
    "musica": ["Reggaeton", "K-Pop", "Electrónica"],
    "peliculas": ["Cloverfield", "Shin Godzilla", "El Exorcista 3"],
    "videojuegos": ["Disco Elysium", "Portal", "Dark Souls 2"],
    "alignment": "Lawful Neutral",
    "nivelOnline": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "voces": [
    {
      "arquetipo": "LÓGICA",
      "nombre_personaje": "The Analyst",
      "forma_de_hablar": {...},
      "catchphrases": [...],
      "ejemplo_mensaje": "..."
    },
    // ... 7 voces más
  ]
}
```

---

### POST /api/chat

Genera respuestas de las voces al mensaje del usuario.

**Request:**
```json
{
  "userMessage": "no sé si mandarle mensaje",
  "voices": [...],  // Array de voces generadas
  "userData": {...},
  "conversationHistory": [...]  // Opcional
}
```

**Response:**
```json
{
  "success": true,
  "responses": [
    {
      "voice_id": "ansiedad",
      "text": "¿Y si ya no le interesas? 😰"
    },
    {
      "voice_id": "logica",
      "text": "@Ansiedad relax, no hay data que sugiera eso."
    }
  ]
}
```

---

## 🧪 Testing Local

### Test con curl:

```bash
# Test generate-voices
curl -X POST http://localhost:3000/api/generate-voices \
  -H "Content-Type: application/json" \
  -d '{"userData": {...}}'

# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userMessage": "hola", "voices": [...], "userData": {...}}'
```

---

## 🔐 Seguridad

### ✅ Lo que SÍ hacer:

- Configurar `ANTHROPIC_API_KEY` en Vercel Environment Variables
- Mantener `.env.local` en tu máquina local solamente
- Nunca commitear archivos `.env*` a Git
- Rotar la API key si se expone accidentalmente

### ❌ Lo que NO hacer:

- ❌ Usar variables `VITE_*` para API keys (se exponen al cliente)
- ❌ Commitear `.env.local` a GitHub
- ❌ Compartir tu API key en público
- ❌ Hardcodear la key en el código

---

## 💰 Optimización de Costos

### Modelos disponibles:

```javascript
// En api/*.js, puedes cambiar el modelo:

// Más barato, más rápido (para mensajes simples):
model: 'claude-haiku-3-5-20241022'

// Balance (actual):
model: 'claude-sonnet-4-20250514'

// Más inteligente (para casos complejos):
model: 'claude-opus-4-20250514'
```

### Consejos para ahorrar:

1. **Limitar `max_tokens`:** Ya configurado en 2000-4000
2. **Caché de system prompts:** Próximamente
3. **Rate limiting:** Implementado client-side (50/día)
4. **Batching:** Agrupar requests cuando sea posible

---

## 🐛 Troubleshooting

### Error: "API key no configurada"

```bash
# Desarrollo local:
# Verifica que .env.local existe y tiene la key
cat .env.local

# Producción:
# Verifica en Vercel Dashboard → Settings → Environment Variables
```

### Error: "fetch failed" o "ECONNREFUSED"

```bash
# Asegúrate de usar vercel dev, no npm run dev
vercel dev
```

### Error: "Module not found" en production

```bash
# Vercel necesita que las dependencias estén en "dependencies", no "devDependencies"
# Revisa package.json
```

---

## 📊 Monitoreo

### Logs en Vercel:

```
Vercel Dashboard → Tu Proyecto → Functions
- Ver invocaciones
- Ver errores
- Ver latencia
- Ver costos
```

### Logs locales:

```bash
# Con vercel dev, los logs aparecen en la terminal
vercel dev
```

---

## 🔄 Actualizar las Functions

```bash
# 1. Edita el código en /api/*.js
# 2. Testea localmente
vercel dev

# 3. Commitea y pushea
git add api/
git commit -m "Update serverless functions"
git push

# 4. Vercel auto-deploya
# O manualmente:
vercel --prod
```

---

## ✅ Checklist de Deploy

- [ ] `.env.local` creado localmente con API key
- [ ] `.env.local` en `.gitignore`
- [ ] `vercel dev` funciona localmente
- [ ] Proyecto conectado a GitHub
- [ ] Repo importado en Vercel
- [ ] `ANTHROPIC_API_KEY` configurada en Vercel
- [ ] Primer deploy exitoso
- [ ] Testear `/api/generate-voices` en prod
- [ ] Testear `/api/chat` en prod

---

**Última actualización:** Enero 16, 2026
**Autor:** Branko
**Vercel Docs:** https://vercel.com/docs/functions
