@echo off

call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo "venvの有効化に失敗しました"
    exit /b 1
)

python -m pip install --upgrade pip > nul
python -m pip list > pip.list

findstr "wheel" pip.list > nul
if %errorlevel% neq 0 (
    echo "wheelパッケージをインストールします"
    python -m pip install wheel > nul
    if %errorlevel% neq 0 (
        echo "wheelパッケージのインストールに失敗しました"
        exit /b 1
    ) else (
        echo "成功"
    )
) else (
    findstr "wheel" pip.list
)

findstr "PyPDF2" pip.list > nul
if %errorlevel% neq 0 (
    echo "PyPDF2パッケージをインストールします"
    python -m pip install PyPDF2 > nul
    if %errorlevel% neq 0 (
        echo "PyPDF2パッケージのインストールに失敗しました"
        exit /b 1
    ) else (
        echo "成功"
    )
) else (
    findstr "PyPDF2" pip.list
)

findstr "pycryptodome" pip.list > nul
if %errorlevel% neq 0 (
    python -m pip install pycryptodome > nul
    if %errorlevel% neq 0 (
        echo "pycryptodomeパッケージのインストールに失敗しました"
        exit /b 1
    ) else (
        echo "成功"
    )
) else {
    findstr "pycryptodome" pip.list
}

exit /b 0