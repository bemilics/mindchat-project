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

## Sesión 3 - [Fecha]

[Por completar en próxima sesión]

---

**Última actualización:** Enero 17, 2026 - Sesión 2
