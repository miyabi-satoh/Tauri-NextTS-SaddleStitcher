@echo off
pushd "%~dp0"

if not exist ".venv" (
    python3 -m venv .venv
)
if not exist ".venv" (
    echo ".venvが見つかりません。"
    exit /b 1
)
echo ".venv OK"

call .venv\Scripts\activate.bat
which python3 | findstr .venv > nul
if %errorlevel% neq 0 (
if [ $? -ne 0 ]; then
    echo ".venvが無効です。"
    exit 1
)
python3 -V

python3 -m pip install --upgrade pip > nul
python3 -m pip list | findstr PyPDF2 > nul
if %errorlevel% neq 0 (
    python3 -m pip install PyPDF2
)
python3 -m pip list | findstr PyPDF2 > nul
if %errorlevel% neq 0 (
    echo "PyPDF2パッケージが見つかりません。"
    exit 1
)
echo "PyPDF2 OK"

exit /b 0