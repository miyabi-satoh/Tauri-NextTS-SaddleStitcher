#!/bin/sh

source .venv/bin/activate
if [ $? -ne 0 ]; then
    echo "venvの有効化に失敗しました"
    exit 1
else
    python3 -V
fi

python3 -m pip install --upgrade pip > /dev/null
python3 -m pip list > pip.list

grep -q wheel pip.list
if [ $? -ne 0 ]; then
    echo "wheelパッケージをインストールします"
    python3 -m pip install wheel
    if [ $? -ne 0 ]; then
        echo "wheelパッケージのインストールに失敗しました"
        exit 1
    fi
fi
echo `grep wheel pip.list`

grep -q PyPDF2 pip.list
if [ $? -ne 0 ]; then
    echo "PyPDF2パッケージをインストールします"
    python3 -m pip install PyPDF2==2.12.1
    if [ $? -ne 0 ]; then
        echo "PyPDF2パッケージのインストールに失敗しました"
        exit 1
    fi
fi
echo `grep PyPDF2 pip.list`

grep -q pycryptodome pip.list
if [ $? -ne 0 ]; then
    echo "pycryptodomeパッケージをインストールします" 
    python3 -m pip install pycryptodome
    if [ $? -ne 0 ]; then
        echo "pycryptodomeパッケージのインストールに失敗しました"
        exit 1
    fi
fi
echo `grep pycryptodome pip.list`

exit 0