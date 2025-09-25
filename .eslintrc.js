module.exports = {
    // Define o ambiente onde o código será executado.
    // 'browser' para o renderer (acesso a DOM), 'node' para o main, 'es2021' para sintaxe moderna.
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    // Estende configurações populares e recomendadas. A ordem é importante.
    extends: [
      'eslint:recommended', // Regras básicas recomendadas pelo ESLint
      'plugin:@typescript-eslint/recommended', // Regras recomendadas para TypeScript
      'plugin:react/recommended', // Regras recomendadas para React
      'plugin:react/jsx-runtime', // Desativa a necessidade de 'import React' em arquivos JSX (React 17+)
      'prettier', // Desativa regras do ESLint que conflitam com o Prettier
    ],
    // Especifica o parser que o ESLint deve usar.
    parser: '@typescript-eslint/parser', // Permite que o ESLint entenda a sintaxe do TypeScript.
    // Opções específicas do parser.
    parserOptions: {
      ecmaFeatures: {
        jsx: true, // Habilita o parsing de JSX
      },
      ecmaVersion: 'latest', // Usa a versão mais recente do ECMAScript
      sourceType: 'module', // Permite o uso de 'import'/'export'
    },
    // Adiciona plugins que fornecem regras adicionais.
    plugins: [
      '@typescript-eslint', // Plugin para regras de TypeScript
      'react', // Plugin para regras de React
    ],
    // Configurações específicas para o plugin do React.
    settings: {
      react: {
        version: 'detect', // Detecta automaticamente a versão do React instalada
      },
    },
    // Sobrescreve ou adiciona regras específicas.
    rules: {
      // Exemplo de regra: desativa a necessidade de prop-types, já que usamos TypeScript.
      'react/prop-types': 'off',
      // Exemplo de regra: permite o uso de 'require' (útil no processo main do Electron).
      '@typescript-eslint/no-var-requires': 'off',
      // Permite o uso de 'any' explícito, mas é bom evitar quando possível.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  };
  