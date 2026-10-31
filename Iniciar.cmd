@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js 22 ou superior para abrir o projeto.
  pause
  exit /b 1
)
set PORT=4180
echo Jogos de Lingua Portuguesa: http://127.0.0.1:4180/
echo Mantenha esta janela aberta enquanto joga. Ctrl+C encerra o servidor.
start "" "http://127.0.0.1:4180/"
node tools\serve.js
pause
