import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { arch, platform, type, version } from "@tauri-apps/api/os";

export async function getVersionString() {
  const appName = await getName();
  const appVersion = await getVersion();
  const tauriVersion = await getTauriVersion();
  const archName = await arch();
  const platformName = await platform();
  const osType = await type();
  const osVersion = await version();

  return (
    `${appName} v${appVersion} (Using Tauri v${tauriVersion})\n` +
    `Running on ${osType}(${platformName}/${osVersion}) ${archName}`
  );
}
