# SaddleStitcher

- A4 サイズの PDF から、両面印刷で中綴じ冊子にできる A3 サイズの PDF を作る Python スクリプトを書いた。I wrote a Python script to create a double-sided saddle-stitched PDF from an A4 sized PDF into an A3 sized PDF.
- コマンドラインから実行するのも面倒なので、GUI を使いたいと思った。Running from the command line is too troublesome, so I wanted to use the GUI.
- Electron で作ろうと思ったが、Tauri の存在を知った。I thought to make it with Electron, but I learned about the existence of Tauri.
- Rust は触れたことのない言語だったが、Typescript だけでも実現できそうだった。Rust was a language I had never touched, but it looked like it could be done with Typescript alone.
- 実際、実際できた(v0.0.1)けど、バックグラウンド的な処理をフロント側に記述するのも気持ち悪い気がして、[Rust ツアー](https://tourofrust.com/00_ja.html)を読みながら main.rs に記述してみた(v0.0.2)。Actually, I was able to do it (v0.0.1), but I felt uncomfortable writing background processing on the front side, so I started [Rust Tour](https://tourofrust.com/00_en.html) I wrote it in main.rs while reading (v0.0.2).
- Github Actions でクロスコンパイルしてるけど、M1 mac しか持っていないので、成果物がちゃんと動くか確認できない。I'm cross-compiling with Github Actions, but I only have an M1 mac, so I can't check if the product works properly.
- (0.0.3)色々試した結果、フロントで実行可能な処理はフロントで済ませてしまう方が良い気がした。一番は外部コマンド出力の拾い方で。バックエンド側で実行した出力を行ごとにフロントへ送るのが難しい。Rust に不慣れなことも一因。As a result of trying various things, I felt that it was better to finish the processing that can be executed on the front on the front. The first is how to pick up the external command output. It's difficult to send the output from the backend line by line to the front. Unfamiliarity with Rust is also a factor.
- (0.0.3)PDF によっては pycryptodome が必要だった。そして pycryptodome に wheel を入れろと言われた。Some PDFs required pycryptodome. And I was told to put the wheel in pycryptodome.
- (0.0.3)左開き／右開きを指定できるようにしてみた。（右開きのページ順が合ってるかは未確認なのだが）I tried to be able to specify left opening / right opening. (I'm not sure if the right-opening page order is correct.)

## Screenshots

![Main](https://github.com/miyabi-satoh/Tauri-NextTS-SaddleStitcher/blob/3f732f8cf584dadbc056cf88b97b05c8a9de5aef/screenshot.png?raw=true)
