@echo off
echo 🔥 CONFIGURACION AUTOMATICA SERVIPRO + SUPABASE
echo.

echo ✅ Instalando dependencias...
npm install

echo.
echo ✅ Verificando archivos de configuracion...
if exist "src\supabase.js" (
    echo ✓ supabase.js configurado
) else (
    echo ❌ Error: supabase.js no encontrado
    pause
    exit /b 1
)

if exist "setup-supabase.sql" (
    echo ✓ setup-supabase.sql disponible
) else (
    echo ❌ Error: setup-supabase.sql no encontrado
    pause
    exit /b 1
)

echo.
echo 📋 INSTRUCCIONES RESTANTES:
echo.
echo 1. Ve a: https://supabase.com/dashboard/project/gtlyxvdzvgypdfrpeafp
echo 2. SQL Editor ^> New Query
echo 3. Copia y pega el contenido de setup-supabase.sql
echo 4. Click RUN
echo 5. Verifica que aparezca: "Success. No rows returned"
echo.
echo 6. Luego ejecuta:
echo    npm run dev
echo.
echo 7. Prueba el formulario en: http://localhost:3000
echo.
echo 8. Para subir a producción:
echo    git add .
echo    git commit -m "🔥 Supabase integration complete"
echo    git push
echo.

echo 🎯 ¿Quieres abrir Supabase en el navegador? (y/n)
set /p choice="Respuesta: "
if /i "%choice%"=="y" (
    start https://supabase.com/dashboard/project/gtlyxvdzvgypdfrpeafp/sql
)

echo.
echo 🚀 Configuración lista. Sigue las instrucciones de arriba.
pause
