#!/bin/sh
cd `dirname $0`

if [ ! -e .venv ]; then
    echo "Python仮想環境を作成します"
    python3 -m venv .venv
fi
source .venv/bin/activate
if [ $? -ne 0 ]; then
    echo "venvの有効化に失敗しました"
    exit 1
fi

python3 -m pip install --upgrade pip > /dev/null
python3 -m pip list > pip.list

grep -q wheel pip.list
if [ $? -ne 0 ]; then
    echo "wheelパッケージをインストールします"
    python3 -m pip install wheel > /dev/null
    if [ $? -ne 0 ]; then
        echo "wheelパッケージのインストールに失敗しました"
        exit 1
    fi
fi

grep -q PyPDF2 pip.list
if [ $? -ne 0 ]; then
    echo "PyPDF2パッケージをインストールします"
    python3 -m pip install PyPDF2 > /dev/null
    if [ $? -ne 0 ]; then
        echo "PyPDF2パッケージのインストールに失敗しました"
        exit 1
    fi
fi

grep -q pycryptodome pip.list
if [ $? -ne 0 ]; then
    echo "pycryptodomeパッケージをインストールします" 
    python3 -m pip install pycryptodome > /dev/null
    if [ $? -ne 0 ]; then
        echo "pycryptodomeパッケージのインストールに失敗しました"
        exit 1
    fi
fi

exit 0