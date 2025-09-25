import { BrowserWindow } from 'electron';
import path from 'path';
import { hijackMainConsole } from './console';

// Mantém uma referência global à janela das ferramentas para evitar que seja coletada pelo garbage collector.
let toolsWindow: BrowserWindow | null = null;

/**
 * Cria e exibe a janela que conterá a UI das ferramentas de desenvolvimento.
 */
function createToolsWindow(): BrowserWindow {
  toolsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Electron DevTools',
    webPreferences: {
      // O script de preload é essencial para a comunicação segura entre este processo (main)
      // e o processo de renderização da nossa janela de ferramentas.
      preload: path.join(__dirname, '../preload/index.js'),
      // É recomendado manter o contextIsolation e desativar o nodeIntegration
      // por motivos de segurança, mesmo para uma janela de ferramentas.
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Carrega o arquivo HTML da nossa UI de ferramentas.
  // No desenvolvimento, podemos apontar para um servidor de desenvolvimento (ex: Vite, Webpack Dev Server).
  // Para a versão final, carregaremos um arquivo estático.
  // Por enquanto, vamos simular o carregamento de um arquivo que estará em 'dist/renderer/index.html'.
  // NOTA: Precisaremos criar este arquivo HTML.
  const rendererPath = path.join(__dirname, '../renderer/index.html');
  toolsWindow.loadFile(rendererPath);

  // Limpa a referência da janela quando ela for fechada.
  toolsWindow.on('closed', () => {
    toolsWindow = null;
  });

  // Opcional: Abre o DevTools do Chromium para depurar a nossa própria ferramenta.
  toolsWindow.webContents.openDevTools();

  return toolsWindow;
}

/**
 * Inicializa o conjunto de ferramentas de desenvolvimento do Electron.
 * Esta é a função principal que será exportada pelo pacote.
 */
export function initializeDevTools(): void {
  // Se a janela de ferramentas já estiver aberta, foque nela em vez de criar uma nova.
  if (toolsWindow) {
    toolsWindow.focus();
    return;
  }

  // 1. Cria a janela que vai abrigar a UI das ferramentas.
  const window = createToolsWindow();

  // 2. Inicia os "hijackers" e monitores, passando a referência da janela.
  // Por enquanto, apenas o console do processo principal.
  hijackMainConsole(window);

  // Futuramente, outras inicializações virão aqui:
  // hijackMainIpc(window);
  // startMainPerformanceMonitor(window);
}
