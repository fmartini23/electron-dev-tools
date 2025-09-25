import { ipcMain, BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { IpcMessage } from '../shared/types';

// Armazena as implementações originais de ipcMain.
const originalIpcMain = {
  on: ipcMain.on.bind(ipcMain),
  handle: ipcMain.handle.bind(ipcMain),
};

/**
 * Envia uma mensagem IPC capturada para a janela de ferramentas.
 * @param toolsWindow A janela de ferramentas.
 * @param message O objeto de mensagem a ser enviado.
 */
function sendToToolsWindow(toolsWindow: BrowserWindow, message: IpcMessage) {
  if (toolsWindow && !toolsWindow.isDestroyed()) {
    toolsWindow.webContents.send('dev-tools-ipc-message', message);
  }
}

/**
 * Intercepta os métodos de 'ipcMain' para monitorar a comunicação IPC.
 *
 * @param toolsWindow A instância de BrowserWindow da nossa UI de ferramentas.
 */
export function hijackMainIpc(toolsWindow: BrowserWindow): void {
  // Sobrescreve ipcMain.on
  // CORREÇÃO: O listener agora aceita '...args: unknown[]'.
  ipcMain.on = (channel: string, listener: (event: IpcMainEvent, ...args: unknown[]) => void) => {
    return originalIpcMain.on(channel, (event, ...args) => {
      const message: IpcMessage = {
        channel,
        direction: 'renderer-to-main',
        type: 'async',
        senderId: event.sender.id,
        payload: args, // 'args' já é unknown[], o que corresponde ao nosso tipo IpcMessage.
        timestamp: new Date().toISOString(),
      };
      sendToToolsWindow(toolsWindow, message);

      // Chama o listener original do usuário.
      return listener(event, ...args);
    });
  };

  // Sobrescreve ipcMain.handle
  // CORREÇÃO: O listener agora aceita '...args: unknown[]' e retorna 'Promise<unknown> | unknown'.
  ipcMain.handle = (
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown> | unknown
  ) => {
    return originalIpcMain.handle(channel, async (event, ...args) => {
      const requestMessage: IpcMessage = {
        channel,
        direction: 'renderer-to-main',
        type: 'invoke-request',
        senderId: event.sender.id,
        payload: args,
        timestamp: new Date().toISOString(),
      };
      sendToToolsWindow(toolsWindow, requestMessage);

      try {
        // Chama o handler original do usuário e aguarda a resposta.
        const result = await listener(event, ...args);

        const responseMessage: IpcMessage = {
          channel,
          direction: 'main-to-renderer',
          type: 'invoke-response-success',
          senderId: event.sender.id,
          payload: [result], // 'result' é 'unknown', então [result] é 'unknown[]'.
          timestamp: new Date().toISOString(),
        };
        sendToToolsWindow(toolsWindow, responseMessage);

        return result;
      } catch (error) {
        const errorMessage: IpcMessage = {
          channel,
          direction: 'main-to-renderer',
          type: 'invoke-response-error',
          senderId: event.sender.id,
          // CORREÇÃO: Verifica se 'error' é uma instância de Error antes de acessar '.message'.
          // Isso é mais seguro do que assumir a estrutura do objeto de erro.
          payload: [error instanceof Error ? error.message : String(error)],
          timestamp: new Date().toISOString(),
        };
        sendToToolsWindow(toolsWindow, errorMessage);

        // Propaga o erro para o invocador original.
        throw error;
      }
    });
  };
}
