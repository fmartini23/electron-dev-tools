import { contextBridge, ipcRenderer } from 'electron';
import { LogEntry, IpcMessage } from '../shared/types';

// O nome da API que será exposta no objeto 'window' do renderer.
// Ex: window.electronDevTools.onLogReceived(...)
const apiKey = 'electronDevTools';

/**
 * A API que será exposta ao processo de renderização.
 * Note que estamos expondo apenas as funcionalidades necessárias, e não o ipcRenderer inteiro.
 * Isso é uma prática de segurança crucial chamada "Context Isolation".
 */
const api = {
  // --- Comunicação para Logs ---

  /**
   * Registra uma função de callback para ser chamada sempre que um novo log for recebido.
   * @param callback A função que receberá o objeto de log.
   * @returns Uma função para remover o listener e evitar vazamentos de memória.
   */
  onLogReceived: (callback: (logEntry: LogEntry) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, logEntry: LogEntry) => {
      callback(logEntry);
    };
    // Escuta no canal 'dev-tools-log' que definimos no 'src/main/console.ts'.
    ipcRenderer.on('dev-tools-log', listener);

    // Retorna uma função de limpeza que pode ser chamada quando o componente da UI for desmontado.
    return () => {
      ipcRenderer.removeListener('dev-tools-log', listener);
    };
  },

  // --- Comunicação para Mensagens IPC ---

  /**
   * Registra uma função de callback para ser chamada sempre que uma mensagem IPC for interceptada.
   * @param callback A função que receberá o objeto da mensagem IPC.
   * @returns Uma função para remover o listener.
   */
  onIpcMessageReceived: (callback: (ipcMessage: IpcMessage) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, ipcMessage: IpcMessage) => {
      callback(ipcMessage);
    };
    // Escuta no canal 'dev-tools-ipc-message' que definimos no 'src/main/ipc-monitor.ts'.
    ipcRenderer.on('dev-tools-ipc-message', listener);

    // Retorna a função de limpeza.
    return () => {
      ipcRenderer.removeListener('dev-tools-ipc-message', listener);
    };
  },
};

/**
 * Usa o contextBridge para expor a API de forma segura ao processo de renderização.
 * A API estará disponível em `window.electronDevTools`.
 */
try {
  contextBridge.exposeInMainWorld(apiKey, api);
} catch (error) {
  console.error('Falha ao expor a API de preload:', error);
}

// Para o TypeScript entender a nova API no objeto 'window' do renderer,
// precisaremos estender a interface global 'Window' em um arquivo de declaração (.d.ts).
