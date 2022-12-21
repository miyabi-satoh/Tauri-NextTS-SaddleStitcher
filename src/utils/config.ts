import { getVersion } from "@tauri-apps/api/app";
import {
  BaseDirectory,
  createDir,
  exists,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";

const CONF_FILENAME = "saddlestitcher.conf.json";
const CONF_OPTION = { dir: BaseDirectory.AppConfig };

export interface Config {
  version: string;
  debug: boolean;
}

export async function getConfigDefault(): Promise<Config> {
  return {
    version: await getVersion(),
    debug: false,
  };
}

export async function loadConfig(): Promise<Config> {
  let config = await getConfigDefault();
  if (await exists(CONF_FILENAME, CONF_OPTION)) {
    const contents = await readTextFile(CONF_FILENAME, CONF_OPTION);
    config = JSON.parse(contents) as Config;
  } else {
    await writeConfig(config);
  }
  return config;
}

export async function writeConfig(config: Config): Promise<void> {
  const configDir = await appConfigDir();
  try {
    await readDir(configDir);
  } catch (e) {
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
