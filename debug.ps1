Write-Host @"
🔍 Iniciando diagnóstico completo del sistema...

=============================================
           Sistema de Diagnóstico
=============================================
"@ -ForegroundColor Cyan

# Función para verificar puertos
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

# Función para verificar servicios
function Test-Service {
    param($name, $command)
    try {
        Invoke-Expression $command | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Verificar estructura de directorios
Write-Host "`n📁 Verificando estructura de directorios..." -ForegroundColor Yellow
$requiredDirs = @(
    @{Path="back"; Type="Backend"},
    @{Path="front"; Type="Frontend"},
    @{Path="back/routes"; Type="Backend Routes"},
    @{Path="back/models"; Type="Backend Models"},
    @{Path="back/config"; Type="Backend Config"},
    @{Path="front/src"; Type="Frontend Source"},
    @{Path="front/public"; Type="Frontend Public"}
)

$dirErrors = @()
foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir.Path)) {
        $dirErrors += "❌ Falta directorio: $($dir.Path) ($($dir.Type))"
    }
}

if ($dirErrors.Count -gt 0) {
    Write-Host "`n⚠️ Problemas encontrados en la estructura:" -ForegroundColor Red
    $dirErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ Estructura de directorios correcta" -ForegroundColor Green
}

# Verificar archivos críticos
Write-Host "`n📄 Verificando archivos críticos..." -ForegroundColor Yellow
$requiredFiles = @(
    @{Path="back/server.py"; Type="Backend Server"},
    @{Path="back/requirements.txt"; Type="Backend Dependencies"},
    @{Path="front/package.json"; Type="Frontend Dependencies"},
    @{Path="back/.env"; Type="Backend Environment"},
    @{Path="front/src/index.tsx"; Type="Frontend Entry Point"}
)

$fileErrors = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file.Path)) {
        $fileErrors += "❌ Falta archivo: $($file.Path) ($($file.Type))"
    }
}

if ($fileErrors.Count -gt 0) {
    Write-Host "`n⚠️ Archivos faltantes:" -ForegroundColor Red
    $fileErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ Todos los archivos críticos presentes" -ForegroundColor Green
}

# Verificar entorno virtual y Python
Write-Host "`n🐍 Verificando entorno Python..." -ForegroundColor Yellow
$pythonErrors = @()

if (-not (Test-Path ".venv")) {
    $pythonErrors += "❌ Entorno virtual no encontrado"
} else {
    try {
        . .\.venv\Scripts\Activate.ps1
        $pythonVersion = python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"
        if ([version]$pythonVersion -lt [version]"3.7") {
            $pythonErrors += "❌ Versión de Python ($pythonVersion) inferior a 3.7"
        }
    }
    catch {
        $pythonErrors += "❌ Error al activar entorno virtual"
    }
}

if ($pythonErrors.Count -gt 0) {
    Write-Host "`n⚠️ Problemas con Python:" -ForegroundColor Red
    $pythonErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ Configuración de Python correcta" -ForegroundColor Green
}

# Verificar Node.js y npm
Write-Host "`n📦 Verificando Node.js y npm..." -ForegroundColor Yellow
$nodeErrors = @()

try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    if ($nodeVersion -notmatch "v16") {
        $nodeErrors += "⚠️ Versión de Node.js ($nodeVersion) podría no ser compatible"
    }
}
catch {
    $nodeErrors += "❌ Node.js o npm no están instalados"
}

if ($nodeErrors.Count -gt 0) {
    Write-Host "`n⚠️ Problemas con Node.js:" -ForegroundColor Red
    $nodeErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ Configuración de Node.js correcta" -ForegroundColor Green
}

# Verificar puertos
Write-Host "`n🌐 Verificando puertos..." -ForegroundColor Yellow
$portErrors = @()

if (Test-Port 5000) {
    $portErrors += "⚠️ Puerto 5000 (Backend) está en uso"
}
if (Test-Port 3000) {
    $portErrors += "⚠️ Puerto 3000 (Frontend) está en uso"
}

if ($portErrors.Count -gt 0) {
    Write-Host "`n⚠️ Problemas con puertos:" -ForegroundColor Red
    $portErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ Puertos disponibles" -ForegroundColor Green
}

# Verificar base de datos
Write-Host "`n🗄️ Verificando configuración de base de datos..." -ForegroundColor Yellow
$dbErrors = @()

if (Test-Path "back/.env") {
    $envContent = Get-Content "back/.env" -ErrorAction SilentlyContinue
    if (-not ($envContent -match "DATABASE_URL")) {
        $dbErrors += "❌ DATABASE_URL no encontrada en .env"
    }
} else {
    $dbErrors += "❌ Archivo .env no encontrado"
}

if ($dbErrors.Count -gt 0) {
    Write-Host "`n⚠️ Problemas con la base de datos:" -ForegroundColor Red
    $dbErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
} else {
    Write-Host "✅ Configuración de base de datos presente" -ForegroundColor Green
}

# Resumen final
Write-Host "`n📊 Resumen de diagnóstico:" -ForegroundColor Cyan
$totalErrors = $dirErrors.Count + $fileErrors.Count + $pythonErrors.Count + $nodeErrors.Count + $portErrors.Count + $dbErrors.Count

if ($totalErrors -gt 0) {
    Write-Host @"
    
⚠️ Se encontraron $totalErrors problemas:
- Estructura de directorios: $($dirErrors.Count) errores
- Archivos críticos: $($fileErrors.Count) errores
- Entorno Python: $($pythonErrors.Count) errores
- Node.js/npm: $($nodeErrors.Count) errores
- Puertos: $($portErrors.Count) problemas
- Base de datos: $($dbErrors.Count) errores

Para solucionar estos problemas:
1. Revisa la documentación en README.md
2. Ejecuta 'check_venv.ps1' para problemas de Python
3. Usa 'install.ps1' para reinstalar dependencias
4. Verifica los puertos en uso con 'netstat -ano'
"@ -ForegroundColor Yellow
} else {
    Write-Host "`n✅ ¡Todo está correctamente configurado!" -ForegroundColor Green
}

# Ofrecer soluciones
if ($totalErrors -gt 0) {
    $fix = Read-Host "`n¿Deseas intentar solucionar automáticamente los problemas encontrados? (S/N)"
    if ($fix -eq "S" -or $fix -eq "s") {
        Write-Host "`n🔧 Iniciando reparación automática..." -ForegroundColor Yellow
        
        # Crear directorios faltantes
        foreach ($dir in $requiredDirs) {
            if (-not (Test-Path $dir.Path)) {
                New-Item -ItemType Directory -Path $dir.Path -Force
                Write-Host "✅ Creado directorio: $($dir.Path)" -ForegroundColor Green
            }
        }
        
        # Configurar entorno virtual si falta
        if (-not (Test-Path ".venv")) {
            python -m venv .venv
            Write-Host "✅ Creado nuevo entorno virtual" -ForegroundColor Green
        }
        
        # Copiar .env de ejemplo si falta
        if (-not (Test-Path "back/.env") -and (Test-Path "back/.env.example")) {
            Copy-Item "back/.env.example" "back/.env"
            Write-Host "✅ Creado archivo .env desde plantilla" -ForegroundColor Green
        }
        
        Write-Host "`n🔄 Se recomienda ejecutar 'install.ps1' para completar la configuración" -ForegroundColor Yellow
    }
}

Write-Host "`n💡 Para más detalles sobre errores específicos, revisa los logs en:"
Write-Host "- Backend: back/logs/"
Write-Host "- Frontend: front/logs/"
Write-Host "- Base de datos: back/logs/db.log" 