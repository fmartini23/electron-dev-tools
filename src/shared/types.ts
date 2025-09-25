/**
 * Define a estrutura de um único log que é capturado e exibido
 * no Console Unificado.
 */
export interface LogEntry {
    /** O nível do log (ex: 'log', 'warn', 'error'). */
    level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  
    /**
     * O conteúdo da mensagem de log. É um array de 'unknown' para suportar múltiplos
     * argumentos de qualquer tipo de forma segura (ex: console.log('User', userObject)).
     */
    payload: unknown[];
  
    /** Identifica o processo de origem do log ('main' ou o ID de um renderer). */
    process: 'main' | `renderer-${number}`;
  
    /** O timestamp ISO de quando o log foi criado. */
    timestamp: string;
  }
  
  /**
   * Define a estrutura de uma mensagem IPC que é interceptada e exibida
   * no Visualizador de IPC.
   */
  export interface IpcMessage {
    /** O canal IPC no qual a mensagem foi enviada. */
    channel: string;
  
    /** A direção da comunicação. */
    direction: 'renderer-to-main' | 'main-to-renderer';
  
    /**
     * O tipo de comunicação IPC:
     * - 'async': Mensagem "fire-and-forget" (ipcRenderer.send -> ipcMain.on).
     * - 'invoke-request': A requisição de um par 'invoke/handle'.
     * - 'invoke-response-success': A resposta de sucesso de um 'handle'.
     * - 'invoke-response-error': A resposta de erro de um 'handle'.
     */
    type: 'async' | 'invoke-request' | 'invoke-response-success' | 'invoke-response-error';
  
    /** O ID do processo de renderização que enviou ou recebeu a mensagem. */
    senderId: number;
  
    /** O conteúdo da mensagem IPC, representado como um array de 'unknown'. */
    payload: unknown[];
  
    /** O timestamp ISO de quando a mensagem foi interceptada. */
    timestamp: string;
  }
  
  /**
   * Define a estrutura dos dados de performance coletados dos processos.
   */
  export interface PerformanceData {
    /** Métricas de performance do processo principal. */
    main: {
      cpu: number; // Uso de CPU em porcentagem.
      memory: number; // Uso de memória em MB.
    };
  
    /** Métricas de performance do processo de renderização (da aplicação do usuário). */
    renderer: {
      cpu: number; // Uso de CPU em porcentagem.
      memory: number; // Uso de memória em MB.
    };
  
    /** O timestamp ISO de quando os dados foram coletados. */
    timestamp: string;
  }
  
  /**
   * Define a API que o script de preload expõe para o processo de renderização.
   * Esta interface será usada para dar tipos ao objeto `window.electronDevTools`.
   */
  export interface ElectronDevToolsApi {
    onLogReceived: (callback: (logEntry: LogEntry) => void) => () => void;
    onIpcMessageReceived: (callback: (ipcMessage: IpcMessage) => void) => () => void;
    onPerformanceDataReceived: (callback: (perfData: PerformanceData) => void) => () => void;
  }
  