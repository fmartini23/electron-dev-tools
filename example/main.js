// Módulos para controlar o ciclo de vida da aplicação e criar janelas.
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// --- PASSO 1: Importar o nosso pacote de dev-tools ---
// Em um projeto real, seria: require('electron-dev-tools')
// Aqui, importamos diretamente do nosso código-fonte compilado.
const { initializeDevTools } = require('../dist/index');

// Função para criar a janela principal da aplicação de exemplo.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Anexa o script de preload à janela da aplicação de exemplo.
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Carrega o index.html da aplicação de exemplo.
  mainWindow.loadFile('example/index.html');

  // Opcional: Abre o DevTools da aplicação de exemplo.
  // Útil para ver os logs do console do renderer diretamente.
  mainWindow.webContents.openDevTools({ mode: 'detach' });
}

// --- PASSO 2: Configurar a aplicação Electron ---

// Este método será chamado quando o Electron terminar a inicialização
// e estiver pronto para criar janelas do navegador.
app.whenReady().then(() => {
  createWindow();

  // --- PASSO 3: INICIALIZAR NOSSAS FERRAMENTAS! ---
  // É aqui que a mágica acontece. Chamamos a função exportada pelo nosso pacote.
  initializeDevTools();

  // Listener para o evento 'app-quit' que pode ser chamado pelo renderer.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Encerrar quando todas as janelas forem fechadas, exceto no macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- PASSO 4: Definir Handlers de IPC para Testes ---
// Precisamos deles para que nosso monitor de IPC tenha o que capturar.

// Listener para uma mensagem assíncrona (de ipcRenderer.send).
ipcMain.on('my-async-channel', (event, arg) => {
  console.log('✅ [main] Mensagem recebida em "my-async-channel":', arg);
  // Esta mensagem de log no processo 'main' deve aparecer no nosso console unificado!
});

// Handler para uma mensagem de requisição/resposta (de ipcRenderer.invoke).
ipcMain.handle('my-invoke-channel', async (event, arg) => {
  console.log('✅ [main] Requisição recebida em "my-invoke-channel" com argumento:', arg);
  // Simula um trabalho assíncrono, como uma chamada de banco de dados ou API.
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = `Resposta para ${arg} processada com sucesso!`;
  console.log('✅ [main] Enviando resposta:', response);
  return response;
});
