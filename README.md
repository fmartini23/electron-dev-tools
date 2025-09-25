# Electron DevTools  

[![NPM Version](https://img.shields.io/npm/v/electron-dev-tools.svg)](https://www.npmjs.com/package/electron-dev-tools)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  

**TypeScript**  

`electron-dev-tools` is an advanced development and debugging toolkit designed specifically for the multi-process environment of Electron. It provides a unified interface to monitor, profile, and debug your application, helping you build more robust and performant Electron apps, faster.  

> **Note:** Replace this with an actual screenshot of your tool once it's running!  

---

## 🚀 Why electron-dev-tools?  

Debugging Electron applications can be challenging. Logs are scattered between the main process terminal and the renderer's DevTools, IPC messages are invisible, and performance bottlenecks are hard to pinpoint.  

This toolkit solves these problems by providing a single, powerful window with **deep insights** into your application's behavior.  

---

## ✨ Features  

- **Unified Console:** View logs from the main process and all renderer processes in a single, real-time, color-coded console.  
- **Live IPC Monitor:** Visualize all Inter-Process Communication (IPC) messages (`ipcMain`, `ipcRenderer`) as they happen. See the channel, direction, payload, and communication type (`send`, `invoke`).  
- **Performance Profiler (Coming Soon):** Real-time CPU and memory usage charts, distinguishing between main and renderer processes.  
- **System Simulator (Coming Soon):** Tools to simulate adverse conditions like network loss, high latency, or system power states.  

---

## 📦 Installation  

Install the package as a development dependency in your Electron project:  

```bash
npm install --save-dev electron-dev-tools
```

---

## ⚡ Usage  

Integrating **electron-dev-tools** is designed to be as simple as possible.  

1. Import the toolkit in your main process file (e.g., `main.js` or `main.ts`).  
2. Call `initializeDevTools()` after your application is ready and you have created your main window.  
3. It's best to call it **only during development**.  

### Example (`main.js`)  

```javascript
const { app, BrowserWindow } = require('electron');

// 1. Import the toolkit
const { initializeDevTools } = require('electron-dev-tools');

function createWindow() {
  const mainWindow = new BrowserWindow({
    // ... your window options
  });
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  // 2. Initialize the dev tools
  if (process.env.NODE_ENV !== 'production') {
    initializeDevTools();
  }
});
```

When you run your Electron app in **development mode**, a new **Electron DevTools** window will automatically open alongside your application, ready to capture logs and IPC messages.  

---

## 🛠️ How It Works  

- The toolkit works by securely *monkey-patching* standard Electron and Node.js modules like `console` and `ipcMain`.  
- When you call `initializeDevTools()`, it spawns a new `BrowserWindow`.  
- It overrides `console.log`, `ipcMain.on`, etc., with custom versions.  
- These custom versions forward calls to the original methods **and** send a structured copy of the event data to the DevTools window via a dedicated IPC channel.  
- The DevTools window (built with **React**) receives this data and renders it in a user-friendly interface.  

This process is designed to be **safe** and have a **minimal performance impact** during development.  

---

## 🧑‍💻 Development & Contribution  

We’d love your contributions!  

### 📂 Project Structure  

- `src/main/`: Main process logic (hijacking `console` and `ipcMain`).  
- `src/renderer/`: React-based UI for the DevTools window.  
- `src/renderer/components/`: UI panels (Console, IPC, etc.).  
- `src/preload/`: Preload script bridging main ↔ renderer.  
- `src/shared/`: Shared TypeScript types and interfaces.  
- `example/`: Minimal Electron app for testing/demonstration.  

### 🔧 Running Locally  

Clone the repository:  

```bash
git clone https://github.com/fmartini23/electron-dev-tools.git
cd electron-dev-tools
```

Install dependencies:  

```bash
npm install
```

Start the development server:  

```bash
npm run dev
```

This will:  
- Compile the TypeScript code  
- Launch the example Electron app with DevTools attached  
- Watch for file changes and reload automatically  

---

## 📜 License  

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  
