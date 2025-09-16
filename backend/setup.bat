@echo off
echo "==============================================="
echo "QUIZZ Backend Installation Script"
echo "==============================================="

:: Check if Node.js is installed
echo Checking if Node.js is installed...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js and try again.
    exit /b 1
)

:: Install backend dependencies
echo Installing backend dependencies...
npm install

:: Check if .env file exists, if not create one from example
echo Checking environment configuration...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please update the .env file with your database credentials.
)

:: Prompt to start the server
echo.
echo Installation complete!
echo.
echo You can now start the server with:
echo   npm start
echo.
echo Or for development with auto-reload:
echo   npm run dev
echo.

pause
