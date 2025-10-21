@echo off
echo Запуск Focus Planner от имени администратора...
echo.

REM Проверка прав администратора
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Права администратора подтверждены.
    echo.
) else (
    echo ОШИБКА: Необходимы права администратора!
    echo Запустите этот файл от имени администратора.
    pause
    exit /b 1
)

REM Поиск установленного приложения
echo Поиск Focus Planner...
set "APP_PATH="

REM Проверка Microsoft Store версии
if exist "%LOCALAPPDATA%\Microsoft\WindowsApps\50688NewHope.FocusPlanner_*" (
    for /d %%i in ("%LOCALAPPDATA%\Microsoft\WindowsApps\50688NewHope.FocusPlanner_*") do (
        set "APP_PATH=%%i\Focus Planner.exe"
    )
)

REM Проверка MSIX файла
if not defined APP_PATH (
    if exist "dist\FocusPlanner-1.0.4-fixed.msix" (
        echo Установка MSIX пакета...
        powershell -Command "Add-AppxPackage -Path 'dist\FocusPlanner-1.0.4-fixed.msix' -Force"
        if %errorLevel% == 0 (
            echo Установка завершена успешно!
        ) else (
            echo Ошибка установки MSIX пакета.
        )
    ) else (
        echo MSIX файл не найден: dist\FocusPlanner-1.0.4-fixed.msix
    )
)

REM Запуск приложения
if defined APP_PATH (
    echo Запуск: %APP_PATH%
    start "" "%APP_PATH%"
) else (
    echo Попытка запуска через Microsoft Store...
    start ms-windows-store://pdp/?productid=focus_planner_premium_monthly
)

echo.
echo Готово!
pause
