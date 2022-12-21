import { getVersion } from "@tauri-apps/api/app";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

const CONF_FILENAME = "saddlestitcher.conf.json";
const CONF_OPTION = { dir: BaseDirectory.AppConfig };

export interface Config {
  version: string;
  debug: boolean;
  python: string;
}

export async function readConfig(): Promise<Config> {
  const contents = await readTextFile(CONF_FILENAME, CONF_OPTION);
  if (contents) {
    return JSON.parse(contents) as Config;
  }
  return {
    version: await getVersion(),
    debug: false,
    python: "",
  } as Config;
}

export async function writeConfig(config: Config): Promise<void> {
  await writeTextFile(
    CONF_FILENAME,
    JSON.stringify(config, null, "\t"),
    CONF_OPTION
  );
}
