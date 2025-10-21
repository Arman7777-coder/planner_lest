# PowerShell скрипт для запуска Focus Planner от имени администратора
# Запуск: PowerShell -ExecutionPolicy Bypass -File "launch-as-admin.ps1"

Write-Host "🔧 Запуск Focus Planner от имени администратора..." -ForegroundColor Green
Write-Host ""

# Проверка прав администратора
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ ОШИБКА: Необходимы права администратора!" -ForegroundColor Red
    Write-Host "Запустите PowerShell от имени администратора и повторите попытку." -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "✅ Права администратора подтверждены." -ForegroundColor Green
Write-Host ""

# Поиск установленного приложения
Write-Host "🔍 Поиск Focus Planner..." -ForegroundColor Cyan

$AppPath = $null

# Проверка Microsoft Store версии
$StoreApps = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WindowsApps" -Filter "50688NewHope.FocusPlanner_*" -Directory -ErrorAction SilentlyContinue
if ($StoreApps) {
    $AppPath = Join-Path $StoreApps[0].FullName "Focus Planner.exe"
    Write-Host "📱 Найдена версия из Microsoft Store: $AppPath" -ForegroundColor Green
}

# Проверка MSIX файла
if (-not $AppPath -and (Test-Path "dist\FocusPlanner-1.0.4-fixed.msix")) {
    Write-Host "📦 Установка MSIX пакета..." -ForegroundColor Yellow
    try {
        Add-AppxPackage -Path "dist\FocusPlanner-1.0.4-fixed.msix" -Force
        Write-Host "✅ Установка завершена успешно!" -ForegroundColor Green
        
        # Поиск установленного приложения после установки
        $StoreApps = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WindowsApps" -Filter "50688NewHope.FocusPlanner_*" -Directory -ErrorAction SilentlyContinue
        if ($StoreApps) {
            $AppPath = Join-Path $StoreApps[0].FullName "Focus Planner.exe"
        }
    }
    catch {
        Write-Host "❌ Ошибка установки MSIX пакета: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Запуск приложения
if ($AppPath -and (Test-Path $AppPath)) {
    Write-Host "🚀 Запуск: $AppPath" -ForegroundColor Green
    Start-Process -FilePath $AppPath -Verb RunAs
    Write-Host "✅ Приложение запущено!" -ForegroundColor Green
}
else {
    Write-Host "⚠️ Приложение не найдено. Попытка запуска через Microsoft Store..." -ForegroundColor Yellow
    Start-Process "ms-windows-store://pdp/?productid=focus_planner_premium_monthly"
}

Write-Host ""
Write-Host "🎉 Готово!" -ForegroundColor Green
Read-Host "Нажмите Enter для выхода"
