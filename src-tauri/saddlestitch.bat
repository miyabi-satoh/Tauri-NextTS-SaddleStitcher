@echo off
pushd "%~dp0"
call .venv\Scripts\activate.bat
python3 SaddleStitcher.py "$1" "$2"