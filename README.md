# 🧠 MindChat

**Tu group chat interno** - Una app que te permite chatear con las voces en tu cabeza, personalizadas según tu personalidad.

---

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **AI:** Claude API (Anthropic)
- **Hosting:** Vercel
- **Version Control:** Git + GitHub

---

## 📋 Requisitos Previos

1. **Node.js** (v18 o superior)
2. **npm** o **yarn**
3. **API Key de Anthropic** - Consigue una en [console.anthropic.com](https://console.anthropic.com/)
4. **Git** instalado
5. **Cuenta de Vercel** (para deploy)

---

## 🛠️ Instalación Local

### 1. Clonar o descargar el proyecto

Si ya tienes el proyecto en tu PC, ve a la carpeta:

```bash
cd mindchat-project
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto (copia de `.env.example`):

```bash
cp .env.example .env
```

Edita el archivo `.env` y agrega tu API key:

```
VITE_ANTHROPIC_API_KEY=tu_api_key_de_anthropic_aqui
```

**⚠️ IMPORTANTE:** Nunca commitees el archivo `.env` a Git. Ya está en `.gitignore`.

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
mindchat-project/
├── src/
│   ├── components/
│   │   ├── Onboarding.jsx       # Flow de onboarding (test + inputs)
│   │   ├── VoiceGenerator.jsx   # Generación de voces con Claude API
│   │   └── Chat.jsx             # Interface del chat
│   ├── App.jsx                  # Router principal
│   ├── main.jsx                 # Entry point
│   └── index.css                # Estilos globales + Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
└── README.md
```

---

## 🎨 Features

### ✅ Implementadas

1. **Onboarding completo:**
   - Input manual de MBTI, signo, generación
   - Test de 10 preguntas para MBTI
   - Selección de música (3 géneros)
   - Películas favoritas (3)
   - Videojuegos favoritos (3)
   - Alignment chart
   - Nivel de "online" (1-5)

2. **Generación de voces:**
   - 8 voces basadas en arquetipos (Disco Elysium style)
   - Personalización con Claude API
   - Nombres y personalidades únicas por usuario
   - Export de JSON con las voces generadas

3. **Chat interface:**
   - Las voces responden al usuario
   - Las voces interactúan entre ellas
   - Sistema de @menciones
   - Rate limiting (50 mensajes/día)
   - Ko-fi integration para unlock

### 🚧 Por implementar

- [ ] Integración real de Claude API para respuestas del chat
- [ ] Sistema de persistencia (guardar conversaciones)
- [ ] Análisis mensual de patrones
- [ ] Voces adicionales desbloqueables
- [ ] Sistema de autenticación
- [ ] Database (Vercel Postgres o similar)

---

## 🔧 Scripts Disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🚀 Deploy a Vercel

### Opción 1: Deploy desde la UI de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "New Project"
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:
   - `VITE_ANTHROPIC_API_KEY`: Tu API key
5. Deploy!

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

**⚠️ No olvides configurar la variable de entorno en Vercel:**
- Settings → Environment Variables → Add
- Name: `VITE_ANTHROPIC_API_KEY`
- Value: Tu API key

---

## 🎯 Uso de la App

### 1. Onboarding
- Ingresa tus datos de personalidad manualmente o completa el test
- Selecciona tus gustos (música, películas, juegos)
- Define tu alignment y nivel de presencia online

### 2. Generación de Voces
- El sistema usa Claude API para crear 8 voces personalizadas
- Cada voz tiene:
  - Nombre único (basado en tus referencias culturales)
  - Forma de hablar característica
  - Catchphrases
  - Personalidad definida
- Puedes exportar las voces como JSON

### 3. Chat
- Empieza a conversar con tus voces
- Ellas responderán desde sus perspectivas
- Las voces también interactúan entre ellas
- Usa @ para mencionar una voz específica

---

## 🔑 Conseguir API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" en el dashboard
4. Crea una nueva API key
5. Copia la key (solo se muestra una vez)
6. Pégala en tu archivo `.env`

**Pricing:** Claude tiene un free tier con créditos iniciales. Revisa [anthropic.com/pricing](https://www.anthropic.com/pricing) para más info.

---

## 🐛 Troubleshooting

### La app no inicia

```bash
# Borrar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error de API key

- Verifica que el archivo `.env` existe
- Verifica que la variable se llama exactamente `VITE_ANTHROPIC_API_KEY`
- Verifica que la API key es válida en console.anthropic.com

### Error de CORS en desarrollo

- Vercel Serverless Functions resuelven esto en producción
- En desarrollo local, las llamadas directas al API pueden tener problemas de CORS
- Considera usar un proxy o serverless functions locales

---

## 📝 Notas de Desarrollo

### Variables de Entorno

Vite expone las variables que empiezan con `VITE_` al cliente:

```javascript
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
```

### Rate Limiting

Actualmente implementado client-side (50 mensajes). Para producción:
- Implementar server-side con Vercel Serverless Functions
- Usar database para trackear uso por usuario
- Implementar sistema de autenticación

### Estilo de Código

- Español latino neutro en UI
- Modismos en inglés estratégicos (Gen Z style)
- Tailwind para todos los estilos
- Componentes funcionales con hooks

---

## 🤝 Contribuir

Este es un proyecto personal, pero si querés contribuir:

1. Fork el repo
2. Crea una branch (`git checkout -b feature/nueva-feature`)
3. Commit tus cambios (`git commit -am 'Agrega nueva feature'`)
4. Push a la branch (`git push origin feature/nueva-feature`)
5. Crea un Pull Request

---

## 📄 Licencia

Proyecto personal - uso libre

---

## 🎨 Créditos

- Diseño inspirado en Disco Elysium
- Iconos: Emojis nativos
- Fonts: System fonts
- AI: Claude (Anthropic)

---

## 📞 Contacto

Si tenés dudas o sugerencias, abre un issue en GitHub.

---

**Hecho con 💜 y Claude AI**
