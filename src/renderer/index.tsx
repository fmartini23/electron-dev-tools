import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

// 1. Encontra o elemento no HTML onde a aplicação React será montada.
//    Este elemento deve existir no nosso 'index.html'.
const rootElement = document.getElementById('root');

// 2. Verifica se o elemento raiz foi realmente encontrado no DOM.
if (!rootElement) {
  throw new Error("Falha ao encontrar o elemento raiz com id 'root'. Verifique o arquivo index.html.");
}

// 3. Cria a raiz da aplicação React usando a nova API do React 18.
const root = createRoot(rootElement);

// 4. Renderiza o componente principal <App /> dentro da raiz.
//    O StrictMode é um wrapper que ajuda a identificar potenciais problemas na aplicação.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
