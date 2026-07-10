# ============================================================
# Script de demarrage complet (Docker Compose + Frontend)
# - Build les JARs (si besoin)
# - Lance tous les services via Docker Compose
# - Lance le frontend Angular
# ============================================================

$ROOT = $PSScriptRoot
$JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:JAVA_HOME = $JAVA_HOME
$env:Path = "$JAVA_HOME\bin;$env:Path;C:\tools\apache-maven-3.9.16\bin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PLATEFORME FORMATIONS - DEMARRAGE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Build des JARs si les fichiers target/ n'existent pas
$needBuild = $false
$services = @("eureka-server", "api-gateway", "catalogue-service", "user-service", "formateur-service", "session-service", "quiz-service", "suivi-service", "certification-service", "ml-service")
foreach ($svc in $services) {
    $jar = Get-ChildItem "$ROOT\backend\$svc\target\*.jar" -ErrorAction SilentlyContinue
    if (-not $jar) { $needBuild = $true; break }
}
if ($needBuild) {
    Write-Host "[1/4] Build des microservices..." -ForegroundColor Yellow
    cd $ROOT
    mvn clean package -DskipTests -q
    if (-not $?) { Write-Host "ERREUR: Build echoue" -ForegroundColor Red; exit 1 }
    Write-Host "  Build reussi" -ForegroundColor Green
} else {
    Write-Host "[1/4] JARs deja presents, skip build" -ForegroundColor Green
}

# 2. Demarrage Docker Desktop (si besoin)
Write-Host "[2/4] Verification de Docker..." -ForegroundColor Yellow
$dockerOk = $false
for ($i = 0; $i -lt 12; $i++) {
    try { $r = docker info 2>&1; if ($LASTEXITCODE -eq 0) { $dockerOk = $true; break } } catch {}
    if ($i -eq 0) { Start-Process "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe" }
    Start-Sleep -Seconds 10
}
if (-not $dockerOk) { Write-Host "ERREUR: Docker indisponible" -ForegroundColor Red; exit 1 }
Write-Host "  Docker OK" -ForegroundColor Green

# 3. Lancement Docker Compose
Write-Host "[3/4] Demarrage des services Docker..." -ForegroundColor Yellow
cd $ROOT
docker compose up -d --build 2>&1 | Out-Null
Write-Host "  Services Docker en cours de demarrage..." -ForegroundColor Green

Write-Host "[4/4] Demarrage du frontend Angular..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\frontend'; npm start"

# 4. Attente que tout soit operationnel
Write-Host "`nAttente des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 45

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  APPLICATION DEMARRÉE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs d'acces:" -ForegroundColor Cyan
Write-Host "  Frontend Angular  : http://localhost:4200" -ForegroundColor White
Write-Host "  API Gateway       : http://localhost:8090" -ForegroundColor White
Write-Host "  Eureka Dashboard  : http://localhost:8761" -ForegroundColor White
Write-Host "  Keycloak          : http://localhost:8180  (admin/admin)" -ForegroundColor White
Write-Host "  Prometheus        : http://localhost:9090" -ForegroundColor White
Write-Host "  Grafana           : http://localhost:3000  (admin/admin)" -ForegroundColor White
Write-Host ""
Write-Host "Pour arreter: docker compose down" -ForegroundColor Yellow
