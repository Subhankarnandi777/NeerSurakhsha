@echo off
<<<<<<< HEAD
setlocal
set "PROJECT_DIR=%~dp0"
set "PYTHON=%PROJECT_DIR%venv\Scripts\python.exe"

if not exist "%PYTHON%" (
    echo Virtual environment not found at "%PROJECT_DIR%venv".
    echo Create it with: py -m venv venv
    exit /b 1
)

echo Starting FastAPI Server...
"%PYTHON%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
=======
echo Activating Virtual Environment...
call .\venv\Scripts\activate.bat
echo Starting FastAPI Server...
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
