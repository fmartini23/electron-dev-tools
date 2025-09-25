import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../../shared/types';

// Estilos inline para simplicidade. Em um projeto maior, isso poderia ser um arquivo CSS.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: '14px',
    color: '#eee',
    backgroundColor: '#222',
    padding: '10px',
    height: '100%',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  logEntry: {
    display: 'flex',
    borderBottom: '1px solid #444',
    padding: '5px 0',
  },
  timestamp: {
    color: '#888',
    marginRight: '10px',
    minWidth: '80px',
  },
  process: {
    color: '#00aaff',
    fontWeight: 'bold',
    marginRight: '10px',
    minWidth: '50px',
  },
  level: {
    marginRight: '10px',
    minWidth: '50px',
    fontWeight: 'bold',
  },
  payload: {
    whiteSpace: 'pre-wrap', // Mantém a formatação de objetos e quebras de linha
    wordBreak: 'break-all',
  },
  // Cores para cada nível de log
  log: { color: '#eee' },
  info: { color: '#66d9ef' },
  warn: { color: '#f1fa8c' },
  error: { color: '#ff5555' },
};

/**
 * Renderiza um único item de log.
 */
const LogItem: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const levelStyle = styles[entry.level] || styles.log;

  return (
    <div style={styles.logEntry}>
      <span style={styles.timestamp}>{new Date(entry.timestamp).toLocaleTimeString()}</span>
      <span style={styles.process}>[{entry.process}]</span>
      <span style={{ ...styles.level, ...levelStyle }}>{entry.level.toUpperCase()}</span>
      <pre style={styles.payload}>
        {entry.payload.map((arg, index) => (
          <span key={index}>
            {typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)}
            {index < entry.payload.length - 1 ? ' ' : ''}
          </span>
        ))}
      </pre>
    </div>
  );
};

/**
 * O componente principal que exibe a lista de logs unificados.
 */
const ConsoleView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  // Efeito para se inscrever nos eventos de log do processo principal.
  useEffect(() => {
    // A API 'window.electronDevTools' é injetada pelo nosso script de preload.
    // O TypeScript pode reclamar aqui se ainda não definimos o tipo global.
    if (window.electronDevTools) {
      const removeListener = window.electronDevTools.onLogReceived((logEntry) => {
        setLogs((prevLogs) => [...prevLogs, logEntry]);
      });

      // Função de limpeza do useEffect: remove o listener quando o componente é desmontado.
      return () => {
        removeListener();
      };
    }
  }, []); // O array vazio garante que este efeito rode apenas uma vez (montagem/desmontagem).

  // Efeito para rolar automaticamente para o final quando novos logs chegam.
  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]); // Roda sempre que o array de logs mudar.

  return (
    <div style={styles.container}>
      {logs.map((log, index) => (
        <LogItem key={index} entry={log} />
      ))}
      {/* Elemento invisível no final da lista para o qual podemos rolar */}
      <div ref={endOfLogsRef} />
    </div>
  );
};

export default ConsoleView;
