# Función para verificar si Python está en el entorno virtual
function Test-VirtualEnv {
    $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
    if ($pythonPath -and $pythonPath.Contains(".venv")) {
        return $true
    }
    return $false
}

# Función para verificar si un puerto está en uso
function Test-Port {
    param($port)
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect("localhost", $port)
        $tcp.Close()
        return $true
    }
    catch {
        return $false
    }
}

Write-Host "🚀 Iniciando servidores..." -ForegroundColor Cyan

# Matar procesos existentes
Write-Host "🔄 Limpiando procesos anteriores..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "python" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

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

# Verificar node_modules
if (-not (Test-Path "front\node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    Push-Location front
    npm install --legacy-peer-deps
    if (-not $?) {
        Write-Host "❌ Error al instalar dependencias del frontend" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

# Iniciar el backend en una nueva ventana
Write-Host "🔧 Iniciando el backend..." -ForegroundColor Green
$backendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; . .\.venv\Scripts\Activate.ps1; python back/server.py" -PassThru

# Esperar a que el backend esté listo
Write-Host "⏳ Esperando a que el backend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar el frontend en una nueva ventana
Write-Host "🎨 Iniciando el frontend..." -ForegroundColor Green
$env:BROWSER = "none" # Evitar que se abra el navegador automáticamente
Push-Location front

# Iniciar el frontend con npm en una nueva ventana
$frontendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -PassThru -WindowStyle Normal

Pop-Location

# Esperar a que los servidores estén listos
$maxAttempts = 30
$attempts = 0
$allStarted = $false

Write-Host "⏳ Esperando a que los servidores estén listos..." -ForegroundColor Yellow
while ($attempts -lt $maxAttempts -and -not $allStarted) {
    $backend = Test-Port 5000
    $frontend = Test-Port 3000
    
    if ($backend -and $frontend) {
        $allStarted = $true
        Write-Host "✅ ¡Todos los servidores están listos!" -ForegroundColor Green
        Write-Host "   Backend: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
    }
    else {
        Start-Sleep -Seconds 1
        $attempts++
        Write-Host "⏳ Esperando... Intento $attempts de $maxAttempts" -ForegroundColor Yellow
    }
}

if (-not $allStarted) {
    Write-Host "❌ Error: No se pudieron iniciar todos los servidores" -ForegroundColor Red
    if ($backendWindow) { Stop-Process -Id $backendWindow.Id -Force }
    if ($frontendWindow) { Stop-Process -Id $frontendWindow.Id -Force }
    exit 1
}

Write-Host "`n💡 Para detener los servidores, cierra las ventanas de PowerShell o presiona Ctrl+C en cada una." -ForegroundColor Yellow 