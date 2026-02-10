# 🖥️ IDE-C

> A Modern, Lightweight C/C++ Integrated Development Environment

**Developed by:** Tuandaca (Ngô Anh Tuấn)  
**Project Type:** Desktop IDE / Developer Tools  
**Status:** In Development (Phase 4 - IDE Shell Implementation)

---

## 📖 Về Dự Án

**IDE-C** là một môi trường phát triển tích hợp (IDE) hiện đại, nhẹ và mạnh mẽ được thiết kế đặc biệt cho lập trình C/C++. Dự án hướng đến việc tạo ra một công cụ phát triển nhanh, an toàn và dễ mở rộng, phù hợp cho cả người mới học và lập trình viên chuyên nghiệp.

### 🎯 Mục Đích

- Cung cấp một IDE nhẹ, khởi động nhanh cho lập trình C/C++
- Tích hợp đầy đủ các công cụ cần thiết: editor, compiler, debugger
- Hỗ trợ hệ thống plugin an toàn và dễ mở rộng
- Tối ưu hiệu năng và bảo mật so với các IDE truyền thống

### 🎯 Mục Tiêu

1. **Hiệu năng cao:** Binary size nhỏ (< 10MB), khởi động nhanh (< 1s)
2. **Bảo mật:** Plugin system với capability-based security, WebWorker isolation
3. **Trải nghiệm tốt:** Code editor mạnh mẽ với LSP, syntax highlighting, autocomplete
4. **Mở rộng dễ dàng:** Plugin API cho phép tùy chỉnh và mở rộng chức năng
5. **Cross-platform:** Hỗ trợ Windows, macOS, Linux

---

## 🛠️ Tech Stack

| Component | Technology | Lý Do Chọn |
|-----------|------------|------------|
| **Desktop Shell** | Tauri 2.x (Rust) | Binary nhỏ gọn (10x nhỏ hơn Electron), bảo mật cao |
| **Frontend** | React 19 + TypeScript | Modern, type-safe, ecosystem mạnh |
| **Code Editor** | Monaco Editor | Battle-tested từ VSCode, hỗ trợ LSP đầy đủ |
| **State Management** | Zustand + Immer | Đơn giản, hiệu năng cao, TypeScript-friendly |
| **Build System** | pnpm + Turborepo | Monorepo, fast builds, shared packages |
| **Styling** | CSS Variables + Design Tokens | Themeable, maintainable, no runtime overhead |

---

## 🏗️ Kiến Trúc & Hướng Phát Triển

### Monorepo Structure

```
ide-c/
├── apps/
│   └── desktop/          # Tauri desktop application
├── packages/
│   ├── theme/            # Design tokens, CSS variables
│   ├── shared/           # Common types, utilities
│   └── ui/               # Reusable UI components
└── tools/                # Build tools, scripts
```

### Các Phase Phát Triển

#### ✅ Phase 1-3: Foundation (Hoàn thành)
- Thiết kế kiến trúc và tech stack
- Setup monorepo với pnpm workspace + Turborepo
- Tạo Tauri desktop app
- Xây dựng shared packages (theme, shared, ui)
- Tích hợp design system và build pipeline

#### 🚀 Phase 4: IDE Shell (Đang thực hiện)
- Layout chuyên nghiệp (sidebar, editor, menu, status bar)
- Tích hợp Monaco Editor với C/C++ syntax highlighting
- File explorer với tree view
- Tab management cho multiple files
- Tauri file system integration

#### 📋 Phase 5-6: Planned
- C/C++ Compiler integration (GCC/Clang)
- Build & Run functionality
- Terminal integration
- Extension/Plugin system foundation
- LSP integration cho IntelliSense
- Debugger integration

---

## 🔒 Plugin System Requirements

**Bảo mật là ưu tiên hàng đầu.** Hệ thống plugin được thiết kế với các yêu cầu bắt buộc:

- ✅ **WebWorker Isolation:** Plugin chạy trong WebWorker riêng biệt
- ✅ **Capability-based API:** Plugin chỉ truy cập các API được cấp phép
- ✅ **No Direct Native Access:** Không cho phép gọi native code trực tiếp
- ✅ **Manifest + Versioning:** Mỗi plugin phải có manifest rõ ràng

---

## 📦 Cài Đặt & Sử Dụng

> 🚧 **Coming Soon:** Hướng dẫn cài đặt sẽ được cập nhật khi dự án phát hành phiên bản alpha.

### Yêu Cầu Hệ Thống

- **Node.js:** >= 22.x
- **pnpm:** >= 10.x
- **Rust:** >= 1.93.0 (cho Tauri)
- **MSVC Build Tools** (Windows) hoặc tương đương (macOS/Linux)

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ide-c.git
cd ide-c

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build desktop app
pnpm build
```

---

## 🤝 Đóng Góp

Dự án hiện đang trong giai đoạn phát triển ban đầu. Mọi đóng góp, ý tưởng và phản hồi đều được hoan nghênh!

---

## 📄 License

MIT License - Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 🔗 Liên Hệ

**Developer:** Tuandaca (Ngô Anh Tuấn)  
**GitHub:** [Tuandaca/ide-c](https://github.com/Tuandaca/ide-c)

---

*Built with ❤️ by Tuandaca*
