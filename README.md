# SaddleStitcher

- A4 サイズの PDF から、両面印刷で中綴じ冊子にできる A3 サイズの PDF を作る Python スクリプトを書いた。I wrote a Python script to create a double-sided saddle-stitched PDF from an A4 sized PDF into an A3 sized PDF.
- コマンドラインから実行するのも面倒なので、GUI を使いたいと思った。Running from the command line is too troublesome, so I wanted to use the GUI.
- Electron で作ろうと思ったが、Tauri の存在を知った。I thought to make it with Electron, but I learned about the existence of Tauri.
- Rust は触れたことのない言語だったが、Typescript だけでも実現できそうだった。Rust was a language I had never touched, but it looked like it could be done with Typescript alone.
- 実際、実際できた(v0.0.1)けど、バックグラウンド的な処理をフロント側に記述するのも気持ち悪い気がして、[Rust ツアー](https://tourofrust.com/00_ja.html)を読みながら main.rs に記述してみた(v0.0.2)。Actually, I was able to do it (v0.0.1), but I felt uncomfortable writing background processing on the front side, so I started [Rust Tour](https://tourofrust.com/00_en.html) I wrote it in main.rs while reading (v0.0.2).
- Github Actions でクロスコンパイルしてるけど、M1 mac しか持っていないので、成果物がちゃんと動くか確認できない。I'm cross-compiling with Github Actions, but I only have an M1 mac, so I can't check if the product works properly.

## Screenshots

![Main](https://github.com/miyabi-satoh/Tauri-NextTS-SaddleStitcher/blob/3f732f8cf584dadbc056cf88b97b05c8a9de5aef/screenshot.png?raw=true)
