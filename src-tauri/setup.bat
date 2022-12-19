@echo off
pushd "%~dp0"

if not exist ".venv" (
    echo "Python仮想環境を作成します"
    python3 -m venv .venv
)
call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo "venvの有効化に失敗しました"
    exit /b 1
)

python3 -m pip install --upgrade pip > nul
python3 -m pip list > pip.list

find "wheel" pip.list > nul
if %errorlevel% neq 0 (
    echo "wheelパッケージをインストールします"
    python3 -m pip install wheel > nul
    if %errorlevel% neq 0 (
        echo "wheelパッケージのインストールに失敗しました"
        exit /b 1
    )
)

find "PyPDF2" pip.list > nul
if %errorlevel% neq 0 (
    echo "PyPDF2パッケージをインストールします"
    python3 -m pip install PyPDF2 > nul
    if %errorlevel% neq 0 (
        echo "PyPDF2パッケージのインストールに失敗しました"
        exit /b 1
    )
)

find "pycryptodome" pip.list > nul
if %errorlevel% neq 0 (
    python3 -m pip install pycryptodome > nul
    if %errorlevel% neq 0 (
        echo "pycryptodomeパッケージのインストールに失敗しました"
        exit /b 1
    )
)

exit /b 0