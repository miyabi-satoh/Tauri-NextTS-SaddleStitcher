#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;

const CONF_FILENAME: &str = "saddlestitcher.conf.json";

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let mut config_path = app
        .path_resolver()
        .app_config_dir()
        .expect("failed to resolve app config dir");
      config_path.push(CONF_FILENAME);
      if !config_path.exists() {
        let src_path = app
          .path_resolver()
          .resolve_resource(CONF_FILENAME)
          .expect("failed to resolve config file");
        fs::copy(src_path, config_path);
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
