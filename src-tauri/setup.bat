@echo off

call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo "venv�̗L�����Ɏ��s���܂���"
    exit /b 1
)

python -m pip install --upgrade pip > nul
python -m pip list > pip.list

findstr "wheel" pip.list > nul
if %errorlevel% neq 0 (
    echo "wheel�p�b�P�[�W���C���X�g�[�����܂�"
    python -m pip install wheel > nul
    if %errorlevel% neq 0 (
        echo "wheel�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���"
        exit /b 1
    ) else (
        echo "����"
    )
) else (
    findstr "wheel" pip.list
)

findstr "PyPDF2" pip.list > nul
if %errorlevel% neq 0 (
    echo "PyPDF2�p�b�P�[�W���C���X�g�[�����܂�"
    python -m pip install PyPDF2 > nul
    if %errorlevel% neq 0 (
        echo "PyPDF2�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���"
        exit /b 1
    ) else (
        echo "����"
    )
) else (
    findstr "PyPDF2" pip.list
)

findstr "pycryptodome" pip.list > nul
if %errorlevel% neq 0 (
    python -m pip install pycryptodome > nul
    if %errorlevel% neq 0 (
        echo "pycryptodome�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���"
        exit /b 1
    ) else (
        echo "����"
    )
) else {
    findstr "pycryptodome" pip.list
}

exit /b 0