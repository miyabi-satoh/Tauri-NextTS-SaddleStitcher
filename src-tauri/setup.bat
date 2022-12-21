@echo off
pushd "%~dp0"

if not exist ".venv" (
    echo "Python���z�����쐬���܂�"
    python -m venv .venv
)
call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo "venv�̗L�����Ɏ��s���܂���"
    exit /b 1
)

python -m pip install --upgrade pip > nul
python -m pip list > pip.list

find "wheel" pip.list > nul
if %errorlevel% neq 0 (
    echo "wheel�p�b�P�[�W���C���X�g�[�����܂�"
    python -m pip install wheel > nul
    if %errorlevel% neq 0 (
        echo "wheel�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���"
        exit /b 1
    )
)

find "PyPDF2" pip.list > nul
if %errorlevel% neq 0 (
    echo "PyPDF2�p�b�P�[�W���C���X�g�[�����܂�"
    python -m pip install PyPDF2 > nul
    if %errorlevel% neq 0 (
        echo "PyPDF2�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���"
        exit /b 1
    )
)

find "pycryptodome" pip.list > nul
if %errorlevel% neq 0 (
    python -m pip install pycryptodome > nul
    if %errorlevel% neq 0 (
        echo "pycryptodome�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���"
        exit /b 1
    )
)

exit /b 0