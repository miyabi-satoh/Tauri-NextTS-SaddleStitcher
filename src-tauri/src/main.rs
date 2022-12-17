#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// use tauri::api::process::Command;

use std::process::Command;

cfg_if::cfg_if! {
  if #[cfg(target_os = "windows")] {
    const CMD: &'static str = "cmd";
    const ARG: &'static str = "/C";
    const SCRIPT_EXT: &'static str = "bat";
    const START: &'static str = "start";
  } else {
    const CMD: &'static str = "sh";
    const ARG: &'static str = "-c";
    const SCRIPT_EXT: &'static str = "sh";
    const START: &'static str = "open";
  }
}

#[tauri::command]
fn execute_setup(handle: tauri::AppHandle) -> Result<String, String> {
  let script_path = handle
    .path_resolver()
    .resolve_resource("setup")
    .expect("failed to resolve resource");
  let output = Command::new(CMD)
    .arg(ARG)
    .arg([&script_path.to_string_lossy().to_string(), SCRIPT_EXT].join("."))
    .output()
    .expect("failed to execute process");

  match output.status.code() {
    Some(0) => Ok(String::from_utf8(output.stdout).unwrap()),
    _ => Err(String::from_utf8(output.stdout).unwrap()),
  }
}

#[tauri::command]
fn execute_saddlestitch(
  handle: tauri::AppHandle,
  inp: String,
  out: String,
) -> Result<String, String> {
  let script_path = handle
    .path_resolver()
    .resolve_resource("saddlestitch")
    .expect("failed to resolve resource");

  let args = format!(
    "{} \"{}\" \"{}\"",
    [&script_path.to_string_lossy().to_string(), SCRIPT_EXT].join("."),
    inp,
    out
  );
  let output = Command::new(CMD)
    .arg(ARG)
    .arg(args)
    .output()
    .expect("failed to execute process");

  match output.status.code() {
    Some(0) => Ok(String::from_utf8(output.stdout).unwrap()),
    _ => Err(String::from_utf8(output.stdout).unwrap()),
  }
}

#[tauri::command]
fn execute_open(file: String) -> Result<String, String> {
  let args = format!("{} \"{}\"", START, file,);
  let output = Command::new(CMD)
    .arg(ARG)
    .arg(args)
    .output()
    .expect("failed to execute process");

  match output.status.code() {
    Some(0) => Ok("open file successfully".to_string()),
    _ => Err("failed to open file".to_string()),
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      execute_setup,
      execute_saddlestitch,
      execute_open
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
