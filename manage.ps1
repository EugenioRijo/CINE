#!/usr/bin/env pwsh

# Configurar codificación UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Menu {
    Clear-Host
    Write-Host @"
Sistema de Gestion del Proyecto
=============================================

1. Verificar Entorno Virtual
2. Ejecutar Diagnostico Completo
3. Instalar Dependencias
4. Iniciar Servidores
5. Salir

=============================================
"@ -ForegroundColor Cyan

    $option = Read-Host "Por favor, seleccione una opcion (1-5)"
    return $option
}

# Función para verificar si Python está en el entorno virtual
function Test-VirtualEnv {
    $pythonPath = (Get-Command python -ErrorAction SilentlyContinue).Source
    if ($pythonPath -and $pythonPath.Contains(".venv")) {
        return $true
    }
    return $false
}

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

# Función Check-Venv (Opción 1)
function Check-Venv {
    Write-Host "Verificando el entorno virtual..." -ForegroundColor Cyan

    if (-not (Test-Path ".venv")) {
        Write-Host "No se encontro el entorno virtual. Creando uno nuevo..." -ForegroundColor Yellow
        python -m venv .venv
        if (-not $?) {
            Write-Host "Error al crear el entorno virtual" -ForegroundColor Red
            return
        }
    }

    Write-Host "Activando el entorno virtual..." -ForegroundColor Yellow
    try {
        . .\.venv\Scripts\Activate.ps1
    }
    catch {
        Write-Host "Error al activar el entorno virtual" -ForegroundColor Red
        return
    }

    Write-Host "Actualizando pip..." -ForegroundColor Yellow
    python -m pip install --upgrade pip

    $pythonVersion = python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"
    $minVersion = "3.7"
    $recVersion = "3.11"

    if ([version]$pythonVersion -lt [version]$minVersion) {
        Write-Host "Error: La version de Python ($pythonVersion) es menor que la minima requerida ($minVersion)" -ForegroundColor Red
        return
    }

    if ([version]$pythonVersion -lt [version]$recVersion) {
        Write-Host "Se recomienda usar Python $recVersion o superior (actual: $pythonVersion)" -ForegroundColor Yellow
    }

    Write-Host "Verificacion completada" -ForegroundColor Green
    Pause
}

# Función Debug-System (Opción 2)
function Debug-System {
    Write-Host "Iniciando diagnostico completo del sistema..." -ForegroundColor Cyan

    # Verificar estructura de directorios
    Write-Host "`nVerificando estructura de directorios..." -ForegroundColor Yellow
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
            $dirErrors += "Falta directorio: $($dir.Path) ($($dir.Type))"
        }
    }

    if ($dirErrors.Count -gt 0) {
        Write-Host "`nSe encontraron errores en la estructura de directorios:" -ForegroundColor Red
        $dirErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    } else {
        Write-Host "Estructura de directorios correcta" -ForegroundColor Green
    }

    # Verificar archivos críticos
    Write-Host "`nVerificando archivos criticos..." -ForegroundColor Yellow
    $requiredFiles = @(
        @{Path="back/server.py"; Type="Backend Server"},
        @{Path="back/requirements.txt"; Type="Backend Requirements"},
        @{Path="front/package.json"; Type="Frontend Package"},
        @{Path="front/tsconfig.json"; Type="Frontend TypeScript Config"}
    )

    $fileErrors = @()
    foreach ($file in $requiredFiles) {
        if (-not (Test-Path $file.Path)) {
            $fileErrors += "Falta archivo: $($file.Path) ($($file.Type))"
        }
    }

    if ($fileErrors.Count -gt 0) {
        Write-Host "`nSe encontraron errores en los archivos criticos:" -ForegroundColor Red
        $fileErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    } else {
        Write-Host "Archivos criticos presentes" -ForegroundColor Green
    }

    # Verificar entorno virtual
    Write-Host "`nVerificando entorno virtual..." -ForegroundColor Yellow
    if (-not (Test-Path ".venv")) {
        Write-Host "No se encuentra el entorno virtual" -ForegroundColor Red
    } else {
        Write-Host "Entorno virtual presente" -ForegroundColor Green
    }

    # Verificar puertos
    Write-Host "`nVerificando puertos..." -ForegroundColor Yellow
    $ports = @(
        @{Port=3000; Service="Frontend"},
        @{Port=5000; Service="Backend"}
    )

    foreach ($portInfo in $ports) {
        if (Test-Port $portInfo.Port) {
            Write-Host "Puerto $($portInfo.Port) ($($portInfo.Service)) esta en uso" -ForegroundColor Yellow
        } else {
            Write-Host "Puerto $($portInfo.Port) ($($portInfo.Service)) esta disponible" -ForegroundColor Green
        }
    }

    Write-Host "`nDiagnostico completado" -ForegroundColor Green
    Pause
}

# Función Install-Dependencies (Opción 3)
function Install-Dependencies {
    Write-Host "Iniciando instalacion de dependencias..." -ForegroundColor Cyan

    $InstallDev = Read-Host "Deseas instalar las dependencias de desarrollo? (S/N)"

    if (!(Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "Error: Python no esta instalado. Por favor, instala Python 3.8 o superior." -ForegroundColor Red
        return
    }

    if (!(Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "Error: Node.js no esta instalado. Por favor, instala Node.js 16 o superior." -ForegroundColor Red
        return
    }

    Write-Host "Configurando entorno virtual de Python..." -ForegroundColor Yellow
    if (!(Test-Path ".venv")) {
        python -m venv .venv
    }

    . .\.venv\Scripts\Activate.ps1

    Write-Host "Actualizando pip..." -ForegroundColor Yellow
    python -m pip install --upgrade pip

    Write-Host "Instalando dependencias de Python..." -ForegroundColor Yellow
    pip install -r back/requirements.txt

    if (!(Test-Path "back/.env")) {
        Write-Host "No se encontro el archivo .env en el backend. Creando uno por defecto..." -ForegroundColor Yellow
        Copy-Item "back/.env.example" "back/.env" -ErrorAction SilentlyContinue
        if (!$?) {
            Write-Host "No se pudo crear el archivo .env. Por favor, configura manualmente el archivo back/.env" -ForegroundColor Yellow
        }
    }

    Write-Host "Instalando dependencias principales de Node.js..." -ForegroundColor Yellow
    npm install --legacy-peer-deps

    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
    try {
        Push-Location front
        Write-Host "Instalando dependencias base..." -ForegroundColor Yellow
        npm install --legacy-peer-deps
        
        Write-Host "Instalando tipos de TypeScript y dependencias adicionales..." -ForegroundColor Yellow
        npm install --save --legacy-peer-deps react-router-dom@6.22.0 @mui/material@5.15.10 @mui/icons-material@5.15.10 @emotion/react@11.11.3 @emotion/styled@11.11.0 next-themes@0.4.6 ajv@8.12.0 ajv-keywords@5.1.0 styled-components@6.1.8 web-vitals@2.1.4
        
        Write-Host "Instalando tipos de desarrollo..." -ForegroundColor Yellow
        npm install --save-dev --legacy-peer-deps typescript@4.9.5 @types/react@18.2.55 @types/react-dom@18.2.19 @types/styled-components@5.1.34 @types/react-router-dom@6.11.0
    }
    catch {
        Write-Host "Error durante la instalación de dependencias del frontend: $_" -ForegroundColor Red
    }
    finally {
        Pop-Location
    }

    Write-Host "Configurando la base de datos..." -ForegroundColor Yellow
    python back/setup_database.py

    Write-Host "Instalacion completada con exito!" -ForegroundColor Green
    
    if ($InstallDev -eq "S" -or $InstallDev -eq "s") {
        Write-Host "`nHerramientas de desarrollo disponibles:" -ForegroundColor Magenta
        Write-Host "- Formatear codigo: black ." -ForegroundColor Magenta
        Write-Host "- Verificar estilo: flake8" -ForegroundColor Magenta
        Write-Host "- Verificar tipos: mypy" -ForegroundColor Magenta
        Write-Host "- Ejecutar tests: pytest" -ForegroundColor Magenta
    }
    
    Pause
}

# Función Start-Servers (Opción 4)
function Start-Servers {
    Write-Host "Iniciando servidores..." -ForegroundColor Cyan

    if (-not (Test-VirtualEnv)) {
        Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
        try {
            . .\.venv\Scripts\Activate.ps1
        }
        catch {
            Write-Host "Error al activar el entorno virtual. Asegurate de que este creado correctamente." -ForegroundColor Red
            Write-Host "Puedes crearlo con: python -m venv .venv" -ForegroundColor Yellow
            return
        }
    }

    if (-not (Test-Path "back\server.py")) {
        Write-Host "No se encuentra el archivo back/server.py" -ForegroundColor Red
        return
    }

    if (-not (Test-Path "front\package.json")) {
        Write-Host "No se encuentra el archivo front/package.json" -ForegroundColor Red
        return
    }

    if (-not (Test-Path "back\.env")) {
        Write-Host "No se encuentra el archivo .env en el backend" -ForegroundColor Yellow
        Write-Host "Copiando .env.example a .env..." -ForegroundColor Yellow
        Copy-Item "back\.env.example" "back\.env" -ErrorAction SilentlyContinue
        if (-not $?) {
            Write-Host "Error al crear el archivo .env" -ForegroundColor Red
            return
        }
    }

    Write-Host "Iniciando el backend..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; . .\.venv\Scripts\Activate.ps1; python back/server.py"

    Start-Sleep -Seconds 2

    Write-Host "Iniciando el frontend..." -ForegroundColor Green
    Set-Location front
    npm start

    Get-Process -Name python | Where-Object {$_.MainWindowTitle -match "python back/server.py"} | Stop-Process
}

# Bucle principal del programa
do {
    $option = Show-Menu
    switch ($option) {
        "1" { Check-Venv }
        "2" { Debug-System }
        "3" { Install-Dependencies }
        "4" { Start-Servers }
        "5" { 
            Write-Host "Hasta luego!" -ForegroundColor Cyan
            exit 
        }
        default { 
            Write-Host "Opcion no valida. Por favor, seleccione una opcion del 1 al 5." -ForegroundColor Red
            Pause
        }
    }
} while ($true) 