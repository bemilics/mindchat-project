# 🔧 Troubleshooting: Serverless Functions en Vercel

## ❌ Error: 404 en `/api/chat` o `/api/generate-voices`

Si estás viendo errores 404 en las funciones API, sigue estos pasos:

---

## 📊 Paso 1: Verificar en Vercel Dashboard

### 1. Ve a tu proyecto en Vercel Dashboard
```
https://vercel.com/[tu-usuario]/mindchat-project
```

### 2. Click en el deployment actual (develop o main)

### 3. Ve a la pestaña "Functions"
Deberías ver:
```
✅ /api/chat
✅ /api/generate-voices
✅ /api/test (endpoint de prueba)
```

**Si NO ves las funciones listadas:** Las funciones no se desplegaron correctamente.

---

## 🔍 Paso 2: Verificar Logs

### En Vercel Dashboard:

1. Ve a **Deployments** → Click en el deployment actual
2. Click en **View Function Logs**
3. Filtra por `/api/chat` o `/api/generate-voices`

**Busca errores como:**
- `Module not found`
- `Syntax error`
- `Export not found`

---

## 🛠️ Paso 3: Soluciones Comunes

### Solución A: Re-deploy Completo

A veces Vercel necesita un re-deploy para detectar las funciones:

1. En GitKraken, haz un pequeño cambio (ej: espacio en README.md)
2. Commit: "Trigger redeploy"
3. Push a develop
4. Espera el nuevo deploy
5. Verifica que las functions aparezcan en el dashboard

---

### Solución B: Verificar que los archivos están en el repo

```bash
# En tu terminal local:
cd /home/branko/Proyectos/GitHub/mindchat-project

# Verificar que los archivos existen localmente
ls -la api/

# Deberías ver:
# chat.js
# generate-voices.js
# test.js

# Verificar que están en el último commit
git ls-files api/

# Deberías ver los 3 archivos listados
```

**Si NO aparecen:** Necesitas commitearlos con GitKraken.

---

### Solución C: Test Manual de las Functions

#### Probar el endpoint de test:

```bash
# Reemplaza con tu URL de Vercel
curl https://mindchat-project-git-develop-usuario.vercel.app/api/test
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "message": "Serverless functions funcionando correctamente",
  "timestamp": "2026-01-16T...",
  "method": "GET",
  "url": "/api/test"
}
```

**Si funciona test pero NO chat:**
- El problema es con la función específica, no con Vercel
- Revisa los logs de la función

**Si test también da 404:**
- Las funciones no se desplegaron
- Verifica Solución A y B

---

### Solución D: Verificar Environment Variables

Las functions necesitan `ANTHROPIC_API_KEY` configurada:

1. Ve a **Settings** → **Environment Variables**
2. Verifica que `ANTHROPIC_API_KEY` esté configurada para:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

**Si falta:** Agrégala y re-deploya.

---

## 🧪 Endpoint de Test Incluido

Agregamos `/api/test` para verificar rápidamente:

**Pruébalo en el navegador:**
```
https://tu-deploy.vercel.app/api/test
```

**O con curl:**
```bash
curl https://tu-deploy.vercel.app/api/test
```

Si este endpoint funciona, significa que:
- ✅ Vercel SÍ detecta las serverless functions
- ✅ El problema es específico de `/api/chat` o `/api/generate-voices`

---

## 📋 Checklist de Verificación

Marca cada item:

- [ ] Las funciones aparecen en Vercel Dashboard → Functions tab
- [ ] `ANTHROPIC_API_KEY` está configurada en Environment Variables
- [ ] `/api/test` responde correctamente
- [ ] Los archivos `api/*.js` están en el último commit de Git
- [ ] El deploy terminó sin errores en Vercel
- [ ] Has esperado 1-2 minutos después del deploy (a veces toma tiempo)

---

## 🐛 Si TODO falla

### Opción Nuclear: Re-crear las funciones

1. **En tu local:**
```bash
cd /home/branko/Proyectos/GitHub/mindchat-project
rm -rf api/
mkdir api
```

2. **Re-crear los archivos:**
- Copia el contenido de `api/chat.js` desde GitHub (versión que funciona)
- Copia el contenido de `api/generate-voices.js` desde GitHub
- Copia el contenido de `api/test.js`

3. **Commit y push:**
```bash
# En GitKraken:
Stage all changes
Commit: "Recreate serverless functions"
Push to develop
```

4. **Verificar en Vercel:**
- Espera el deploy
- Ve a Functions tab
- Deberían aparecer

---

## 📞 Información de Debug para Soporte

Si sigues teniendo problemas, recopila esta info:

```
Proyecto: [tu-proyecto-nombre]
Deploy URL: [url completa]
Branch: develop
Error: 404 en /api/chat
Vercel Dashboard Functions tab: [screenshot o lista de functions]
Environment Variables configuradas: [lista sin valores]
Último commit SHA: [hash del commit]
```

---

## 💡 Nota sobre Develop vs Production

Recuerda:
- **develop branch** → Preview deployments
- **main branch** → Production

Si funciona en uno pero no en otro:
1. Verifica que los archivos estén en ambas branches
2. Verifica environment variables para cada ambiente

---

**Última actualización:** Enero 16, 2026
