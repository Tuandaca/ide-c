use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize)]
pub struct FileEntry {
    name: String,
    path: String,
    is_dir: bool,
    children: Option<Vec<FileEntry>>,
}

/// Read file contents as string
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

/// Write content to file
#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file: {}", e))
}

/// Read directory structure recursively
#[tauri::command]
fn read_dir_recursive(path: String, max_depth: Option<usize>) -> Result<Vec<FileEntry>, String> {
    let max_depth = max_depth.unwrap_or(5); // Default max depth
    read_dir_impl(&path, 0, max_depth)
        .map_err(|e| format!("Failed to read directory: {}", e))
}

fn read_dir_impl(path: &str, current_depth: usize, max_depth: usize) -> Result<Vec<FileEntry>, std::io::Error> {
    if current_depth >= max_depth {
        return Ok(Vec::new());
    }

    let entries = fs::read_dir(path)?;
    let mut result = Vec::new();

    for entry in entries {
        let entry = entry?;
        let path_buf = entry.path();
        let is_dir = path_buf.is_dir();
        
        // Skip hidden files/folders (starting with .)
        if let Some(name) = path_buf.file_name() {
            if name.to_string_lossy().starts_with('.') {
                continue;
            }
        }

        let name = path_buf
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        let path_str = path_buf.to_string_lossy().to_string();

        let children = if is_dir {
            // Recursively read subdirectories
            match read_dir_impl(&path_str, current_depth + 1, max_depth) {
                Ok(children) => Some(children),
                Err(_) => Some(Vec::new()), // Skip directories we can't read
            }
        } else {
            None
        };

        result.push(FileEntry {
            name,
            path: path_str,
            is_dir,
            children,
        });
    }

    // Sort: directories first, then files, alphabetically
    result.sort_by(|a, b| {
        match (a.is_dir, b.is_dir) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });

    Ok(result)
}

/// Open native file picker dialog
#[tauri::command]
async fn open_file_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri::Manager;
    
    let file_path = tauri::async_runtime::spawn(async move {
        rfd::AsyncFileDialog::new()
            .add_filter("C/C++ Files", &["c", "cpp", "h", "hpp"])
            .add_filter("All Files", &["*"])
            .pick_file()
            .await
    })
    .await
    .map_err(|e| format!("Failed to open file dialog: {}", e))?;

    Ok(file_path.map(|f| f.path().to_string_lossy().to_string()))
}

/// Open native folder picker dialog
#[tauri::command]
async fn open_folder_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    use tauri::Manager;
    
    let folder_path = tauri::async_runtime::spawn(async move {
        rfd::AsyncFileDialog::new()
            .pick_folder()
            .await
    })
    .await
    .map_err(|e| format!("Failed to open folder dialog: {}", e))?;

    Ok(folder_path.map(|f| f.path().to_string_lossy().to_string()))
}

/// Open native save file dialog
#[tauri::command]
async fn save_file_dialog(app: tauri::AppHandle, default_name: Option<String>) -> Result<Option<String>, String> {
    use tauri::Manager;
    
    let file_path = tauri::async_runtime::spawn(async move {
        let mut dialog = rfd::AsyncFileDialog::new()
            .add_filter("C Files", &["c", "h"])
            .add_filter("C++ Files", &["cpp", "hpp"])
            .add_filter("All Files", &["*"]);
        
        if let Some(name) = default_name {
            dialog = dialog.set_file_name(&name);
        }
        
        dialog.save_file().await
    })
    .await
    .map_err(|e| format!("Failed to open save dialog: {}", e))?;

    Ok(file_path.map(|f| f.path().to_string_lossy().to_string()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_file,
            write_file,
            read_dir_recursive,
            open_file_dialog,
            open_folder_dialog,
            save_file_dialog,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
