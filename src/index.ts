/**
 * electron-dev-tools
 *
 * Ponto de entrada principal do pacote NPM.
 * Este arquivo exporta as funções públicas que os usuários podem importar
 * em suas aplicações Electron.
 *
 * @author Fernando Martini (fmartini23)
 */

// Importa a função de inicialização principal do módulo 'main'.
import { initializeDevTools as mainInitialize } from './main';

// Reexporta a função com um nome mais genérico e claro para o usuário final.
// Esta é a função que deve ser chamada no processo principal da aplicação Electron do usuário.
export const initializeDevTools = mainInitialize;

/*
 * Futuramente, poderíamos exportar outras funções aqui.
 * Por exemplo, uma função para inicializar monitores no processo de renderização
 * da aplicação do usuário, caso seja necessário.
 *
 * Exemplo:
 *
 * import { initializeRendererMonitors as rendererInitialize } from './renderer-hijack';
 * export const initializeRendererDevTools = rendererInitialize;
 *
 */

// Para garantir que os tipos também sejam exportados corretamente,
// o 'tsconfig.json' com "declaration": true cuidará de gerar
// os arquivos .d.ts correspondentes a este ponto de entrada.
