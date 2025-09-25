import React, { useState } from 'react';

// Importa os componentes de cada painel de ferramentas
import ConsoleView from './components/ConsoleView';
import IpcView from './components/IpcView';
import PerformanceChart from './components/PerformanceChart';

// Importa os estilos globais que definimos
import './styles/main.css';

// Define os tipos para nossas abas para garantir consistência
type Tab = 'Console' | 'IPC' | 'Performance';

// Mapeia o nome da aba ao componente correspondente
const tabComponents: { [key in Tab]: React.FC } = {
  Console: ConsoleView,
  IPC: IpcView,
  Performance: PerformanceChart,
};

// Obtém a lista de nomes das abas do nosso mapa
const tabs = Object.keys(tabComponents) as Tab[];

/**
 * O componente principal da aplicação que gerencia o layout e a navegação por abas.
 */
const App: React.FC = () => {
  // Estado para controlar qual aba está atualmente selecionada. 'Console' é a padrão.
  const [activeTab, setActiveTab] = useState<Tab>('Console');

  // O componente que deve ser renderizado com base na aba ativa.
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="app-container">
      {/* Barra de navegação com os botões das abas */}
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab}
            // Aplica a classe 'active' se o botão corresponder à aba ativa
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            // Define a aba clicada como a nova aba ativa
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Área onde o conteúdo da aba ativa será renderizado */}
      <div className="content-area">
        {/* Renderiza o componente correspondente à aba ativa */}
        <ActiveComponent />
      </div>
    </div>
  );
};

export default App;
