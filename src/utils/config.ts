import { getVersion } from "@tauri-apps/api/app";
import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  removeDir,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { dirExists } from ".";

const CONF_FILENAME = "saddlestitcher.conf.json";
const CONF_OPTION = { dir: BaseDirectory.AppConfig };

export interface Config {
  debug: boolean;
}

export async function getConfigDefault(): Promise<Config> {
  return {
    debug: true,
  };
}

export async function loadConfig(): Promise<Config> {
  let config = await getConfigDefault();
  if (await exists(CONF_FILENAME, CONF_OPTION)) {
    const contents = await readTextFile(CONF_FILENAME, CONF_OPTION);
    config = { ...config, ...JSON.parse(contents) } as Config;
  } else {
    await writeConfig(config);
  }
  return config;
}

export async function writeConfig(config: Config): Promise<void> {
  const configDir = await appConfigDir();
  if ((await dirExists(configDir)) === false) {
    try {
      await createDir(configDir, { recursive: true });
    } catch (e) {
      throw e;
    }
  }
  await writeTextFile(
    CONF_FILENAME,
    JSON.stringify(config, null, "\t"),
    CONF_OPTION
  );
}

export async function removeConfig(): Promise<void> {
  const configDir = await appConfigDir();
  if ((await dirExists(configDir)) === true) {
    try {
      await removeDir("", { ...CONF_OPTION, recursive: true });
    } catch (e) {
      throw e;
    }
  }
}
