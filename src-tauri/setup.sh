#!/bin/sh
cd `dirname $0`

if [ ! -e .venv ]; then
    python3 -m venv .venv
fi

if [ ! -e .venv ]; then
    echo ".venvが見つかりません。"
    exit 1
fi
echo ".venv OK"

source .venv/bin/activate
which python3 | grep -q .venv
if [ $? -ne 0 ]; then
    echo ".venvが無効です。"
    exit 1
fi
echo `python3 -V`

python3 -m pip install --upgrade pip > /dev/null
python3 -m pip list | grep -q PyPDF2
if [ $? -ne 0 ]; then
    python3 -m pip install PyPDF2
fi

python3 -m pip list | grep -q PyPDF2
if [ $? -ne 0 ]; then
    echo "PyPDF2パッケージが見つかりません。"
    exit 1
fi
echo "PyPDF2 OK"

exit 0