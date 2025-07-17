# 🚀 GUÍA PASO A PASO: DEPLOYMENT SERVIPRO ENTERPRISE

## 📋 CHECKLIST PRE-DEPLOYMENT

- [ ] Node.js 16+ instalado
- [ ] Git instalado
- [ ] Cuenta GitHub activa
- [ ] Cuenta Vercel registrada
- [ ] GitHub CLI instalado (recomendado)
- [ ] Vercel CLI instalado (recomendado)

## 🎯 OPCIÓN 1: DEPLOYMENT AUTOMÁTICO (RECOMENDADO)

### Paso 1: Instalar GitHub CLI
```bash
# Windows
winget install GitHub.cli

# macOS
brew install gh

# Linux (Ubuntu/Debian)
sudo apt install gh
```

### Paso 2: Instalar Vercel CLI
```bash
npm install -g vercel
```

### Paso 3: Autenticación
```bash
# GitHub
gh auth login

# Vercel
vercel login
```

### Paso 4: Navegar al proyecto
```bash
cd C:\Users\v8\Documents\servipro-enterprise
```

### Paso 5: Deploy completo automático
```bash
# Inicializar Git
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "🚀 Initial commit: ServiPro Enterprise"

# Crear repo en GitHub y subir
gh repo create servipro-enterprise --public --source=. --remote=origin --push

# Deploy en Vercel
vercel

# Seguir prompts:
# - Set up and deploy? Y
# - Which scope? (tu cuenta)
# - Link to existing project? N
# - Project name? servipro-enterprise
# - Directory? ./
# - Override settings? N
```

### Resultado:
- ✅ **GitHub Repo**: https://github.com/TU_USUARIO/servipro-enterprise
- ✅ **Live Site**: https://servipro-enterprise-xxx.vercel.app
- ✅ **Auto-deploy**: Configurado en cada push

---

## 🎯 OPCIÓN 2: DEPLOYMENT MANUAL

### Paso 1: Crear Repositorio GitHub Manual

1. Ve a [github.com](https://github.com)
2. Click "New repository"
3. Nombre: `servipro-enterprise`
4. Descripción: `ServiPro Enterprise - Plataforma de Servicios Profesionales con IA`
5. **Público**
6. **NO** inicializar con README
7. Click "Create repository"

### Paso 2: Conectar Local con GitHub
```bash
cd C:\Users\v8\Documents\servipro-enterprise

git init
git add .
git commit -m "🚀 Initial commit: ServiPro Enterprise"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/servipro-enterprise.git
git push -u origin main
```

### Paso 3: Deploy en Vercel Manual

1. Ve a [vercel.com](https://vercel.com)
2. Click "New Project"
3. Click "Import Git Repository"
4. Busca y selecciona `servipro-enterprise`
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

---

## 📊 VERIFICACIÓN POST-DEPLOYMENT

### 1. Verificar GitHub
```bash
# Ver estado del repo
git remote -v
git status

# Ver en GitHub
# https://github.com/TU_USUARIO/servipro-enterprise
```

### 2. Verificar Vercel
- Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Ver proyecto: `servipro-enterprise`
- Estado: "Ready"
- URL live generada

### 3. Verificar Funcionalidad
- [ ] Página carga correctamente
- [ ] Responsive design funciona
- [ ] Formularios interactivos
- [ ] Animaciones smooth
- [ ] Performance >90 (Lighthouse)

---

## 🔄 ACTUALIZACIONES FUTURAS

### Workflow de desarrollo:
```bash
# 1. Hacer cambios en el código
# 2. Probar localmente
npm run dev

# 3. Build de prueba
npm run build
npm run preview

# 4. Commit y push
git add .
git commit -m "✨ Descripción del cambio"
git push origin main

# 5. Vercel hace auto-deploy automáticamente
```

---

## 🛠️ COMANDOS ÚTILES

### Git
```bash
git status              # Ver cambios
git add .               # Agregar todos los archivos
git commit -m "mensaje" # Commit con mensaje
git push                # Subir cambios
git pull                # Bajar cambios
git log --oneline       # Ver historial
```

### Vercel
```bash
vercel                  # Deploy rápido
vercel --prod           # Deploy a producción
vercel logs             # Ver logs del deployment
vercel domains          # Gestionar dominios custom
vercel env              # Gestionar variables de entorno
vercel inspect          # Inspeccionar deployment
```

### Desarrollo
```bash
npm run dev             # Servidor desarrollo (puerto 3000)
npm run build           # Build para producción
npm run preview         # Preview del build
npm install             # Instalar dependencias
npm update              # Actualizar dependencias
```

---

## 🎨 PERSONALIZACIÓN POST-DEPLOYMENT

### 1. Custom Domain
```bash
# En Vercel CLI
vercel domains add midominio.com

# O en Dashboard Vercel:
# Project Settings → Domains → Add Domain
```

### 2. Environment Variables
```bash
# Agregar variables de entorno
vercel env add VARIABLE_NAME

# O en Dashboard:
# Project Settings → Environment Variables
```

### 3. Analytics
- Vercel Analytics: Auto-incluido
- Google Analytics: Agregar script en index.html
- Hotjar/Mixpanel: Integración manual

---

## 🚨 TROUBLESHOOTING

### Error: "Build failed"
```bash
# Verificar dependencias
npm install

# Limpiar cache
npm run build --clean
rm -rf node_modules package-lock.json
npm install
```

### Error: "Permission denied"
```bash
# GitHub authentication
gh auth login
git config --global user.email "tu-email@example.com"
git config --global user.name "Tu Nombre"
```

### Error: "Vercel deployment failed"
```bash
# Ver logs detallados
vercel logs

# Re-deploy
vercel --force
```

---

## 📞 SOPORTE

### GitHub Issues
- **Repo Issues**: Para bugs del código
- **GitHub Support**: Para problemas de GitHub

### Vercel Support
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel](https://github.com/vercel/vercel)
- **Support**: Dashboard → Help

### Stack Overflow
- Tags: `react`, `vite`, `vercel`, `tailwindcss`
- Comunidad activa para debugging

---

## 🎉 ¡DEPLOYMENT EXITOSO!

Si seguiste esta guía, ahora tienes:

✅ **Código fuente** en GitHub  
✅ **Sitio web live** en Vercel  
✅ **Auto-deployment** configurado  
✅ **Performance optimizado**  
✅ **SEO ready**  
✅ **Responsive design**  
✅ **HTTPS secure**  

**¡Tu plataforma ServiPro Enterprise está oficialmente LIVE! 🚀**

---

**URLs Finales:**
- **GitHub**: https://github.com/TU_USUARIO/servipro-enterprise
- **Live Site**: https://servipro-enterprise-xxx.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard

¡Comparte tu nueva plataforma con el mundo! 🌍
