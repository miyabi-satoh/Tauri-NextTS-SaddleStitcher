@echo off

call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo venvの有効化に失敗しました
    exit /b 1
) else (
    python -V
)

python -m pip install --upgrade pip > nul
python -m pip list > pip.list

findstr "wheel" pip.list > nul
if %errorlevel% neq 0 (
    echo wheelパッケージをインストールします
    python -m pip install wheel
    @REM python -m pip list > pip.list
    @REM findstr "wheel" pip.list > nul
    if %errorlevel% neq 0 (
        echo wheelパッケージのインストールに失敗しました
        exit /b 1
    )
)
findstr "wheel" pip.list

findstr "PyPDF2" pip.list > nul
if %errorlevel% neq 0 (
    echo PyPDF2パッケージをインストールします
    python -m pip install PyPDF2==2.12.1
    @REM python -m pip list > pip.list
    @REM findstr "PyPDF2" pip.list > nul
    if %errorlevel% neq 0 (
        echo PyPDF2パッケージのインストールに失敗しました
        exit /b 1
    )
)
findstr "PyPDF2" pip.list

findstr "pycryptodome" pip.list > nul
if %errorlevel% neq 0 (
    echo pycryptodomeパッケージをインストールします
    python -m pip install pycryptodome
    @REM python -m pip list > pip.list
    @REM findstr "pycryptodome" pip.list > nul
    if %errorlevel% neq 0 (
        echo pycryptodomeパッケージのインストールに失敗しました
        exit /b 1
    )
)
findstr "pycryptodome" pip.list

exit /b 0