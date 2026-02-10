import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button, Input } from "@ide-c/ui";
import { formatBytes } from "@ide-c/shared";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1>🚀 IDE-C</h1>
      <p className="subtitle">Modern Desktop IDE built with Tauri + React</p>

      <div className="demo-section">
        <h2>🎨 Theme & UI Components Demo</h2>

        <div className="component-demo">
          <h3>Buttons</h3>
          <div className="button-group">
            <Button variant="primary" size="sm">Small Primary</Button>
            <Button variant="primary" size="md">Medium Primary</Button>
            <Button variant="primary" size="lg">Large Primary</Button>
          </div>
          <div className="button-group">
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>

        <div className="component-demo">
          <h3>Inputs</h3>
          <Input
            label="Your Name"
            placeholder="Enter your name..."
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="example@email.com"
          />
          <Input
            label="Error Example"
            error="This field is required"
            placeholder="This has an error..."
          />
        </div>

        <div className="component-demo">
          <h3>Utilities Demo</h3>
          <p>Format bytes: {formatBytes(1024)} | {formatBytes(1048576)} | {formatBytes(1073741824)}</p>
        </div>

        <div className="component-demo">
          <h3>Tauri Integration</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
          >
            <Input
              label="Test Rust Backend"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Enter a name..."
            />
            <Button type="submit" variant="primary">
              Greet from Rust
            </Button>
          </form>
          {greetMsg && <p className="greet-message">✅ {greetMsg}</p>}
        </div>
      </div>
    </main>
  );
}

export default App;
