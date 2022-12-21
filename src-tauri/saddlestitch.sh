#!/bin/sh
BASEDIR=`dirname $0`
source .venv/bin/activate
python3 "$BASEDIR/SaddleStitcher.py" "$1" "$2" $3