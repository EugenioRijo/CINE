# Función para verificar si Python está en el entorno virtual
function Test-VirtualEnv {
    $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
    if ($pythonPath -and $pythonPath.Contains(".venv")) {
        return $true
    }
    return $false
}

Write-Host "🚀 Iniciando servidores..." -ForegroundColor Cyan

# Verificar si el entorno virtual está activado
if (-not (Test-VirtualEnv)) {
    Write-Host "🐍 Activando entorno virtual..." -ForegroundColor Yellow
    try {
        . .\.venv\Scripts\Activate.ps1
    }
    catch {
        Write-Host "❌ Error al activar el entorno virtual. Asegúrate de que esté creado correctamente." -ForegroundColor Red
        Write-Host "   Puedes crearlo con: python -m venv .venv" -ForegroundColor Yellow
        exit 1
    }
}

# Verificar que los archivos necesarios existen
if (-not (Test-Path "back\server.py")) {
    Write-Host "❌ No se encuentra el archivo back/server.py" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "front\package.json")) {
    Write-Host "❌ No se encuentra el archivo front/package.json" -ForegroundColor Red
    exit 1
}

# Verificar que el archivo .env existe
if (-not (Test-Path "back\.env")) {
    Write-Host "⚠️ No se encuentra el archivo .env en el backend" -ForegroundColor Yellow
    Write-Host "   Copiando .env.example a .env..." -ForegroundColor Yellow
    Copy-Item "back\.env.example" "back\.env" -ErrorAction SilentlyContinue
    if (-not $?) {
        Write-Host "❌ Error al crear el archivo .env" -ForegroundColor Red
        exit 1
    }
}

# Iniciar el backend en una nueva ventana
Write-Host "🔧 Iniciando el backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; . .\.venv\Scripts\Activate.ps1; python back/server.py"

# Esperar un momento para que el backend inicie
Start-Sleep -Seconds 2

# Iniciar el frontend
Write-Host "🎨 Iniciando el frontend..." -ForegroundColor Green
Set-Location front
npm start

# Si el frontend se cierra, cerrar también el backend
Get-Process -Name python | Where-Object {$_.MainWindowTitle -match "python back/server.py"} | Stop-Process 