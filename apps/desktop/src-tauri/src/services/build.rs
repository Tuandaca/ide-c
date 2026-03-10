use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CompileResult {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
    pub output_path: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RunResult {
    pub exit_code: i32,
    pub stdout: String,
    pub stderr: String,
}

/// Compile a C/C++ source file using the specified compiler.
/// Output binary is placed next to the source file.
#[tauri::command]
pub fn compile_file(
    file_path: String,
    compiler_path: String,
    extra_args: Option<Vec<String>>,
) -> Result<CompileResult, String> {
    let source = Path::new(&file_path);

    if !source.exists() {
        return Err(format!("Source file not found: {}", file_path));
    }

    // Determine output path: same directory, same name but .exe (Windows)
    let stem = source
        .file_stem()
        .ok_or("Invalid file name")?
        .to_string_lossy();

    let output_path = source
        .parent()
        .unwrap_or(Path::new("."))
        .join(format!("{}.exe", stem));

    let output_str = output_path.to_string_lossy().to_string();

    // Build command: compiler <source> -o <output> [extra_args...]
    let mut cmd = Command::new(&compiler_path);
    cmd.arg(&file_path).arg("-o").arg(&output_str);

    // Add default warning flags
    cmd.arg("-Wall");

    // Add any extra args
    if let Some(args) = extra_args {
        for arg in args {
            cmd.arg(&arg);
        }
    }

    match cmd.output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();

            Ok(CompileResult {
                success: output.status.success(),
                stdout,
                stderr,
                output_path: output_str,
            })
        }
        Err(e) => Err(format!("Failed to execute compiler '{}': {}", compiler_path, e)),
    }
}

/// Run a compiled binary and capture its output.
#[tauri::command]
pub fn run_binary(binary_path: String) -> Result<RunResult, String> {
    let path = Path::new(&binary_path);

    if !path.exists() {
        return Err(format!("Binary not found: {}", binary_path));
    }

    match Command::new(&binary_path).output() {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout).to_string();
            let stderr = String::from_utf8_lossy(&output.stderr).to_string();
            let exit_code = output.status.code().unwrap_or(-1);

            Ok(RunResult {
                exit_code,
                stdout,
                stderr,
            })
        }
        Err(e) => Err(format!("Failed to run binary '{}': {}", binary_path, e)),
    }
}
