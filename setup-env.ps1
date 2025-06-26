# PowerShell script to set up environment variables
# This script will copy the .env.example file to .env if it doesn't exist

$envFile = ".env"
$envExampleFile = ".env.example"

# Check if .env file exists
if (-not (Test-Path $envFile)) {
    # Copy .env.example to .env
    Copy-Item -Path $envExampleFile -Destination $envFile
    Write-Host "Created $envFile from $envExampleFile" -ForegroundColor Green
    Write-Host "Please edit the $envFile file with your Firebase configuration" -ForegroundColor Yellow
} else {
    Write-Host "$envFile already exists. No changes were made." -ForegroundColor Yellow
    Write-Host "If you need to update your configuration, please edit $envFile manually" -ForegroundColor Yellow
}

# Display instructions
Write-Host "\nPlease make sure to add the following to your $envFile file:" -ForegroundColor Cyan
Get-Content $envExampleFile | ForEach-Object {
    if ($_ -match '^#') {
        Write-Host $_ -ForegroundColor Cyan
    } else {
        Write-Host $_ -ForegroundColor White
    }
}

Write-Host "\nAfter updating the $envFile file, please restart your development server." -ForegroundColor Green
