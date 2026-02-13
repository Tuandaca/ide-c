use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Compiler {
    pub name: String,
    pub version: String,
    pub path: String,
    pub compiler_type: String, // "gcc", "clang", "msvc"
}

#[tauri::command]
pub fn get_compilers() -> Vec<Compiler> {
    let mut compilers = Vec::new();

    // Check for GCC
    if let Some(gcc) = detect_gcc() {
        compilers.push(gcc);
    }

    // Check for Clang
    if let Some(clang) = detect_clang() {
        compilers.push(clang);
    }

    // Check for MSVC (cl.exe)
    if let Some(msvc) = detect_msvc() {
        compilers.push(msvc);
    }

    compilers
}

fn detect_gcc() -> Option<Compiler> {
    // Try to run "gcc --version"
    match Command::new("gcc").arg("--version").output() {
        Ok(output) => {
            if output.status.success() {
                let version_out = String::from_utf8_lossy(&output.stdout);
                // First line usually contains version: "gcc (MinGW.org GCC-6.3.0-1) 6.3.0"
                let first_line = version_out.lines().next().unwrap_or("Unknown version");
                
                return Some(Compiler {
                    name: "GCC".to_string(),
                    version: first_line.to_string(),
                    path: "gcc".to_string(), // In PATH
                    compiler_type: "gcc".to_string(),
                });
            }
        }
        Err(_) => {} // Not found
    }
    None
}

fn detect_clang() -> Option<Compiler> {
    match Command::new("clang").arg("--version").output() {
        Ok(output) => {
            if output.status.success() {
                let version_out = String::from_utf8_lossy(&output.stdout);
                 // "clang version 12.0.0..."
                let first_line = version_out.lines().next().unwrap_or("Unknown version");
                
                return Some(Compiler {
                    name: "Clang".to_string(),
                    version: first_line.to_string(),
                    path: "clang".to_string(),
                    compiler_type: "clang".to_string(),
                });
            }
        }
        Err(_) => {}
    }
    None
}

fn detect_msvc() -> Option<Compiler> {
    // MSVC is tricky. It writes banner to stderr usually, and requires specific flags to not complain about no input.
    // "cl" with no args prints banner.
    match Command::new("cl").output() {
        Ok(output) => {
             // Even if it errors (due to no input file), it might print version info.
             // MSVC usually exits with non-zero if no file, but we check if we got output.
             let out = String::from_utf8_lossy(&output.stderr); // MSVC banners often on stderr
             if out.contains("Microsoft (R) C/C++ Optimizing Compiler") {
                 let first_line = out.lines().next().unwrap_or("Unknown version");
                 return Some(Compiler {
                     name: "MSVC".to_string(),
                     version: first_line.to_string(),
                     path: "cl".to_string(),
                     compiler_type: "msvc".to_string(),
                 });
             }
        }
        Err(_) => {}
    }
    None
}
