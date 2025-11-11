# PowerShell script to set up PostgreSQL with Docker
# This is the easiest way to get PostgreSQL running with known credentials

Write-Host "Setting up PostgreSQL with Docker..." -ForegroundColor Green

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Stop and remove existing container if it exists
Write-Host "Stopping existing container (if any)..." -ForegroundColor Yellow
docker stop smartrent360-db 2>$null
docker rm smartrent360-db 2>$null

# Start PostgreSQL container
Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
docker run --name smartrent360-db `
    -e POSTGRES_PASSWORD=MONCHEL1236 `
    -e POSTGRES_DB=smartrent360 `
    -p 5432:5432 `
    -d postgres

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL container started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your database is now running with:" -ForegroundColor Cyan
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 5432" -ForegroundColor White
    Write-Host "  Database: smartrent360" -ForegroundColor White
    Write-Host "  Username: postgres" -ForegroundColor White
    Write-Host "  Password: MONCHEL1236" -ForegroundColor White
    Write-Host ""
    Write-Host "Your .env file is already configured correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Wait a few seconds for PostgreSQL to start, then run:" -ForegroundColor Yellow
    Write-Host "  npm run prisma:migrate" -ForegroundColor White
} else {
    Write-Host "❌ Failed to start PostgreSQL container" -ForegroundColor Red
}


