# PowerShell Script to Download Placeholder Slider Images
# Run this script to download free placeholder images from Unsplash

Write-Host "================================" -ForegroundColor Green
Write-Host "Litein Municipality Slider Image Downloader" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$sliderPath = $PSScriptRoot

# Unsplash random image URLs with specific themes
$images = @{
    "slide1.jpg" = "https://source.unsplash.com/1920x1080/?government,building,architecture"
    "slide2.jpg" = "https://source.unsplash.com/1920x1080/?digital,services,technology"
    "slide3.jpg" = "https://source.unsplash.com/1920x1080/?business,investment,development"
    "slide4.jpg" = "https://source.unsplash.com/1920x1080/?community,people,service"
}

Write-Host "Starting download of slider images..." -ForegroundColor Cyan
Write-Host ""

foreach ($image in $images.GetEnumerator()) {
    $fileName = $image.Key
    $url = $image.Value
    $outputPath = Join-Path $sliderPath $fileName
    
    try {
        Write-Host "Downloading $fileName..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $url -OutFile $outputPath -UseBasicParsing
        
        if (Test-Path $outputPath) {
            $fileSize = (Get-Item $outputPath).Length / 1KB
            Write-Host "✓ $fileName downloaded successfully! (Size: $([math]::Round($fileSize, 2)) KB)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "✗ Failed to download $fileName : $_" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Download Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Images saved to: $sliderPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the downloaded images" -ForegroundColor White
Write-Host "2. Replace with your own photos if desired" -ForegroundColor White
Write-Host "3. Update HeroSlider.jsx to use /slider/slideX.jpg paths" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
