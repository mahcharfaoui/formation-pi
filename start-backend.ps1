# ============================================================
# Script de demarrage du backend en mode local (sans Docker)
# Postgres et Redis restent dans Docker
# ============================================================

$ROOT = $PSScriptRoot

Write-Host "=== Demarrage du backend local ===" -ForegroundColor Cyan

# 1. Demarrer Postgres + Redis uniquement via Docker
Write-Host "`n[1/3] Demarrage Postgres + Redis..." -ForegroundColor Yellow
docker compose -f "$ROOT\docker-compose.yml" up -d postgres redis
Start-Sleep -Seconds 5

# 2. Demarrer Eureka
Write-Host "`n[2/3] Demarrage Eureka Server (port 8761)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ROOT\backend\eureka-server'; Write-Host 'EUREKA SERVER' -ForegroundColor Cyan; mvn spring-boot:run"

Write-Host "  Attente demarrage Eureka (60s)..."
$ready = $false
for ($i = 0; $i -lt 12; $i++) {
    Start-Sleep -Seconds 10
    try {
        $r = Invoke-RestMethod "http://localhost:8761/actuator/health" -TimeoutSec 3 -ErrorAction Stop
        if ($r.status -eq "UP") { Write-Host "  ✅ Eureka UP!" -ForegroundColor Green; $ready = $true; break }
    } catch {}
    Write-Host "  [$((($i+1)*10))s] Attente..."
}
if (-not $ready) { Write-Host "  ⚠️  Eureka pas encore pret, on continue quand meme..." -ForegroundColor Yellow }

# 3. Demarrer les microservices
Write-Host "`n[3/3] Demarrage des microservices..." -ForegroundColor Yellow

$services = @(
    @{ name="API Gateway";      port=8080; dir="api-gateway";           extra="-Dspring-boot.run.profiles=dev" },
    @{ name="Catalogue";        port=8081; dir="catalogue-service";     extra="" },
    @{ name="User";             port=8082; dir="user-service";          extra="" },
    @{ name="Formateur";        port=8083; dir="formateur-service";     extra="" },
    @{ name="Session";          port=8084; dir="session-service";       extra="" },
    @{ name="Quiz";             port=8085; dir="quiz-service";          extra="" },
    @{ name="Suivi";            port=8086; dir="suivi-service";         extra="" },
    @{ name="Certification";    port=8087; dir="certification-service"; extra="" },
    @{ name="ML";               port=8088; dir="ml-service";            extra="" }
)

foreach ($svc in $services) {
    $dir = "$ROOT\backend\$($svc.dir)"
    $cmd = "cd '$dir'; Write-Host '$($svc.name) SERVICE (port $($svc.port))' -ForegroundColor Cyan; mvn spring-boot:run $($svc.extra)"
    Write-Host "  Demarrage $($svc.name) (port $($svc.port))..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd
    Start-Sleep -Seconds 3
}

Write-Host "`n✅ Tous les services sont en cours de demarrage !" -ForegroundColor Green
Write-Host ""
Write-Host "URLs d acces:" -ForegroundColor Cyan
Write-Host "  Frontend Angular  : http://localhost:4200  (npm start dans /frontend)"
Write-Host "  API Gateway       : http://localhost:8080"
Write-Host "  Eureka Dashboard  : http://localhost:8761"
Write-Host "  Swagger Catalogue : http://localhost:8081/swagger-ui.html"
Write-Host "  Prometheus        : http://localhost:9090"
Write-Host "  Grafana           : http://localhost:3000  (admin/admin)"
Write-Host ""
Write-Host "Pour lancer le frontend, ouvre un nouveau terminal:" -ForegroundColor Yellow
Write-Host "  cd $ROOT\frontend"
Write-Host "  npm start"
