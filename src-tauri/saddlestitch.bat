@echo off
set BASEDIR=%~dp0
call .venv\Scripts\activate.bat
python "%BASEDIR%SaddleStitcher.py" "%~1" "%~2" %3