import { BrowserWindow } from 'electron';
import { LogEntry } from '../shared/types';

// Armazena as funções originais do console para que possamos usá-las.
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

// Define os tipos de log que vamos interceptar.
type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

/**
 * Intercepta os métodos do console no processo principal e envia os logs
 * para a janela de ferramentas de desenvolvimento.
 *
 * @param toolsWindow A instância de BrowserWindow da nossa UI de ferramentas.
 */
export function hijackMainConsole(toolsWindow: BrowserWindow): void {
  // Itera sobre cada nível de log que queremos sobrescrever.
  (Object.keys(originalConsole) as LogLevel[]).forEach((level) => {
    // Sobrescreve o método console[level] (ex: console.log).
    // CORREÇÃO: Os argumentos agora são do tipo 'unknown[]' em vez de 'any[]'.
    console[level] = (...args: unknown[]) => {
      // 1. Mantém o comportamento original: imprime o log no terminal.
      //    As funções originais do console aceitam 'unknown[]', então isso é seguro.
      originalConsole[level].apply(console, args);

      // 2. Prepara o objeto de log para ser enviado à UI.
      const logEntry: LogEntry = {
        level,
        // O payload agora é corretamente um 'unknown[]'.
        // O processo de serialização lida com os valores 'unknown'.
        payload: args.map((arg) => {
          try {
            // Tenta serializar. Se falhar (ex: referência circular), retorna uma string.
            return JSON.parse(JSON.stringify(arg));
          } catch (e) {
            return '[Unserializable Object]';
          }
        }),
        process: 'main', // Identifica que o log veio do processo 'main'.
        timestamp: new Date().toISOString(),
      };

      // 3. Envia o log para a janela de ferramentas via IPC.
      // Garante que a janela ainda exista e não tenha sido destruída.
      if (toolsWindow && !toolsWindow.isDestroyed()) {
        toolsWindow.webContents.send('dev-tools-log', logEntry);
      }
    };
  });
}
