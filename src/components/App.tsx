import { useEffect, useRef, useState } from "react";
import { basename, resolveResource } from "@tauri-apps/api/path";
import { open, save } from "@tauri-apps/api/dialog";
import { relaunch } from "@tauri-apps/api/process";
import { Command } from "@tauri-apps/api/shell";
import { useMessageContext } from "./Console";
import { getVersionString } from "~/utils";
import { Overlay, OverlayShowType } from "./Overlay";

const WINDOWS = navigator.userAgent.includes("Windows");
const CMD = WINDOWS ? "cmd" : "sh";
const ARG = WINDOWS ? "/C" : "-c";
const SCRIPT_EXT = WINDOWS ? "bat" : "sh";
const START = WINDOWS ? "start" : "open";

type OpenDirection = "left" | "right";

export const App = () => {
  const didEffect = useRef(false);
  const { addMessage } = useMessageContext();
  const [inputPdf, setInputPdf] = useState("");
  const [savedFile, setSavedFile] = useState("");
  const [openDirection, setOpenDirection] = useState<OpenDirection>("left");
  const [overlayShows, setOverlayShows] = useState<OverlayShowType>("spinner");

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

    const scriptPath = await resolveResource(`saddlestitch.${SCRIPT_EXT}`);
    addMessage(`"${scriptPath}" "${inputPdf}" "${savePath}" ${openDirection}`);
    const command = new Command(CMD, [
      ARG,
      `"${scriptPath}" "${inputPdf}" "${savePath}" ${openDirection}`,
    ]).on("close", (data) => {
      setOverlayShows("none");
      if (data.code === 0) {
        addMessage(`${savePath} に保存しました`);
        addMessage("");
        addMessage("Ready");
        setSavedFile(savePath);
      } else {
        addMessage(`処理はコード${data.code}で失敗しました`, "text-red-600");
      }
    });
    command.stdout.on("data", (line) => addMessage(line));
    command.stderr.on("data", (line) => addMessage(line, "text-red-600"));

    addMessage("処理を開始します");
    command.spawn();
  }

  async function handleRelaunch() {
    await relaunch();
  }

  async function openFile() {
    const command = new Command(CMD, [ARG, `${START} "${savedFile}"`]).on(
      "close",
      (data) => {
        if (data.code !== 0) {
          addMessage(`処理はコード${data.code}で失敗しました`, "text-red-600");
        }
      }
    );
    command.stdout.on("data", (line) => addMessage(line));
    command.stderr.on("data", (line) => addMessage(line, "text-red-600"));

    command.spawn();
  }

  useEffect(() => {
    const f = async () => {
      setOverlayShows("spinner");
      addMessage(await getVersionString());

      const scriptPath = await resolveResource(`setup.${SCRIPT_EXT}`);
      const command = new Command(CMD, [ARG, `"${scriptPath}"`]).on(
        "close",
        (data) => {
          if (data.code === 0) {
            addMessage("Ready");
            setOverlayShows("none");
          } else {
            addMessage("Oops!", "text-red-600");
            addMessage(`setup failed with code ${data.code}`, "text-red-600");
            setOverlayShows("children");
          }
        }
      );
      command.stdout.on("data", (line) => addMessage(line));
      command.stderr.on("data", (line) => addMessage(line, "text-red-600"));

      command.spawn();
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
      </Overlay>
      <div className="py-2 px-4">
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
              className="btn-primary mr-8"
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
