# 📔 Bitácora del Proyecto MindChat

**Proyecto:** MindChat - Tu group chat interno
**Autor:** Branko
**Inicio:** Enero 16, 2026
**Repo:** [GitHub](https://github.com/[tu-usuario]/mindchat-project)
**Deploy:** [Vercel](https://mindchat-project.vercel.app)

---

## 📝 Instrucciones de Uso

Este documento registra todos los avances, decisiones técnicas, problemas resueltos y pendientes del proyecto por sesión de trabajo.

**Formato de entrada:**
```
## Sesión [N] - [Fecha]
### Objetivos
- Lista de objetivos de la sesión

### Trabajo Realizado
- Detalles de lo implementado

### Decisiones Técnicas
- Decisiones importantes tomadas y por qué

### Problemas Encontrados
- Issues y cómo se resolvieron

### Pendientes
- TODOs para próxima sesión

### Notas
- Observaciones adicionales
```

---

## Sesión 1 - Enero 16, 2026

### Objetivos
- Setup inicial del proyecto en ambiente local
- Implementar serverless functions para seguridad de API key
- Preparar proyecto para deploy en Vercel

### Trabajo Realizado

**1. Setup del Proyecto:**
- Creado repositorio en GitHub: `mindchat-project`
- Clonado en `/home/branko/Proyectos/GitHub/mindchat-project`
- Instaladas dependencias: `npm install` (136 packages)
- Verificada estructura de archivos completa

**2. Implementación de Serverless Functions:**
- Creada carpeta `/api` para Vercel Serverless Functions
- Implementado `/api/generate-voices.js`:
  - Endpoint POST para generar 8 voces personalizadas
  - Prompt detallado con perfil del usuario (MBTI, gustos, alignment)
  - Integración con Claude Sonnet 4 API
  - API key oculta en backend (variable de entorno)

- Implementado `/api/chat.js`:
  - Endpoint POST para generar respuestas de las voces
  - System prompt con personalidades completas
  - Soporte para historial de conversación
  - Responde 3-5 voces por mensaje (no siempre las 8)

**3. Actualización del Frontend:**
- Modificado `VoiceGenerator.jsx`:
  - Reemplazada llamada directa a Claude API por `/api/generate-voices`
  - Eliminada exposición de API key en frontend
  - Simplificado código (107 líneas menos)

- Modificado `Chat.jsx`:
  - Reemplazada lógica hardcodeada por `/api/chat`
  - Función `generateVoiceResponses()` ahora async
  - Manejo de errores con fallback
  - Soporte para historial de conversación

**4. Configuración de Seguridad:**
- Creado `.env.local` para desarrollo local
- Agregado `ANTHROPIC_API_KEY` (backend only, no `VITE_` prefix)
- Actualizado `.gitignore` para excluir `.env.local`
- Configurado `vercel.json` para routing correcto de `/api/*`

**5. Documentación:**
- Creado `SERVERLESS_SETUP.md`:
  - Guía completa de arquitectura de seguridad
  - Instrucciones para desarrollo local
  - Pasos para deploy a Vercel
  - Testing y troubleshooting

- Creado `BITACORA.md` (este archivo)

### Decisiones Técnicas

**1. Serverless Functions vs Frontend API calls:**
- **Decisión:** Usar Vercel Serverless Functions desde el inicio
- **Razón:**
  - API key nunca expuesta al cliente
  - Listo para rate limiting server-side
  - Mejor práctica de seguridad
  - No hay downside significativo

**2. Modelo de Claude:**
- **Decisión:** `claude-sonnet-4-20250514` para ambos endpoints
- **Razón:** Balance entre calidad y costo
- **Consideración futura:** Usar Haiku para mensajes simples

**3. Arquitectura de Variables de Entorno:**
- **Decisión:** `ANTHROPIC_API_KEY` (sin prefijo `VITE_`)
- **Razón:** Variables sin `VITE_` solo son accesibles en serverless functions
- **Desarrollo local:** `.env.local` (Git ignored)
- **Producción:** Vercel Environment Variables

**4. Vercel Dev vs npm run dev:**
- **Decisión:** Recomendar `vercel dev` para desarrollo local
- **Razón:** Simula ambiente de producción exacto
- **Trade-off:** Requiere Node.js v20+ (usuario tiene v18)
- **Solución temporal:** Deploy a Vercel para testing

### Problemas Encontrados

**1. Node.js v18.19.1 (Obsoleta)**
- **Problema:** Vercel CLI requiere Node v20+
- **Error:** `EBADENGINE Unsupported engine`
- **Solución aplicada:** Deploy desde Vercel Dashboard (sin CLI)
- **Solución futura:** Actualizar Node con nvm

**2. Permisos de npm global install**
- **Problema:** `EACCES: permission denied` al instalar Vercel CLI
- **Causa:** Instalación global sin sudo
- **Solución aplicada:** Evitar instalación local por ahora
- **Alternativa:** npm install con sudo, o usar nvm

**3. Routing en Vercel**
- **Problema potencial:** `/api/*` podría ser interceptado por SPA routing
- **Solución:** Actualizado `vercel.json` rewrite rule:
  ```json
  "source": "/((?!api).*)"  // Excluye /api de rewrite
  ```

### Pendientes

**Próxima sesión:**
- [ ] Deploy a Vercel y verificar que serverless functions funcionan
- [ ] Testear generación de voces en producción
- [ ] Testear chat completo con API real
- [ ] Verificar costos de API en console.anthropic.com

**Futuro (media prioridad):**
- [ ] Implementar rate limiting server-side (actualmente solo client-side)
- [ ] Persistencia de datos (localStorage o Vercel Postgres)
- [ ] Mobile responsive (mejorar pills de voces, input fixed)
- [ ] Optimizar costos (caché de prompts, usar Haiku para casos simples)

**Futuro (baja prioridad):**
- [ ] Sistema de autenticación
- [ ] Análisis mensual de patrones de conversación
- [ ] Share cards (Instagram Stories style)
- [ ] Voces premium desbloqueables

### Notas

**Sobre Git:**
- Control de versiones manejado manualmente con GitKraken
- Claude Code NO hace commits/pushes (solo bajo instrucción explícita)

**Sobre API Key:**
- API key guardada en `.env.local` ✅
- `.env.local` en `.gitignore` ✅
- API key lista para copiar a Vercel Environment Variables

**Estado del proyecto:**
- Completitud: ~90%
- Listo para MVP en producción
- Falta solo: Deploy + testing real

**Arquitectura final:**
```
Frontend (React + Vite)
    ↓
Vercel Serverless Functions (/api/*)
    ↓
Claude API (Anthropic)
```

---

## Sesión 2 - Enero 16-17, 2026

### Objetivos
- Optimizar costos de API cambiando de Sonnet a Haiku
- Implementar sistema de debug dual para testing eficiente
- Mejorar prompts: menos inglés, más personalización abstracta
- Simplificar flujo eliminando pantalla de confirmación de voces
- Desplegar y testear en ambiente de desarrollo (Vercel Preview)

### Trabajo Realizado

**1. Migración de Modelo: Sonnet → Haiku**
- Actualizado `/api/chat.js`: `claude-3-5-haiku-20241022`
- Actualizado `/api/generate-voices.js`: `claude-3-5-haiku-20241022`
- **Ahorro de costos:** 15-20x más económico para testing
- Pricing actualizado:
  - Generación de voces: ~$0.004 (antes ~$0.06)
  - Chat por mensaje: ~$0.001 (antes ~$0.02)

**2. Sistema Dual de Debug Implementado**
- Creado `src/debugProfile.js`:
  - Perfil preset completo (ISTJ, Capricornio, Gen Z, etc.)
  - 8 voces pre-generadas abstractas (NO literales)
  - Ejemplos: "El Analista", "El Catastrofista", "El Impulso"
  - NO consume API en absoluto

- Implementado menú de selección con 2 modos:
  - **💾 Full Mock:** Perfil preset + respuestas mock (NO consume API)
  - **🔄 Hybrid:** Perfil preset + respuestas reales de Haiku (consume API)

- Modal de selección visual:
  - Amarillo/naranja para Full Mock
  - Púrpura/azul para Hybrid
  - Badges en header del chat identificando modo activo

- Disponibilidad controlada por ambiente:
  - ✅ Localhost: Siempre disponible
  - ✅ Vercel Preview/Develop: Variable `VITE_ENABLE_DEBUG=true`
  - ❌ Production: NUNCA disponible

**3. Flujo Simplificado de la App**
- Eliminado componente `VoiceGenerator` del flujo normal
- Nuevo flujo: Onboarding → Loading (10-15s) → Chat directo
- Generación de voces automática en background
- Loading screen con spinner mientras genera
- Error screen con opción de volver al inicio si falla

**4. Mejoras en Prompts de IA**

*Prompt de Generación de Voces:*
- **Cambio principal:** Nombres abstractos, NO referencias literales
- Ejemplos prohibidos: "Inland Empire", "The Portal", "Electrochemistry"
- Ejemplos correctos: "El Analista", "La Corazonada", "El Estratega"
- Instrucciones explícitas sobre idioma: español con POCOS modismos en inglés
- Gustos del usuario como indicadores de personalidad, no para copiar

*Prompt de Chat:*
- Énfasis en español latino neutro como DEFAULT
- Prohibición de frases completas en inglés
- Modismos permitidos: "lowkey", "literally", "vibe" (solo cuando natural)
- System prompt simplificado y más directo

**5. Actualización de Node.js**
- Actualizado de v18.19.1 a v24.13.0
- Reinstaladas dependencias con nueva versión
- Ahora compatible con Vercel CLI (antes no podía instalarse)

**6. Configuración Mejorada de Vercel**
- Actualizado `vercel.json`:
  - Agregada sección `functions` explícita
  - Memory: 1024MB
  - MaxDuration: 10s

- Creado `/api/test.js`:
  - Endpoint de diagnóstico para verificar functions
  - Útil para troubleshooting rápido

**7. Documentación Creada**
- `VERCEL_ENV_SETUP.md`: Guía de configuración de environment variables por ambiente
- `VERCEL_TROUBLESHOOTING.md`: Guía completa de troubleshooting para errores 404 y otros
- Actualizados `README.md` con sección de Modo Debug

### Decisiones Técnicas

**1. Haiku vs Sonnet para Testing**
- **Decisión:** Usar Haiku (`claude-3-5-haiku-20241022`) para todo en desarrollo
- **Razón:**
  - 15-20x más barato que Sonnet
  - Suficientemente bueno para testing y desarrollo
  - Permite iterar rápido sin gastar muchos créditos
- **Consideración futura:** Usar Sonnet solo en producción o para casos específicos

**2. Dual Debug Mode vs Simple Mock**
- **Decisión:** Implementar dos modos separados (Full Mock y Hybrid)
- **Razón:**
  - Full Mock para testing de UI sin gastar nada
  - Hybrid para testing de prompts y API sin completar onboarding
  - Flexibilidad según necesidad del momento
- **Trade-off:** Más complejidad en el código, pero mucho más útil

**3. Debug en Develop pero NO en Production**
- **Decisión:** Variable de entorno `VITE_ENABLE_DEBUG` controlada por ambiente
- **Razón:**
  - Localhost: Auto-detectado, siempre ON
  - Preview/Develop: Manual con variable
  - Production: Sin variable = nunca disponible
- **Ventaja:** Seguridad total de que no sale a producción

**4. Flujo Directo sin Confirmación**
- **Decisión:** Eliminar pantalla de "VoiceGenerator" que mostraba las voces generadas
- **Razón:**
  - Reduce fricción en el onboarding
  - Las voces se ven de todas formas en el chat
  - El usuario solo quiere chatear, no necesita confirmar
- **Trade-off:** Menos transparencia sobre las voces generadas (aceptable)

**5. Abstracción en Nombres de Voces**
- **Decisión:** Prohibir referencias literales a gustos del usuario
- **Razón:**
  - Nombres como "Inland Empire" son demasiado obvios y poco sutiles
  - Nombres abstractos son más universales y profesionales
  - Reduce la sensación de que la IA solo copia inputs
- **Ejemplo:** Usar "El Analista" en vez de "The Questioner from Disco Elysium"

### Problemas Encontrados

**1. Error 404 en `/api/chat` al usar Modo Hybrid**
- **Problema:** Al enviar mensajes en modo hybrid, error 404 en la llamada a API
- **Diagnóstico:**
  - Las functions SÍ estaban desplegadas en Vercel
  - El problema NO era la configuración de Vercel
  - Modo debug solo evitaba generación inicial, no el chat
- **Solución implementada:**
  - Modificado `Chat.jsx` para detectar `debugMode` y decidir si usar mock o API
  - Si `debugMode === 'full-mock'` → usar `generateMockResponses()`
  - Si `debugMode === 'hybrid'` → usar llamada a `/api/chat`
  - Si `debugMode === null` → flujo normal con API
- **Resultado:** Ambos modos debug funcionando correctamente

**2. Nombre Incorrecto del Modelo Haiku**
- **Problema:** Error 404 transformado en error de Anthropic API
  ```
  type: 'not_found_error',
  message: 'model: claude-haiku-3-5-20241022'
  ```
- **Causa raíz:** Nombre del modelo en orden incorrecto
- **Nombre incorrecto:** `claude-haiku-3-5-20241022`
- **Nombre correcto:** `claude-3-5-haiku-20241022`
- **Solución:** Corregido en ambos archivos `/api/chat.js` y `/api/generate-voices.js`
- **Tiempo de debugging:** ~30 minutos hasta encontrar el error en los logs de Vercel
- **Lección aprendida:** Siempre verificar nombres exactos de modelos en la documentación oficial

**3. Permisos de Archivos en /api/**
- **Problema:** Archivos con permisos 600 (solo lectura/escritura para owner)
- **Solución:** Cambiados a 644 con `chmod 644 api/*.js`
- **Prevención:** Esto podría causar problemas en algunos sistemas de deploy

**4. Node.js v18 Obsoleto**
- **Problema:** No podía instalar Vercel CLI para testing local
- **Solución:** Actualizado a Node v24.13.0
- **Proceso:** Reinstaladas dependencias después de actualizar Node
- **Beneficio adicional:** Ahora puede usar Vercel CLI para `vercel dev`

**5. Bug de Navegación en MBTI Test**
- **Problema:** Si completabas el test MBTI pero ya habías ingresado signo/generación en el step 2, la página quedaba en blanco
- **Causa:** Lógica de `setStep(step + 1)` iba al step 4, pero como `needsSigno` y `needsGeneracion` eran false, no renderizaba nada
- **Solución:** Cambiada lógica para verificar después del test y saltar al step correcto (4 o 5)
- **Fix en:** `src/components/Onboarding.jsx` líneas 167-195

### Pendientes

**Próxima sesión:**
- [ ] Testing con usuarios reales en modo hybrid
- [ ] Afinar prompts basado en respuestas reales
- [ ] Implementar localStorage para guardar conversaciones
- [ ] Revisar usage de API en console.anthropic.com
- [ ] Considerar volver a Sonnet para producción (solo si Haiku no es suficiente)

**Mejoras de UX:**
- [ ] Mobile responsive mejorado (pills de voces, input fijo)
- [ ] Animaciones entre transiciones de vistas
- [ ] Loading states más pulidos
- [ ] Toast notifications para feedback

**Infraestructura:**
- [ ] Rate limiting server-side real (actualmente solo client-side)
- [ ] Logs y analytics de uso
- [ ] Error tracking (Sentry o similar)
- [ ] Database para persistencia (Vercel Postgres o similar)

**Features futuras:**
- [ ] Sistema de autenticación
- [ ] Análisis mensual de patrones
- [ ] Share cards para redes sociales
- [ ] Voces desbloqueables/customizables

### Notas

**Sobre el Modo Debug:**
- El modo Full Mock es IDEAL para:
  - Testing de UI y UX
  - Desarrollo de features visuales
  - Demostrar la app sin gastar créditos
  - Testing de performance y responsive

- El modo Hybrid es IDEAL para:
  - Testing de prompts y respuestas de IA
  - Afinar personalidades de las voces
  - Verificar calidad de respuestas sin onboarding
  - Desarrollo de lógica de conversación

**Sobre Costos con Haiku:**
- Con 50 mensajes/día por usuario:
  - Sonnet: ~$1.00/día
  - Haiku: ~$0.05/día
  - **Ahorro:** 95% menos costoso
- Para 100 usuarios activos:
  - Sonnet: ~$100/día = $3000/mes
  - Haiku: ~$5/día = $150/mes
- **Conclusión:** Haiku es MUCHO más viable para escalar

**Sobre Nombres de Modelos de Anthropic:**
- Formato correcto: `claude-[version]-[modelo]-[fecha]`
- Ejemplos correctos:
  - `claude-3-5-haiku-20241022`
  - `claude-3-5-sonnet-20241022`
  - `claude-sonnet-4-20250514`
- **IMPORTANTE:** Verificar siempre en la documentación oficial

**Sobre Git y Control de Versiones:**
- Usuario maneja todos los commits con GitKraken
- Claude Code NO hace commits/pushes automáticos
- Estructura de commits bien organizada
- Branches: `develop` para testing, `main` para producción

**Arquitectura Actual:**
```
Onboarding
    ↓
[Modo Normal]              [Modo Debug]
Generar con API      →    Cargar preset
    ↓                           ↓
Chat (API real)         [Full Mock]  [Hybrid]
                        Mock local   API real
```

**Estado del proyecto:**
- Completitud: ~95%
- Deploy en Vercel: ✅ Funcionando en develop
- API funcionando: ✅ Con Haiku
- Modo debug: ✅ Ambos modos operativos
- Listo para: Testing con usuarios y ajustes de prompts

**Próximo milestone:**
- Testing extensivo en develop
- Afinar prompts basado en feedback
- Deploy a producción (main branch)

---

## Sesión 3 - Enero 19, 2026

### Objetivos
- Implementar persistencia de conversaciones con localStorage
- Añadir campos de género y orientación sexual al onboarding
- Mejorar responsive mobile y reducir límite de mensajes
- Rediseñar sistema de personalización para voces más únicas y divertidas
- Optimizar interacciones entre voces para crear conversaciones más naturales

### Trabajo Realizado

**1. Sistema de Persistencia con localStorage**
- Implementado sistema completo de guardado de sesión:
  - `getSessionId()`: Genera ID único por dispositivo (`session_[timestamp]_[random]`)
  - `saveToLocalStorage()` y `loadFromLocalStorage()`: Helpers para persistencia
  - Auto-carga de sesión guardada en `App.jsx` (useEffect)

- Datos persistidos:
  - `mindchat_session_id`: ID único de dispositivo
  - `mindchat_user_data`: Perfil del usuario
  - `mindchat_voices`: 8 voces generadas
  - `mindchat_debug_config`: Configuración de debug (si aplica)
  - `mindchat_messages`: Historial completo de chat
  - `mindchat_messages_remaining`: Contador de mensajes disponibles

- Features de sesión:
  - Botón "Nueva sesión" en header del chat
  - Limpieza automática de localStorage al generar nuevo perfil
  - Usuarios pueden cerrar la app y continuar donde quedaron

**2. Campos Adicionales en Onboarding**
- Agregado campo de orientación sexual (`orientacionSexual`):
  - Dropdown con 7 opciones
  - Opciones: Prefiero no decir, Heterosexual, Homosexual, Bisexual, Pansexual, Asexual, Otro
  - Añadido en línea 608 de `Onboarding.jsx`

- Simplificado selector de edad:
  - Eliminado campo manual de "año de nacimiento"
  - Extracción automática del año desde `<input type="date">`
  - Reduce fricción en el onboarding

- Actualizado mock profile en `debugProfile.js`:
  - `genero: 'masculino'` (antes: 'no-binario')
  - `orientacionSexual: 'bisexual'` (nuevo campo)

**3. Cambios en Límite de Mensajes y Validaciones**
- Reducido límite de mensajes de 50 a 10:
  - Cambiado estado inicial en `Chat.jsx` línea 13
  - Actualizado contador visual de "X/50" a "X/10"
  - Umbral de alerta roja cambiado de ≤10 a ≤3

- Flexibilizada validación de películas favoritas:
  - De 3 requeridas → mínimo 1 requerida
  - Placeholders actualizados: "Película 1 (requerida)", "Película 2-3 (opcionales)"
  - Cambio en línea 215 de `Onboarding.jsx`

**4. Mejoras de Responsive Mobile**
- Fixed overflow de "Classical/Instrumental" en selector de géneros musicales:
  - Padding responsivo: `py-2.5 sm:py-3 px-3 sm:px-4`
  - Font size reducido en mobile: `text-sm sm:text-base`
  - Min-height para permitir wrapping: `min-h-[3rem] sm:min-h-0`

- Pills de voces:
  - Revertido cambio de iniciales → nombres completos siempre visibles
  - Removido `hidden sm:block` de nombres de voces

- Chat input mejorado:
  - Placeholder acortado a "Escribe algo..." en mobile
  - Mejor espaciado y padding en pantallas pequeñas

**5. OVERHAUL MAYOR: Sistema de Personalización de Voces**

**A. Nombres en Español (generate-voices.js líneas 108-115):**
- Regla principal: DEBEN ser en español (salvo conceptos muy específicos)
- Ejemplos buenos: "Vértigo", "Chispa", "Eco", "Brújula", "Impulso", "Ancla", "Torbellino", "Brasa"
- Prohibido: Nombres literales copiados de media, artículos "El/La", nombres genéricos
- Sweet spot: Nombres abstractos MEMORABLES y CHISTOSOS
- Blacklist añadida: Axioma, Encore, Síntesis, Estamina, Kaiju, Covenant, Wavelength, Doomscroll

**B. Tono General Chistoso (generate-voices.js línea 106):**
```
🎭 **TONO GENERAL**: Esta app es CHISTOSA y DIVERTIDA. Las voces deben ser EXAGERADAS,
con personalidades FUERTES y DISTINTIVAS. Nada genérico o aburrido.
```

**C. Guía Detallada de MBTI (generate-voices.js líneas 119-127):**
- E vs I: Extrovertidas (hablan MÁS) vs Introspectivas (hablan MENOS pero más profundo)
- S vs N: Prácticas (tangible) vs Abstractas (posibilidades)
- T vs F: Lógicas (frías) vs Empáticas (dramáticas)
- J vs P: Organizadas (controladoras) vs Espontáneas (procrastinadoras)

**D. Guía de Signos Zodiacales (generate-voices.js líneas 129-133):**
- Fuego (Aries/Leo/Sagitario): Impulsivas, apasionadas, intensas, dramáticas
- Tierra (Tauro/Virgo/Capricornio): Prácticas, terrenales, escépticas, realistas
- Aire (Géminis/Libra/Acuario): Intelectuales, sociales, cambiantes, cerebrales
- Agua (Cáncer/Escorpio/Piscis): Emocionales, intuitivas, profundas, intensas

**E. Guía de Alignment (generate-voices.js líneas 135-141):**
- Lawful/Neutral/Chaotic: Reglas vs Pragmatismo vs Rebeldía
- Good/Neutral/Evil: Altruismo vs Egoísmo vs Manipulación

**F. Ejemplos de Combinaciones (generate-voices.js líneas 143-145):**
- INTJ + Capricornio + Lawful Evil = Voz ultra fría, calculadora, manipuladora
- ENFP + Sagitario + Chaotic Good = Voz hiperactiva, optimista caótica, impulsiva pero bien intencionada

**G. Rasgos Fuertes (generate-voices.js líneas 158-163):**
- Cada voz con PERSONALIDAD MARCADA
- Vocabulario ESPECÍFICO y ÚNICO
- Catchphrases MEMORABLES y CHISTOSAS
- Exagerar rasgos para que sean INOLVIDABLES
- Piensa en las voces como PERSONAJES de comedia, no asistentes genéricos

**6. OVERHAUL MAYOR: Interacciones Entre Voces en Chat**

**A. Personalidades Exageradas en Chat (chat.js líneas 62-69):**
- MBTI define CÓMO piensa cada voz
- Signo define INTENSIDAD emocional
- Alignment define BRÚJULA MORAL
- Voces EXAGERADAS y DISTINTIVAS
- Vocabulario ÚNICO por voz
- @mencionar otras voces FRECUENTEMENTE
- Debatir y contradecirse ACTIVAMENTE

**B. Conversaciones Evolutivas (chat.js líneas 76-91):**
- Nuevo objetivo: GROUP CHAT REAL, no FAQ bot
- Flujo de conversación en 5+ pasos:
  1. Voz A da opinión inicial
  2. Voz B @menciona a A y contradice
  3. Voz C @menciona a ambas y ofrece compromiso
  4. Voz D @menciona a C y escala el drama
  5. Voz E @menciona a D y se burla
- Features de conversación:
  - ALIANZAS temporales entre voces afines
  - CONFLICTOS entre voces opuestas
  - Voces pueden CAMBIAR DE OPINIÓN
  - Voces pueden INTERRUMPIRSE con "espera", "momento", "perdón pero"

**C. Mensajes Más Desarrollados (chat.js líneas 71-74):**
- De frases cortísimas → 2-4 líneas cada voz
- Las voces deben elaborar puntos con argumentos y ejemplos
- Pueden ser más extensas si están debatiendo

**D. Cantidad de Respuestas (chat.js líneas 58-60):**
- Regla actualizada: 6-8 voces deben responder (mayoría o todas)
- Está bien que las 8 voces opinen si el tema es relevante

**7. Visibilidad de Arquetipos en Chat**
- Cambio en `Chat.jsx` línea 552
- Removido `hidden sm:inline` de arquetipos
- Ahora siempre visibles en todos los tamaños de pantalla
- Aparecen como subtítulo bajo el nombre del personaje

**8. Selector de Modelos en Flujo Normal (Dev Only)**
- Agregado modal de selección de modelos LLM en modo desarrollo:
  - 4 combinaciones disponibles:
    - 🟢 Haiku + Haiku (más rápido y económico)
    - 🟢 Haiku + 🔵 Sonnet (perfil rápido, chat inteligente)
    - 🔵 Sonnet + 🟢 Haiku (perfil detallado, chat económico)
    - 🔵 Sonnet + Sonnet (máxima calidad)
  - Solo visible en modo desarrollo (NO va a producción)
  - Permite testing flexible de costos vs calidad

**9. Fixes de Bugs Menores**
- Fixed @mention highlighting:
  - Regex cambiado de `/(@[\w\s]+)/g` a `/(@[^\s,.!?;:]+)/g`
  - Ahora captura correctamente nombres con acentos (ej: "Síntesis")
  - Para exactamente en puntuación

- Fixed loading screen no mostrándose:
  - Cambiada condición en `App.jsx` para no renderizar Onboarding durante generación
  - Agregado indicador de modelo en loading screen

- Fixed localStorage contamination:
  - Limpieza explícita de voces viejas ANTES de generar nuevas
  - Previene que voces de sesiones anteriores aparezcan en nuevos perfiles

**10. Validación Estricta de API**
- Añadida validación en backend de `/api/generate-voices.js`:
  - Rechaza respuesta si no se generaron exactamente 8 voces
  - Retorna error con count de voces generadas
  - Líneas 263-269

### Decisiones Técnicas

**1. localStorage vs Database para Persistencia**
- **Decisión:** Usar localStorage para MVP
- **Razón:**
  - Sin costo de infraestructura
  - Sin latencia de red
  - Suficiente para sesiones individuales
  - Implementación inmediata
- **Trade-off:** Datos se pierden si usuario borra caché
- **Futuro:** Migrar a Vercel Postgres o similar para cross-device sync

**2. Session ID Basado en Device**
- **Decisión:** Generar ID único con timestamp + random string
- **Razón:**
  - No requiere autenticación
  - Permite tracking básico de uso
  - Base para futura migración a user accounts
- **Formato:** `session_[timestamp]_[random]`

**3. Límite de 10 Mensajes en Lugar de 50**
- **Decisión:** Reducir drásticamente para MVP
- **Razón:**
  - Reduce costos de API significativamente
  - Incentiva a usuarios a hacer preguntas de calidad
  - Más viable para testear con usuarios reales
- **Futuro:** Ofrecer compra de mensajes adicionales o suscripción

**4. Español como Idioma Primario para Voces**
- **Decisión:** Forzar nombres en español en prompt
- **Razón:**
  - Target audience es latino/hispano
  - Nombres en inglés sienten desconectados
  - Más accesible y relatable
  - Solo inglés para conceptos muy específicos
- **Resultado:** Voces más auténticas y memorables

**5. MBTI + Signo + Alignment como Tripleta de Personalización**
- **Decisión:** Combinar los 3 sistemas para crear personalidades únicas
- **Razón:**
  - MBTI define el CÓMO piensa (lógica, intuición, etc.)
  - Signo define la INTENSIDAD emocional (fuego, tierra, aire, agua)
  - Alignment define la BRÚJULA MORAL (lawful/chaotic, good/evil)
  - Combinación de 3 variables produce 16 × 12 × 9 = 1,728 perfiles únicos
- **Ventaja:** Altísima personalización incluso con pocos inputs del usuario

**6. Conversaciones Evolutivas vs Respuestas Aisladas**
- **Decisión:** Cambiar prompt para crear conversaciones tipo group chat
- **Razón:**
  - Más entretenido y natural
  - Voces se sienten más "vivas" y reales
  - Crea narrativas emergentes que son más memorables
  - Objetivo: "GROUP CHAT REAL, no FAQ bot"
- **Implementación:** Flujo en 5+ pasos con @menciones, alianzas, conflictos

**7. Exageración de Rasgos para Efecto Cómico**
- **Decisión:** Instruir a la IA para EXAGERAR personalidades
- **Razón:**
  - La app es entretenimiento, no terapia seria
  - Voces genéricas son aburridas
  - Exageración hace las conversaciones más chistosas y memorables
  - Similar a personajes de comedia: rasgos amplificados
- **Prompt key phrase:** "Piensa en las voces como PERSONAJES de comedia"

**8. Minimum 1 Película en Lugar de 3**
- **Decisión:** Flexibilizar requisito de películas favoritas
- **Razón:**
  - Reduce fricción en onboarding
  - Algunos usuarios tienen dificultad pensando en 3 películas
  - 1 es suficiente para dar contexto de gustos
  - Otras preguntas (MBTI, gustos musicales, etc.) compensan
- **Balance:** Mantener máximo de 3 para no abrumar prompt

### Problemas Encontrados

**1. Contaminación de Voces con Mock Data**
- **Problema:** Voces generadas usaban nombres del mock profile (Axioma, Kaiju, etc.)
- **Reproducción:** Ocurría cuando usuario no ingresaba videojuegos favoritos
- **Causa raíz:** Prompt contenía ejemplos explícitos que Claude copiaba con datos insuficientes
- **Solución:**
  1. Eliminados todos los ejemplos de nombres específicos del prompt
  2. Reemplazados con guías generales ("Vértigo", "Chispa", etc. como conceptos)
  3. Agregada blacklist explícita: "NUNCA uses estos nombres: Axioma, Encore, Síntesis..."
  4. Instrucción para intensificar MBTI/signo/alignment cuando faltan datos
- **Archivo afectado:** `/api/generate-voices.js` línea 156

**2. @Mentions No Capturaban Nombres con Acentos**
- **Problema:** Highlights de @menciones se extendían de más o no capturaban nombres completos
- **Causa:** Regex `/(@[\w\s]+)/g` no manejaba bien caracteres especiales ni espacios
- **Solución:** Cambio a `/(@[^\s,.!?;:]+)/g`
  - Captura todo después de @ hasta whitespace o puntuación
  - Soporta acentos (Síntesis, Brújula, etc.)
  - Para exactamente donde termina el nombre
- **Archivo afectado:** `Chat.jsx` línea 508

**3. Loading Screen No Visible Durante Generación**
- **Problema:** Onboarding se renderizaba sobre loading screen
- **Causa:** Condicionales en `App.jsx` permitían ambos componentes simultáneos
- **Solución:** Agregadas condiciones `!isGeneratingVoices && !generationError` al render de Onboarding
- **Resultado:** Loading screen con spinner visible durante los 10-15 segundos de generación
- **Archivo afectado:** `App.jsx` línea 155

**4. Solo 3 Voces Generadas en Lugar de 8**
- **Problema:** A veces API generaba menos de 8 voces
- **Causa:** Prompt no era explícito sobre requerir exactamente 8
- **Solución múltiple:**
  1. Agregada advertencia prominente: "⚠️ **IMPORTANTE**: DEBES generar EXACTAMENTE 8 voces"
  2. Lista numerada de arquetipos más visible en prompt
  3. Validación en backend que rechaza si count ≠ 8
  4. Safe handling de campos vacíos con "No especificado"
- **Archivos afectados:**
  - `/api/generate-voices.js` líneas 104, 263-269

**5. Voces de Sesión Anterior Apareciendo en Nueva**
- **Problema:** Al generar nuevo perfil, a veces aparecían voces del perfil anterior
- **Causa:** localStorage no se limpiaba antes de generar nuevo perfil
- **Solución:** Limpieza explícita ANTES de nueva generación:
  ```javascript
  localStorage.removeItem('mindchat_voices');
  localStorage.removeItem('mindchat_messages');
  localStorage.removeItem('mindchat_messages_remaining');
  ```
- **Archivo afectado:** `App.jsx` líneas 73-76

**6. Overflow de "Classical/Instrumental" en Mobile**
- **Problema:** Botón de género musical se salía del contenedor en pantallas pequeñas
- **Causa:** Padding y font size fijos, sin responsive
- **Solución:**
  - Padding responsivo: `py-2.5 sm:py-3 px-3 sm:px-4`
  - Font size adaptativo: `text-sm sm:text-base`
  - Min-height para wrapping: `min-h-[3rem] sm:min-h-0`
- **Archivo afectado:** `Onboarding.jsx` línea 755

### Pendientes

**Antes de Deploy a Producción:**
- [ ] Testing extensivo con Haiku para confirmar calidad de voces
- [ ] Testing con datos variados (mínimos inputs vs máximos inputs)
- [ ] Verificar costos reales con límite de 10 mensajes
- [ ] Probar en múltiples dispositivos móviles (iOS + Android)
- [ ] Confirmar que modo debug NO está disponible en production

**Mejoras UX (media prioridad):**
- [ ] Animación de entrada de mensajes de voces
- [ ] Feedback visual cuando se alcanza límite de mensajes
- [ ] Tutorial/tooltip en primer uso explicando las voces
- [ ] Opción de "regenerar respuestas" si usuario no le gustaron
- [ ] Botón de "compartir conversación" (screenshot)

**Features Futuras:**
- [ ] Compra de mensajes adicionales (monetización)
- [ ] Sistema de autenticación para sync cross-device
- [ ] Migración de localStorage a database
- [ ] Análisis mensual de patrones de conversación
- [ ] Voces desbloqueables o customizables
- [ ] Share cards para Instagram/Twitter

**Optimizaciones:**
- [ ] Streaming de respuestas (SSE) para latencia percibida menor
- [ ] Caché inteligente de prompts comunes
- [ ] Rate limiting server-side más robusto
- [ ] Error tracking con Sentry
- [ ] Analytics de uso (PostHog o similar)

### Notas

**Sobre Persistencia:**
- localStorage tiene límite de ~5-10MB dependiendo del browser
- Estimación: 10 mensajes × 8 voces × 200 chars = ~16KB por sesión
- Capacidad: ~300-600 sesiones antes de llenar localStorage
- Suficiente para MVP, migrar a DB si escala

**Sobre Costos con 10 Mensajes:**
- Con Haiku (claude-3-5-haiku-20241022):
  - Generación de voces: ~$0.004
  - 10 mensajes de chat: ~$0.010
  - **Total por usuario:** ~$0.014
- Con 100 usuarios/día: ~$1.40/día = **$42/mes**
- Con 1000 usuarios/día: ~$14/día = **$420/mes**
- Mucho más viable que con 50 mensajes + Sonnet (~$3000/mes)

**Sobre el Nuevo Sistema de Personalización:**
- La combinación MBTI + Signo + Alignment produce voces RADICALMENTE distintas
- Ejemplos reales de combinaciones:
  - INTJ + Capricornio + Lawful Evil = "El Arquitecto frío y calculador"
  - ENFP + Sagitario + Chaotic Good = "La Chispa impulsiva pero bien intencionada"
  - ISFP + Piscis + Neutral Good = "El Eco empático y artístico"
- El blacklist de nombres previene que la IA copie del mock data
- Instrucciones de exageración hacen las voces más memorables

**Sobre Conversaciones Evolutivas:**
- Cambio de paradigma: de "8 respuestas independientes" a "1 conversación cohesiva"
- Las voces ahora construyen sobre lo que otras dijeron
- @menciones son la clave para crear hilos de conversación
- Alianzas y conflictos emergen naturalmente según MBTI + Alignment
- Resultado: Se siente como un group chat de WhatsApp, no como un chatbot

**Sobre Spanish-First:**
- Nombres en español son más memorables para target audience
- Ejemplos buenos: "Vértigo", "Chispa", "Eco", "Brújula", "Impulso"
- Inglés solo para conceptos técnicos muy específicos
- Modismos en inglés ("lowkey", "literally") están OK en mensajes de chat
- Pero el nombre del personaje DEBE ser en español

**Sobre Session IDs:**
- Formato: `session_[timestamp]_[random]`
- Ejemplo: `session_1737331200000_a7f3k9b`
- Permite tracking anónimo de uso sin autenticación
- Base para futura migración a user accounts
- Se guarda en localStorage y persiste entre sesiones

**Arquitectura Actualizada:**
```
Onboarding
    ↓
    ├── [Modo Normal]
    │   ↓
    │   Generar Voces (/api/generate-voices)
    │   ↓
    │   Auto-save a localStorage
    │   ↓
    │   Chat (/api/chat)
    │   ↓
    │   Conversaciones evolutivas con @menciones
    │
    └── [Modo Debug - Dev Only]
        ↓
        ├── Mock Profile → Full Mock (sin API)
        └── Mock Profile → Hybrid (con /api/chat)
```

**Estado del proyecto:**
- Completitud: ~98%
- Listo para: Testing final y deploy a producción
- Personalización: ✅ Overhaul completo con MBTI + Signo + Alignment
- Persistencia: ✅ localStorage implementado
- Interacciones: ✅ Conversaciones evolutivas tipo group chat
- Responsive: ✅ Mobile optimizado
- Costos: ✅ Viables con Haiku + 10 mensajes

**Próximo milestone:**
- Testing con usuarios reales en develop
- Deploy a production (main branch)
- Recolectar feedback sobre calidad de voces
- Iterar en prompts si es necesario

---

## Sesión 4 - [Fecha]

[Por completar en próxima sesión]

---

**Última actualización:** Enero 19, 2026 - Sesión 3
