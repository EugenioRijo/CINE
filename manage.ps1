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
        Write-Host "Limpiando instalaciones previas..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        Remove-Item package-lock.json -ErrorAction SilentlyContinue
        
        Write-Host "Instalando dependencias base..." -ForegroundColor Yellow
        npm install --legacy-peer-deps
        
        Write-Host "Instalando dependencias principales..." -ForegroundColor Yellow
        $dependencies = @(
            "react-router-dom@6.22.0",
            "@mui/material@5.15.10",
            "@mui/icons-material@5.15.10",
            "@emotion/react@11.11.3",
            "@emotion/styled@11.11.0",
            "next-themes@0.4.6",
            "ajv@8.12.0",
            "ajv-keywords@5.1.0",
            "styled-components@6.1.8",
            "web-vitals@2.1.4"
        )
        npm install --save --legacy-peer-deps $dependencies
        
        Write-Host "Instalando dependencias de desarrollo..." -ForegroundColor Yellow
        $devDependencies = @(
            "typescript@4.9.5",
            "@types/react@18.2.55",
            "@types/react-dom@18.2.19",
            "@types/styled-components@5.1.34",
            "@types/react-router-dom@6.22.0"
        )
        npm install --save-dev --legacy-peer-deps $devDependencies
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

    # Obtener la ruta absoluta del directorio actual
    $rootPath = Get-Location

    # Verificar si ya hay servidores corriendo y matarlos
    Write-Host "Verificando procesos existentes..." -ForegroundColor Yellow
    
    # Detener procesos de Node.js (frontend)
    Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Deteniendo proceso Node.js: $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    
    # Detener procesos de Python (backend)
    Get-Process -Name "python" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Deteniendo proceso Python: $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    
    Start-Sleep -Seconds 2

    # Verificar entorno virtual
    if (-not (Test-VirtualEnv)) {
        Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
        if (-not (Test-Path ".venv")) {
            Write-Host "Creando nuevo entorno virtual..." -ForegroundColor Yellow
            python -m venv .venv
            if (-not $?) {
                Write-Host "Error al crear el entorno virtual" -ForegroundColor Red
                return
            }
        }
        try {
            Write-Host "Intentando activar entorno virtual en: $rootPath\.venv\Scripts\Activate.ps1" -ForegroundColor Yellow
            . "$rootPath\.venv\Scripts\Activate.ps1"
        }
        catch {
            Write-Host "Error al activar el entorno virtual: $_" -ForegroundColor Red
            return
        }
    }

    # Verificar dependencias de Python
    Write-Host "Verificando dependencias de Python..." -ForegroundColor Yellow
    if (-not (Test-Path "back\requirements.txt")) {
        Write-Host "No se encuentra el archivo requirements.txt" -ForegroundColor Red
        return
    }
    
    try {
        pip install -r back/requirements.txt
    }
    catch {
        Write-Host "Error al instalar dependencias de Python: $_" -ForegroundColor Red
        return
    }

    # Verificar y configurar .env
    if (-not (Test-Path "back\.env")) {
        Write-Host "Configurando archivo .env..." -ForegroundColor Yellow
        if (Test-Path "back\.env.example") {
            Copy-Item "back\.env.example" "back\.env" -Force
        } else {
            Write-Host "No se encuentra el archivo .env.example" -ForegroundColor Red
            return
        }
    }

    # Verificar dependencias de Node
    Write-Host "Verificando dependencias de Node..." -ForegroundColor Yellow
    if (-not (Test-Path "front\node_modules")) {
        Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
        Set-Location front
        npm install --legacy-peer-deps
        Set-Location $rootPath
    }

    # Matar procesos en los puertos si existen
    Write-Host "Liberando puertos..." -ForegroundColor Yellow
    $ports = @(3000, 5000)
    foreach ($port in $ports) {
        try {
            $processId = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
            if ($processId) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            Write-Host "No hay proceso en el puerto $port" -ForegroundColor Green
        }
    }

    # Iniciar backend
    Write-Host "Iniciando backend..." -ForegroundColor Green
    try {
        $backendWindow = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; . .\.venv\Scripts\Activate.ps1; python back/server.py" -PassThru -WindowStyle Normal
        Start-Sleep -Seconds 5
        
        if (-not (Test-Port 5000)) {
            Write-Host "Backend iniciado correctamente en el puerto 5000" -ForegroundColor Green
        } else {
            Write-Host "Error: El puerto 5000 está ocupado" -ForegroundColor Red
            return
        }
    }
    catch {
        Write-Host "Error al iniciar el backend: $_" -ForegroundColor Red
        return
    }

    # Iniciar frontend
    Write-Host "Iniciando frontend..." -ForegroundColor Green
    try {
        Set-Location front
        
        # Verificar si existe package.json
        if (-not (Test-Path "package.json")) {
            Write-Host "Error: No se encuentra package.json en el directorio front" -ForegroundColor Red
            Set-Location $rootPath
            if ($backendWindow) {
                Stop-Process -Id $backendWindow.Id -Force
            }
            return
        }

        # Verificar si existe node_modules
        if (-not (Test-Path "node_modules")) {
            Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
            npm install --legacy-peer-deps
            if (-not $?) {
                Write-Host "Error al instalar dependencias del frontend" -ForegroundColor Red
                Set-Location $rootPath
                if ($backendWindow) {
                    Stop-Process -Id $backendWindow.Id -Force
                }
                return
            }
        }

        # Intentar iniciar el frontend con npm
        Write-Host "Iniciando servidor de desarrollo React..." -ForegroundColor Yellow
        $env:BROWSER = "none" # Evita que se abra el navegador automáticamente
        
        # Usar Start-Process con comillas correctamente escapadas
        $frontendWindow = Start-Process -FilePath "powershell" -ArgumentList @(
            "-NoExit",
            "-Command",
            "Set-Location '$rootPath\front'; npm start"
        ) -PassThru -WindowStyle Normal

        Set-Location $rootPath
        
        # Esperar a que el servidor esté listo
        $maxAttempts = 30
        $attempts = 0
        $serverStarted = $false

        Write-Host "Esperando a que el servidor frontend esté listo..." -ForegroundColor Yellow
        while ($attempts -lt $maxAttempts -and -not $serverStarted) {
            if (Test-Port 3000) {
                $serverStarted = $true
                Write-Host "Frontend iniciado correctamente en el puerto 3000" -ForegroundColor Green
            } else {
                Start-Sleep -Seconds 1
                $attempts++
                Write-Host "Esperando... Intento $attempts de $maxAttempts" -ForegroundColor Yellow
            }
        }

        if (-not $serverStarted) {
            Write-Host "Error: El servidor frontend no pudo iniciarse después de $maxAttempts intentos" -ForegroundColor Red
            if ($frontendWindow) {
                Stop-Process -Id $frontendWindow.Id -Force
            }
            if ($backendWindow) {
                Stop-Process -Id $backendWindow.Id -Force
            }
            return
        }
    }
    catch {
        Write-Host "Error al iniciar el frontend: $_" -ForegroundColor Red
        Set-Location $rootPath
        if ($backendWindow) {
            Stop-Process -Id $backendWindow.Id -Force
        }
        return
    }

    Write-Host "`nServidores iniciados correctamente!" -ForegroundColor Green
    Write-Host "Backend corriendo en: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "Frontend corriendo en: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "`nPresiona Ctrl+C en las ventanas de los servidores para detenerlos." -ForegroundColor Yellow
    Write-Host "Para acceder a la aplicación, abre http://localhost:3000 en tu navegador" -ForegroundColor Yellow
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