// example/renderer.js

// Espera o conteúdo do DOM ser totalmente carregado antes de adicionar os listeners.
window.addEventListener('DOMContentLoaded', () => {
    console.log('✅ [renderer] DOM carregado. Adicionando listeners...');
  
    // --- Seção 1: Listeners para os botões de Log ---
  
    const logInfoBtn = document.getElementById('log-info');
    logInfoBtn.addEventListener('click', () => {
      console.log('Esta é uma mensagem de informação do processo de renderização.');
      // Este log deve aparecer no console unificado da nossa ferramenta!
    });
  
    const logWarnBtn = document.getElementById('log-warn');
    logWarnBtn.addEventListener('click', () => {
      console.warn('Esta é uma mensagem de aviso. Algo pode estar errado.');
    });
  
    const logErrorBtn = document.getElementById('log-error');
    logErrorBtn.addEventListener('click', () => {
      console.error('Isto é um erro!', { code: 404, message: 'Não encontrado' });
    });
  
    // --- Seção 2: Listeners para os botões de IPC ---
  
    const ipcSendBtn = document.getElementById('ipc-send');
    ipcSendBtn.addEventListener('click', () => {
      console.log('▶️ [renderer] Enviando mensagem via ipcRenderer.send...');
      // Usa a API exposta pelo preload.
      window.myExampleApi.send('my-async-channel', 'Olá, processo principal!');
      // Esta comunicação deve ser capturada pelo nosso monitor de IPC.
    });
  
    const ipcInvokeBtn = document.getElementById('ipc-invoke');
    const responseArea = document.getElementById('response-area');
  
    ipcInvokeBtn.addEventListener('click', async () => {
      console.log('▶️ [renderer] Invocando o processo principal via ipcRenderer.invoke...');
      responseArea.textContent = 'Aguardando resposta do processo principal...';
      try {
        // Usa a API exposta pelo preload e aguarda a resposta.
        const result = await window.myExampleApi.invoke('my-invoke-channel', 42);
  
        console.log('◀️ [renderer] Resposta recebida:', result);
        // Exibe o resultado na página.
        responseArea.textContent = result;
        // Todo o fluxo de invoke (request e response) deve aparecer no monitor de IPC.
      } catch (error) {
        console.error('◀️ [renderer] Erro ao invocar:', error);
        responseArea.textContent = `Erro: ${error.message}`;
      }
    });
  });
  