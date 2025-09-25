// example/preload.js

const { contextBridge, ipcRenderer } = require('electron');

// O nome da API que será exposta no objeto 'window' do renderer do exemplo.
// Ex: window.myExampleApi.send(...)
const apiKey = 'myExampleApi';

// A API que será exposta de forma segura.
const api = {
  /**
   * Envia uma mensagem assíncrona para o processo principal.
   * @param {string} channel - O canal IPC.
   * @param  {...any} args - Os argumentos a serem enviados.
   */
  send: (channel, ...args) => {
    // Lista de canais permitidos para envio, por segurança.
    const validChannels = ['my-async-channel'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    } else {
      console.warn(`[preload] Tentativa de envio para canal inválido: ${channel}`);
    }
  },

  /**
   * Envia uma mensagem e espera por uma resposta.
   * @param {string} channel - O canal IPC.
   * @param  {...any} args - Os argumentos a serem enviados.
   * @returns {Promise<any>} A promessa que resolve com a resposta do processo principal.
   */
  invoke: (channel, ...args) => {
    // Lista de canais permitidos para invocação.
    const validChannels = ['my-invoke-channel'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    } else {
      console.warn(`[preload] Tentativa de invocação em canal inválido: ${channel}`);
      return Promise.reject(new Error(`Canal inválido: ${channel}`));
    }
  },
};

// Usa o contextBridge para expor a API ao renderer da aplicação de exemplo.
// A API estará disponível em `window.myExampleApi`.
try {
  contextBridge.exposeInMainWorld(apiKey, api);
} catch (error) {
  console.error('Falha ao expor a API de preload do exemplo:', error);
}
