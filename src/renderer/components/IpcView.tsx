import React, { useState, useEffect, useRef } from 'react';
import { IpcMessage } from '../../shared/types';

// Estilos inline para o componente.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: '14px',
    color: '#eee',
    backgroundColor: '#282a36', // Um fundo ligeiramente diferente do console
    padding: '10px',
    height: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  messageEntry: {
    display: 'flex',
    alignItems: 'flex-start',
    borderBottom: '1px solid #44475a',
    padding: '8px 2px',
  },
  timestamp: {
    color: '#888',
    marginRight: '10px',
    minWidth: '80px',
  },
  direction: {
    marginRight: '10px',
    minWidth: '30px',
    fontSize: '18px',
    textAlign: 'center',
  },
  channel: {
    color: '#8be9fd', // Ciano
    fontWeight: 'bold',
    marginRight: '10px',
  },
  type: {
    padding: '2px 6px',
    borderRadius: '4px',
    marginRight: '10px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  payload: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    backgroundColor: '#222',
    padding: '5px',
    borderRadius: '4px',
    flex: 1,
  },
  // Estilos para tipos de mensagem
  typeAsync: { backgroundColor: '#50fa7b', color: '#222' }, // Verde
  typeInvokeRequest: { backgroundColor: '#ffb86c', color: '#222' }, // Laranja
  typeInvokeResponseSuccess: { backgroundColor: '#50fa7b', color: '#222' }, // Verde
  typeInvokeResponseError: { backgroundColor: '#ff5555', color: '#222' }, // Vermelho
};

/**
 * Renderiza um único item de mensagem IPC.
 */
const IpcItem: React.FC<{ message: IpcMessage }> = ({ message }) => {
  const directionIcon = message.direction === 'renderer-to-main' ? '→' : '←';
  const directionColor = message.direction === 'renderer-to-main' ? '#ffb86c' : '#bd93f9'; // Laranja / Roxo

  const typeStyleMap = {
    async: styles.typeAsync,
    'invoke-request': styles.typeInvokeRequest,
    'invoke-response-success': styles.typeInvokeResponseSuccess,
    'invoke-response-error': styles.typeInvokeResponseError,
  };

  return (
    <div style={styles.messageEntry}>
      <span style={styles.timestamp}>{new Date(message.timestamp).toLocaleTimeString()}</span>
      <span style={{ ...styles.direction, color: directionColor }} title={message.direction}>
        {directionIcon}
      </span>
      <span style={styles.channel}>{message.channel}</span>
      <span style={{ ...styles.type, ...typeStyleMap[message.type] }}>{message.type}</span>
      <pre style={styles.payload}>
        {message.payload.length > 0
          ? message.payload.map((arg) => JSON.stringify(arg, null, 2)).join('\n')
          : '[No Payload]'}
      </pre>
    </div>
  );
};

/**
 * O componente principal que exibe a lista de mensagens IPC.
 */
const IpcView: React.FC = () => {
  const [messages, setMessages] = useState<IpcMessage[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Efeito para se inscrever nos eventos de IPC.
  useEffect(() => {
    // A API 'window.electronDevTools' é injetada pelo nosso script de preload.
    if (window.electronDevTools) {
      const removeListener = window.electronDevTools.onIpcMessageReceived((ipcMessage) => {
        setMessages((prevMessages) => [...prevMessages, ipcMessage]);
      });

      // Função de limpeza para remover o listener quando o componente for desmontado.
      return () => {
        removeListener();
      };
    }
  }, []); // Array vazio garante que o efeito rode apenas na montagem/desmontagem.

  // Efeito para rolar automaticamente para o final.
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto' }); // 'auto' é mais rápido para logs frequentes
  }, [messages]);

  return (
    <div style={styles.container}>
      {messages.map((msg, index) => (
        <IpcItem key={index} message={msg} />
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default IpcView;
