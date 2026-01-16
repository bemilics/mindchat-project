# 🐧 Setup Rápido en Linux Mint

Guía paso a paso para montar MindChat en tu ThinkPad con Linux Mint.

---

## 📦 1. Verificar Node.js

```bash
node --version
npm --version
```

Si no los tienes o la versión es menor a 18:

```bash
# Instalar Node.js v20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

---

## 📂 2. Preparar el Proyecto

### Si tienes el proyecto en un zip/folder:

```bash
cd ~/Descargas  # o donde esté el proyecto
cd mindchat-project

# Instalar dependencias
npm install
```

### Si vas a clonar desde GitHub:

```bash
cd ~/Proyectos  # o donde quieras guardar el proyecto
git clone https://github.com/tu-usuario/mindchat.git
cd mindchat
npm install
```

---

## 🔑 3. Configurar API Key

```bash
# Copiar template de variables de entorno
cp .env.example .env

# Editar con tu editor favorito
nano .env
# o
code .env  # si tienes VS Code
```

Pega tu API key de Anthropic:

```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-tu-key-aqui
```

Guarda y cierra (Ctrl+X, Y, Enter en nano).

---

## 🚀 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre tu navegador (Brave) en `http://localhost:3000`

Para parar el servidor: `Ctrl + C` en la terminal

---

## 🌐 5. Deploy a Vercel

### Primera vez - Instalar CLI:

```bash
npm install -g vercel
```

### Login y deploy:

```bash
# Login (abre el navegador)
vercel login

# Deploy
vercel

# Configurar la API key en Vercel
vercel env add VITE_ANTHROPIC_API_KEY

# Paste tu API key cuando te lo pida
# Selecciona: Production, Preview, Development (todas)

# Deploy a producción
vercel --prod
```

---

## 🔧 6. Trabajar con Git y GitHub Desktop (si aplica)

Ya que usas GitHub Desktop en Linux:

1. Abre GitHub Desktop
2. File → Add Local Repository
3. Selecciona la carpeta `mindchat-project`
4. Haz commits de tus cambios
5. Push a GitHub

Si prefieres terminal:

```bash
git status
git add .
git commit -m "Initial commit"
git push
```

---

## 💻 7. Trabajar con VS Code

```bash
# Abrir el proyecto en VS Code
code ~/ruta/al/mindchat-project
```

Extensiones recomendadas (ya las debes tener):
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier

---

## 🐛 Solución Rápida de Problemas

### Error: "EACCES: permission denied"

```bash
sudo chown -R $USER ~/.npm
sudo chown -R $USER ~/ruta/al/mindchat-project
```

### Error: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ocupado

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# O cambiar puerto en vite.config.js:
# server: { port: 3001 }
```

### Cambios en .env no se aplican

```bash
# Para el servidor (Ctrl+C)
# Reinicia el servidor
npm run dev
```

---

## 📝 Comandos Útiles Diarios

```bash
# Desarrollo
npm run dev

# Build (para probar antes de deploy)
npm run build
npm run preview

# Limpiar y reinstalar (si algo se rompe)
rm -rf node_modules package-lock.json dist
npm install

# Ver logs de Vercel
vercel logs

# Pull de cambios desde GitHub
git pull

# Commit rápido
git add .
git commit -m "Descripción del cambio"
git push
```

---

## 🎯 Workflow Recomendado

1. **Mañana:**
   ```bash
   cd ~/mindchat-project
   git pull  # Si trabajas desde varios lugares
   npm run dev
   ```

2. **Mientras desarrollas:**
   - Edita en VS Code
   - La app se recarga automáticamente
   - Revisa en Brave (localhost:3000)

3. **Antes de cerrar:**
   ```bash
   git add .
   git commit -m "Feature: descripción"
   git push
   ```

4. **Deploy a producción:**
   ```bash
   vercel --prod
   ```

---

## 🔗 Links Útiles

- **Anthropic Console:** https://console.anthropic.com/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Tailwind Docs:** https://tailwindcss.com/docs
- **React Docs:** https://react.dev

---

**¡Listo para empezar a codear! 🚀**
