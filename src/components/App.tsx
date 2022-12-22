import { ReactNode, useEffect, useRef, useState } from "react";
import {
  appDataDir,
  BaseDirectory,
  basename,
  join,
  resolveResource,
} from "@tauri-apps/api/path";
import { confirm, open, save } from "@tauri-apps/api/dialog";
import { relaunch } from "@tauri-apps/api/process";
import { ChildProcess, Command, SpawnOptions } from "@tauri-apps/api/shell";
import { createDir, removeDir } from "@tauri-apps/api/fs";
import { useMessageContext } from "./Console";
import { dirExists, getVersionString } from "~/utils";
import { Overlay, OverlayShowType } from "./Overlay";
import { Config, loadConfig, removeConfig } from "~/utils/config";

const WINDOWS = navigator.userAgent.includes("Windows");
const CMD = WINDOWS ? "cmd" : "sh";
const ARG = WINDOWS ? "/C" : "-c";
const SCRIPT_EXT = WINDOWS ? "bat" : "sh";
const START = WINDOWS ? "start" : "open";
const WHERE = WINDOWS ? "where" : "which";

const COLOR_ERR = "text-red-600";
const COLOR_DBG = "text-gray-500";

type OpenDirection = "left" | "right";

export const App = () => {
  const config = useRef<Config>({} as Config);
  const didEffect = useRef(false);
  const { addMessage } = useMessageContext();
  const [inputPdf, setInputPdf] = useState("");
  const [savedFile, setSavedFile] = useState("");
  const [openDirection, setOpenDirection] = useState<OpenDirection>("left");
  const [overlayShows, setOverlayShows] = useState<OverlayShowType>("spinner");
  const [errorContent, setErrorContent] = useState<ReactNode>(null);

  async function selectInputPdf() {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "PDF Document",
          extensions: ["pdf"],
        },
      ],
    });
    if (typeof selected === "string") {
      setInputPdf(selected);
      setSavedFile("");
    }
  }

  const handleChangeInputPdf: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInputPdf(event.target.value);
  };

  const handleChangeOpenDirection: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setOpenDirection(event.target.value as OpenDirection);
  };

  async function doSaddleStitch() {
    const name = await basename(inputPdf);
    const newName = `(製本版)${name}`;

    const savePath = await save({
      defaultPath: newName,
    });
    if (savePath === null) {
      return;
    }

    setOverlayShows("spinner");

    const dataDir = await appDataDir();
    const scriptPath = await resolveResource(`saddlestitch.${SCRIPT_EXT}`);
    debug(`> "${scriptPath}" "${inputPdf}" "${savePath}" ${openDirection}`);
    const command = new Command(
      CMD,
      [ARG, `"${scriptPath}" "${inputPdf}" "${savePath}" ${openDirection}`],
      {
        cwd: dataDir,
      }
    ).on("close", (data) => {
      setOverlayShows("none");
      if (data.code === 0) {
        addMessage(`${savePath} に保存しました`);
        addMessage("\nReady");
        setSavedFile(savePath);
      } else {
        addMessage(`処理はコード${data.code}で失敗しました`, COLOR_ERR);
      }
    });
    command.stdout.on("data", (line) => addMessage(line));
    command.stderr.on("data", (line) => addMessage(line, COLOR_ERR));

    addMessage("処理を開始します");
    command.spawn();
  }

  async function handleRelaunch() {
    await relaunch();
  }

  async function handleReset() {
    const confirmed = await confirm(
      "設定をリセットして再起動します。\r\nよろしいですか？",
      { type: "warning" }
    );
    if (confirmed) {
      try {
        await removeConfig();
      } catch (e) {
        debug(e);
        console.log(e);
        addMessage("設定ディレクトリの削除に失敗しました", COLOR_ERR);
        return;
      }
      const dataDir = await appDataDir();
      if ((await dirExists(dataDir)) === true) {
        try {
          await removeDir("", { dir: BaseDirectory.AppData, recursive: true });
        } catch (e) {
          debug(e);
          console.log(e);
          addMessage("データディレクトリの削除に失敗しました", COLOR_ERR);
          return;
        }
      }
      // 再起動
      await relaunch();
    }
  }

  async function openFile() {
    const command = new Command(CMD, [ARG, `${START} "${savedFile}"`]).on(
      "close",
      (data) => {
        if (data.code !== 0) {
          addMessage(`処理はコード${data.code}で失敗しました`, COLOR_ERR);
        }
      }
    );
    command.stdout.on("data", (line) => addMessage(line));
    command.stderr.on("data", (line) => addMessage(line, COLOR_ERR));

    command.spawn();
  }

  function shellExecute(command: string, options?: SpawnOptions) {
    debug(`> ${command}`);
    return new Command(CMD, [ARG, command], options).execute();
  }

  function showOutput(output: ChildProcess) {
    addMessage(output.stdout);
    if (output.code !== 0) {
      addMessage(`setup failed with code ${output.code}`, COLOR_ERR);
      addMessage(output.stderr, COLOR_ERR);
    }
  }

  function debug(output: string | ChildProcess) {
    if (config.current.debug) {
      if (typeof output === "string") {
        addMessage(output, COLOR_DBG);
      } else {
        addMessage(`command has finished with code ${output.code}`, COLOR_DBG);
        addMessage(output.stdout, COLOR_DBG);
        if (output.code !== 0) {
          addMessage(`setup failed with code ${output.code}`, COLOR_ERR);
          addMessage(output.stderr, COLOR_ERR);
        }
      }
    }
  }

  function doSetup() {
    return new Promise(async function (resolve, reject) {
      // APPDATADIRを作成
      const dataDir = await appDataDir();
      if ((await dirExists(dataDir)) === false) {
        try {
          await createDir(dataDir, { recursive: true });
        } catch (e) {
          setErrorContent(
            <p>
              ディレクトリの作成に失敗しました
              <br />
              {`${dataDir}`}
            </p>
          );
          return reject(false);
        }
      }

      // .venvがあるか
      const venvDir = await join(dataDir, ".venv");
      if ((await dirExists(venvDir)) === false) {
        // 無いので作成

        // まずはPythonのパスを取得するところから
        let pythonPath = "";
        let pythonVer = 0.0;
        for (let py of ["python", "python3"]) {
          // Pythonのパスを取得する
          const output = await shellExecute(`${WHERE} ${py}`);
          debug(output);
          if (output.code === 0) {
            for (let path of output.stdout.split("\n")) {
              // Pythonのバージョンを取得する
              path = path.replace("\r", "").replace("\n", "");
              const output = await shellExecute(`"${path}" -V`);
              debug(output);
              if (output.code === 0) {
                const matches = output.stdout.match(/(\d+(\.\d+)?)/);
                if (matches) {
                  debug(JSON.stringify(matches));
                  const ver = parseFloat(matches[0]);
                  if (ver > pythonVer) {
                    pythonVer = ver;
                    pythonPath = path;
                  }
                }
              }
            }
          }
        }
        // Windowsならpy.exeも試してみる
        if (!pythonPath) {
          const output = await shellExecute(`"py -3 -V`);
          debug(output);
          if (output.code === 0) {
            pythonPath = "py -3";
          }
        }

        if (!pythonPath) {
          setErrorContent(<p>Pythonがインストールされていないようです。</p>);
          return reject(false);
        }

        debug(`${pythonPath}を使用します`);
        // .venvを作成
        const output = await shellExecute(`"${pythonPath}" -m venv .venv`, {
          cwd: dataDir,
        });
        debug(output);
        if (output.code !== 0) {
          return reject(false);
        }
      }

      // パッケージのインストールなどはスクリプトで
      const scriptPath = await resolveResource(`setup.${SCRIPT_EXT}`);
      debug(`> ${scriptPath}`);
      let setupCode = undefined;
      const command = new Command(CMD, [ARG, `"${scriptPath}"`], {
        cwd: dataDir,
      }).on("close", (data) => {
        setupCode = data.code;
        if (data.code === 0) {
          setOverlayShows("none");
          addMessage("\nReady");
        } else {
          setOverlayShows("children");
          addMessage(`setup failed with code ${data.code}`, COLOR_ERR);
        }
      });
      command.stdout.on("data", (line) => addMessage(line));
      command.stderr.on("data", (line) => addMessage(line, COLOR_ERR));

      command.spawn();
      resolve(true);
    });
  }

  useEffect(() => {
    const f = async () => {
      // スピナー表示
      setOverlayShows("spinner");

      // 設定を読み込み
      config.current = await loadConfig();

      // バージョン等表示
      addMessage(await getVersionString());

      // セットアップ実行
      doSetup().catch((err) => setOverlayShows("children"));
    };

    if (!didEffect.current) {
      f();
    }

    return () => {
      didEffect.current = true;
    };
  }, []);

  return (
    <>
      <Overlay show={overlayShows}>
        <div className={`text-3xl mb-4 ${COLOR_ERR}`}>
          動作に必要な環境を準備できませんでした。
          {errorContent}
        </div>
        <div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleRelaunch}
          >
            アプリケーションを再起動
          </button>
        </div>
      </Overlay>
      <div className="py-2 px-4 h-full flex flex-col">
        <div className="py-2 flex flex-col">
          <label htmlFor="input-pdf" className="form-label">
            変換するPDFファイル
          </label>
          <input
            type="text"
            name="input-pdf"
            className="form-control"
            value={inputPdf}
            onChange={handleChangeInputPdf}
          />
          <div className="mt-2 flex items-center">
            <button
              className="btn btn-primary mr-8"
              type="button"
              onClick={selectInputPdf}
            >
              選択
            </button>

            <input
              className="form-check-input"
              type="radio"
              value="left"
              name="direction"
              id="openLeft"
              onChange={handleChangeOpenDirection}
              checked={"left" == openDirection}
            />
            <label className="form-check-label" htmlFor="openLeft">
              左開き
            </label>

            <input
              className="form-check-input ml-4"
              type="radio"
              value="right"
              name="direction"
              id="openRight"
              onChange={handleChangeOpenDirection}
              checked={"right" == openDirection}
            />
            <label className="form-check-label" htmlFor="openRight">
              右開き
            </label>
          </div>
        </div>

        <div className="py-8 flex flex-col">
          <div className="flex justify-center">
            <button
              className="btn btn-primary"
              type="button"
              onClick={doSaddleStitch}
              disabled={inputPdf.length == 0}
            >
              製本レイアウトに変換
            </button>
          </div>
          {savedFile.length > 0 && (
            <div className="flex justify-center mt-2">
              <a href="#" onClick={openFile}>
                ファイルを開く
              </a>
            </div>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex">
          <button
            className="btn btn-danger btn-sm"
            type="button"
            onClick={handleReset}
          >
            設定をリセット
          </button>
        </div>
      </div>
    </>
  );
};
