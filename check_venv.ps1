Write-Host "🔍 Verificando el entorno virtual..." -ForegroundColor Cyan

# Verificar si existe el entorno virtual
if (-not (Test-Path ".venv")) {
    Write-Host "⚠️ No se encontró el entorno virtual. Creando uno nuevo..." -ForegroundColor Yellow
    python -m venv .venv
    if (-not $?) {
        Write-Host "❌ Error al crear el entorno virtual" -ForegroundColor Red
        exit 1
    }
}

# Activar el entorno virtual
Write-Host "🔄 Activando el entorno virtual..." -ForegroundColor Yellow
try {
    . .\.venv\Scripts\Activate.ps1
}
catch {
    Write-Host "❌ Error al activar el entorno virtual" -ForegroundColor Red
    exit 1
}

# Actualizar pip
Write-Host "📦 Actualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Verificar que estamos en el entorno virtual correcto
$pythonPath = (Get-Command python).Source
if (-not $pythonPath.Contains(".venv")) {
    Write-Host "❌ No se está usando el entorno virtual correcto" -ForegroundColor Red
    exit 1
}

# Verificar la versión de Python
$pythonVersion = python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')"
$minVersion = "3.7"
$recVersion = "3.11"

if ([version]$pythonVersion -lt [version]$minVersion) {
    Write-Host "❌ La versión de Python ($pythonVersion) es menor que la mínima requerida ($minVersion)" -ForegroundColor Red
    exit 1
}

if ([version]$pythonVersion -lt [version]$recVersion) {
    Write-Host "⚠️ Se recomienda usar Python $recVersion o superior (actual: $pythonVersion)" -ForegroundColor Yellow
}

# Verificar las dependencias instaladas
Write-Host "📋 Verificando dependencias..." -ForegroundColor Yellow
pip freeze > temp_requirements.txt
$installedDeps = Get-Content temp_requirements.txt
$requiredDeps = Get-Content back/requirements.txt
Remove-Item temp_requirements.txt

$missingDeps = @()
foreach ($dep in $requiredDeps) {
    if ($dep -and -not ($installedDeps -match $dep)) {
        $missingDeps += $dep
    }
}

if ($missingDeps.Count -gt 0) {
    Write-Host "⚠️ Faltan las siguientes dependencias:" -ForegroundColor Yellow
    $missingDeps | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
    
    $install = Read-Host "¿Deseas instalar las dependencias faltantes? (S/N)"
    if ($install -eq "S" -or $install -eq "s") {
        pip install -r back/requirements.txt
    }
}

Write-Host "✅ Verificación completada" -ForegroundColor Green
Write-Host @"

📝 Recomendaciones:
1. Mantén el entorno virtual aislado (no uses include-system-site-packages)
2. Actualiza requirements.txt cuando instales nuevas dependencias
3. No compartas el entorno virtual, solo requirements.txt
4. Usa 'pip freeze > requirements.txt' para actualizar las dependencias
"@ -ForegroundColor Cyan 