Write-Host "🚀 Iniciando instalación de dependencias..." -ForegroundColor Cyan

# Preguntar si se desean instalar las dependencias de desarrollo
$InstallDev = Read-Host "¿Deseas instalar las dependencias de desarrollo? (S/N)"

# Verificar si Python está instalado
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python no está instalado. Por favor, instala Python 3.8 o superior." -ForegroundColor Red
    exit 1
}

# Verificar si Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado. Por favor, instala Node.js 16 o superior." -ForegroundColor Red
    exit 1
}

# Crear y activar entorno virtual de Python
Write-Host "🐍 Configurando entorno virtual de Python..." -ForegroundColor Yellow
if (!(Test-Path ".venv")) {
    python -m venv .venv
}

# Activar entorno virtual
. .\.venv\Scripts\Activate.ps1

# Actualizar pip
Write-Host "📦 Actualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Instalar dependencias de Python del backend
Write-Host "📦 Instalando dependencias de Python..." -ForegroundColor Yellow
pip install -r back/requirements.txt

# Verificar archivo .env del backend
if (!(Test-Path "back/.env")) {
    Write-Host "⚠️ No se encontró el archivo .env en el backend. Creando uno por defecto..." -ForegroundColor Yellow
    Copy-Item "back/.env.example" "back/.env" -ErrorAction SilentlyContinue
    if (!$?) {
        Write-Host "⚠️ No se pudo crear el archivo .env. Por favor, configura manualmente el archivo back/.env" -ForegroundColor Yellow
    }
}

# Instalar dependencias principales de Node.js
Write-Host "📦 Instalando dependencias principales de Node.js..." -ForegroundColor Yellow
npm install --legacy-peer-deps

# Instalar dependencias del frontend
Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location front
npm install --legacy-peer-deps
# Instalar tipos necesarios para TypeScript
Write-Host "📦 Instalando tipos de TypeScript y dependencias adicionales..." -ForegroundColor Yellow
npm install @types/styled-components@5.1.34 @types/react@18.2.55 @types/react-dom@18.2.19 @mui/material@5.15.10 @mui/icons-material@5.15.10 @emotion/react@11.11.3 @emotion/styled@11.11.0 next-themes@0.4.6 ajv@8.12.0 ajv-keywords@5.1.0 react-router-dom@6.22.0 styled-components@6.1.8 web-vitals@2.1.4 --save --legacy-peer-deps
npm install @types/react-router-dom@5.3.3 --save-dev --legacy-peer-deps
Set-Location ..

# Configurar la base de datos
Write-Host "🗄️ Configurando la base de datos..." -ForegroundColor Yellow
python back/setup_database.py

Write-Host "✅ ¡Instalación completada con éxito!" -ForegroundColor Green
Write-Host "`nPasos siguientes:" -ForegroundColor Cyan
Write-Host "1. Activar el entorno virtual: .\.venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "2. Configurar las variables de entorno en back/.env si no se crearon automáticamente" -ForegroundColor Cyan
Write-Host "3. Iniciar el backend: python back/server.py" -ForegroundColor Cyan
Write-Host "4. Iniciar el frontend: cd front && npm start" -ForegroundColor Cyan

# Si se instalaron las dependencias de desarrollo, mostrar herramientas disponibles
if ($InstallDev -eq "S" -or $InstallDev -eq "s") {
    Write-Host "`nHerramientas de desarrollo disponibles:" -ForegroundColor Magenta
    Write-Host "- Formatear código: black ." -ForegroundColor Magenta
    Write-Host "- Verificar estilo: flake8" -ForegroundColor Magenta
    Write-Host "- Verificar tipos: mypy" -ForegroundColor Magenta
    Write-Host "- Ejecutar tests: pytest" -ForegroundColor Magenta
} 