# 🔧 Configuración de Environment Variables en Vercel

Guía para configurar correctamente las variables de entorno en Vercel para diferentes ambientes.

---

## 📊 Variables por Ambiente

### 🔐 Backend (Serverless Functions)

**`ANTHROPIC_API_KEY`** - Tu API key de Claude
- **Tipo:** Secret (sensible)
- **Production:** ✅ Requerida
- **Preview:** ✅ Requerida
- **Development:** ✅ Requerida
- **Valor:** `sk-ant-api03-...`

---

### 🐛 Frontend (Debug Mode)

**`VITE_ENABLE_DEBUG`** - Habilita modo debug
- **Tipo:** Plain text (no sensible)
- **Production:** ❌ NO configurar (o `false`)
- **Preview:** ✅ `true`
- **Development:** ✅ `true`

**Qué hace:**
- Muestra botón "🐛 Debug Mode" en pantalla inicial
- Permite saltar directo al chat con perfil pre-generado
- NO consume créditos de API
- Solo para testing rápido

---

## 🚀 Cómo Configurar en Vercel

### Paso 1: Ir a Settings

1. Abre tu proyecto en Vercel Dashboard
2. Ve a **Settings** → **Environment Variables**

---

### Paso 2: Agregar `ANTHROPIC_API_KEY`

1. Click **Add New**
2. **Name:** `ANTHROPIC_API_KEY`
3. **Value:** Tu API key de Anthropic (ejemplo: `sk-ant-api03-...`)
4. **Environments:** Selecciona los 3 checkboxes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

---

### Paso 3: Agregar `VITE_ENABLE_DEBUG`

1. Click **Add New**
2. **Name:** `VITE_ENABLE_DEBUG`
3. **Value:** `true`
4. **Environments:** Selecciona SOLO:
   - ❌ Production (NO marcar)
   - ✅ Preview (SÍ marcar)
   - ✅ Development (SÍ marcar)
5. Click **Save**

---

## ✅ Resultado Final

Tu configuración debe verse así:

```
Variable Name          | Production | Preview | Development
-----------------------|------------|---------|-------------
ANTHROPIC_API_KEY      |     ✅     |   ✅    |     ✅
VITE_ENABLE_DEBUG      |     ❌     |   ✅    |     ✅
```

---

## 🎯 Ambientes en Vercel

### Production (main branch)
- **URL:** `mindchat-project.vercel.app` (o tu dominio custom)
- **Branch:** `main`
- **Debug Mode:** ❌ Deshabilitado
- **API Key:** ✅ Activa

### Preview (develop branch o PR)
- **URL:** `mindchat-project-git-develop-usuario.vercel.app`
- **Branch:** `develop` o cualquier PR
- **Debug Mode:** ✅ Habilitado
- **API Key:** ✅ Activa

### Development (localhost)
- **URL:** `localhost:3000` (o con `vercel dev`)
- **Debug Mode:** ✅ Siempre habilitado automáticamente
- **API Key:** Desde `.env.local`

---

## 🧪 Testing

### Test en Preview (develop):
1. Push a branch `develop`
2. Vercel crea deploy automático
3. Abre la URL de preview
4. Deberías ver el botón "🐛 Debug Mode"
5. Click para saltar directo al chat

### Test en Production (main):
1. Push a branch `main`
2. Vercel deploya a producción
3. Abre la URL de producción
4. **NO deberías ver** el botón debug
5. Solo flujo normal de onboarding

---

## 🔒 Seguridad

- ✅ `ANTHROPIC_API_KEY` nunca se expone al cliente (solo en serverless functions)
- ✅ `VITE_ENABLE_DEBUG` es pública (solo controla UI, no seguridad)
- ✅ Modo debug solo carga perfil pre-generado (no hace llamadas a API)
- ✅ No hay riesgo de seguridad en habilitar debug en preview

---

## 🐛 Troubleshooting

### "No veo el botón debug en preview"

Verifica:
1. La variable `VITE_ENABLE_DEBUG` está configurada como `true` en Preview
2. Hiciste un nuevo deploy después de configurar la variable
3. Refresca el navegador con Ctrl+F5 (hard refresh)

### "El botón debug aparece en producción"

Verifica:
1. La variable `VITE_ENABLE_DEBUG` NO está configurada en Production
2. Si está, bórrala o cambia a `false`
3. Haz redeploy de producción

### "Error al usar debug mode"

Verifica:
1. El archivo `src/debugProfile.js` existe
2. No hay errores de sintaxis en ese archivo
3. Revisa console del navegador (F12) para ver errores

---

## 📝 Comandos Útiles

```bash
# Ver variables de entorno en Vercel CLI
vercel env ls

# Agregar variable solo para preview
vercel env add VITE_ENABLE_DEBUG preview

# Eliminar variable
vercel env rm VITE_ENABLE_DEBUG production
```

---

**Última actualización:** Enero 16, 2026
