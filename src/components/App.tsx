import { useEffect, useState } from "react";
import { basename } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/api/dialog";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { arch, platform, type, version } from "@tauri-apps/api/os";
import { relaunch } from "@tauri-apps/api/process";
import { useMessageContext } from "./Console";
import { invoke } from "@tauri-apps/api";

const DELAY = 10;

export const App = () => {
  const { setMessages, addMessage } = useMessageContext();
  const [inputPdf, setInputPdf] = useState<string>("");
  const [isReady, setIsReady] = useState(undefined);
  const [showSpinner, setShowSpinner] = useState(false);
  const [savedFile, setSavedFile] = useState("");

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
    }
  }

  const handleChangeInputPdf: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setInputPdf(event.target.value);
  };

  async function doSaddleStitch() {
    const name = await basename(inputPdf);
    const newName = `(製本版)${name}`;
    const filePath = await save({
      defaultPath: newName,
    });

    if (filePath === null) {
      return;
    }
    setShowSpinner(true);

    setTimeout(async () => {
      addMessage(`入力=${inputPdf}`);
      addMessage(`出力=${filePath}`);

      try {
        const output: string = await invoke("execute_saddlestitch", {
          inp: inputPdf,
          out: filePath,
        });
        addMessage(output);
        addMessage("正常に終了しました。");
        setSavedFile(filePath);
      } catch (err) {
        addMessage("");
        addMessage("エラーが発生しました。");
        addMessage(err as string);
      }
      setShowSpinner(false);
    }, DELAY);
  }

  async function handleRelaunch() {
    await relaunch();
  }

  async function openFile() {
    try {
      const output: string = await invoke("execute_open", {
        file: savedFile,
      });
      addMessage(output);
    } catch (err) {
      addMessage("");
      addMessage("エラーが発生しました。");
      addMessage(err as string);
    }
  }

  const Ready = () => {
    if (isReady === undefined || showSpinner) {
      return (
        <div className="overlay">
          <div className="spinner" />
        </div>
      );
    }
    if (isReady === true || !showSpinner) {
      return null;
    }
    return (
      <div className="overlay flex-col">
        <div className="text-3xl mb-4 text-red-600">
          動作に必要な環境を準備できませんでした。
        </div>
        <div>
          <button
            className="btn-primary"
            type="button"
            onClick={handleRelaunch}
          >
            アプリケーションを再起動
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    let ignore = false;

    const f = async () => {
      setIsReady(undefined);
      setInputPdf("");
      setSavedFile("");

      const appName = await getName();
      const appVersion = await getVersion();
      const tauriVersion = await getTauriVersion();
      const archName = await arch();
      const platformName = await platform();
      const osType = await type();
      const osVersion = await version();

      setMessages([]);
      addMessage(`${appName} v${appVersion} (Using Tauri v${tauriVersion})`);
      addMessage(
        `Running on ${osType}(${platformName}/${osVersion}) ${archName}`
      );

      setTimeout(async () => {
        try {
          const output: string = await invoke("execute_setup");
          addMessage(output);
          setIsReady(true);
        } catch (err) {
          addMessage(err as string);
          setIsReady(false);
        }
      }, DELAY);
    };

    if (!ignore) {
      f();
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Ready />
      <div className="py-2 px-4">
        <div className="py-2">
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
          <button
            className="btn-primary mt-2"
            type="button"
            onClick={selectInputPdf}
          >
            選択
          </button>
        </div>

        <div className="py-8 flex flex-col">
          <div className="flex justify-center">
            <button
              className="btn-primary"
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
      </div>
    </>
  );
};
