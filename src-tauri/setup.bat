@echo off

call .venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo venv�̗L�����Ɏ��s���܂���
    exit /b 1
) else (
    python -V
)

python -m pip install --upgrade pip > nul
python -m pip list > pip.list

findstr "wheel" pip.list > nul
if %errorlevel% neq 0 (
    echo wheel�p�b�P�[�W���C���X�g�[�����܂�
    python -m pip install wheel
    @REM python -m pip list > pip.list
    @REM findstr "wheel" pip.list > nul
    if %errorlevel% neq 0 (
        echo wheel�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���
        exit /b 1
    )
)
findstr "wheel" pip.list

findstr "PyPDF2" pip.list > nul
if %errorlevel% neq 0 (
    echo PyPDF2�p�b�P�[�W���C���X�g�[�����܂�
    python -m pip install PyPDF2==2.12.1
    @REM python -m pip list > pip.list
    @REM findstr "PyPDF2" pip.list > nul
    if %errorlevel% neq 0 (
        echo PyPDF2�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���
        exit /b 1
    )
)
findstr "PyPDF2" pip.list

findstr "pycryptodome" pip.list > nul
if %errorlevel% neq 0 (
    echo pycryptodome�p�b�P�[�W���C���X�g�[�����܂�
    python -m pip install pycryptodome
    @REM python -m pip list > pip.list
    @REM findstr "pycryptodome" pip.list > nul
    if %errorlevel% neq 0 (
        echo pycryptodome�p�b�P�[�W�̃C���X�g�[���Ɏ��s���܂���
        exit /b 1
    )
)
findstr "pycryptodome" pip.list

exit /b 0