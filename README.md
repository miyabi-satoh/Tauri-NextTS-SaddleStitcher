# SaddleStitcher

- A4 サイズの PDF から、両面印刷で中綴じ冊子にできる A3 サイズの PDF を作る Python スクリプトを書いた。
- コマンドラインから実行するのも面倒なので、GUI をつけたいと思った。
- Electron で作ろうと思ったが、Tauri の存在を知った。
- Rust は触れたことのない言語だったが、Typescript だけでも実現できそうだった。
- 実際、実際できた(v0.0.1)けど、バックグラウンド的な処理をフロント側に記述するのも気持ち悪い気がして、[Rust ツアー](https://tourofrust.com/00_ja.html)を読みながら main.rs に記述してみた(v0.0.2)。
- Github Actions でクロスコンパイルしてるけど、M1 mac しか持っていないので、成果物がちゃんと動くか確認できない。

## スクリーンショット

![スクリーンショット](https://github.com/miyabi-satoh/Tauri-NextTS-SaddleStitcher/blob/3f732f8cf584dadbc056cf88b97b05c8a9de5aef/screenshot.png?raw=true)
