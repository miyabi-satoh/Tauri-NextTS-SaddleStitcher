@echo off
BASEDIR=%~dp0
call .venv\Scripts\activate.bat
python3 "%BASEDIR%SaddleStitcher.py "%1" "%2" %3