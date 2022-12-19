#!/bin/sh
cd `dirname $0`
source .venv/bin/activate
python3 SaddleStitcher.py "$1" "$2" $3