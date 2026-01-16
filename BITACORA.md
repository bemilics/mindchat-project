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

## Sesión 2 - [Fecha]

[Por completar en próxima sesión]

---

**Última actualización:** Enero 16, 2026 - Sesión 1
