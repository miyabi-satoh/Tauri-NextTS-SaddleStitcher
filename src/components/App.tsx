import { useEffect, useState } from "react";
import { basename, dirname, join, resourceDir } from "@tauri-apps/api/path";
import { open, save, confirm } from "@tauri-apps/api/dialog";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { arch, platform, type, version } from "@tauri-apps/api/os";
import { Command } from "@tauri-apps/api/shell";
import { relaunch } from "@tauri-apps/api/process";
import { exists } from "@tauri-apps/api/fs";
import { useMessageContext } from "./Console";

const windows = navigator.userAgent.includes("Windows");
const cmd = windows ? "cmd" : "sh";
const args = windows ? ["/C"] : ["-c"];
const script_ext = windows ? "bat" : "sh";
const start = windows ? "start" : "open";

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
    const dir = await dirname(inputPdf);
    const name = await basename(inputPdf);
    const newName = `(製本版)${name}`;
    const path = await join(dir, newName);
    const filePath = await save({
      defaultPath: newName,
    });

    if (filePath === null) {
      return;
    }

    addMessage(`入力=${inputPdf}`);
    addMessage(`出力=${filePath}`);
    setShowSpinner(true);
    const resourceDirPath = await resourceDir();
    const script = await join(resourceDirPath, `saddlestitch.${script_ext}`);
    const output = await new Command(cmd, [
      ...args,
      `"${script}" "${inputPdf}" "${filePath}"`,
    ]).execute();
    setShowSpinner(false);
    addMessage(output.stdout);
    if (output.code !== 0) {
      addMessage("");
      addMessage("エラーが発生しました。");
      addMessage(output.stderr);
    } else {
      addMessage("正常に終了しました。");
      setSavedFile(filePath);
    }
  }

  async function handleRelaunch() {
    await relaunch();
  }

  async function openFile() {
    await new Command(cmd, [...args, `${start} "${savedFile}"`]).execute();
  }

  const Ready = () => {
    if (isReady === undefined || showSpinner) {
      return (
        <div className="overlay">
          <div className="spinner" />
        </div>
      );
    }
    if (isReady === 0 || !showSpinner) {
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
      setInputPdf("");
      setSavedFile("");

      const appName = await getName();
      const appVersion = await getVersion();
      const tauriVersion = await getTauriVersion();
      const archName = await arch();
      const platformName = await platform();
      const osType = await type();
      const osVersion = await version();
      const resourceDirPath = await resourceDir();

      setMessages([]);
      addMessage(`${appName} v${appVersion} (Using Tauri v${tauriVersion})`);
      addMessage(
        `Running on ${osType}(${platformName}/${osVersion}) ${archName}`
      );
      addMessage(`ResourceDir=${resourceDirPath}`);

      const script = await join(resourceDirPath, `setup.${script_ext}`);
      // addMessage(setup);
      const output = await new Command(cmd, [...args, `"${script}"`]).execute();
      addMessage(output.stdout);
      // addMessage(`setup exit ${output.code}`);
      setIsReady(output.code);
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
