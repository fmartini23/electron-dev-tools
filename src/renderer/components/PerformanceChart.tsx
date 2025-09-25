import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { PerformanceData } from '../../shared/types';

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define o número máximo de pontos de dados a serem exibidos no gráfico
const MAX_DATA_POINTS = 30;

// Configurações visuais para o gráfico
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: { color: '#eee' },
    },
    title: {
      display: true,
      text: 'Uso de CPU e Memória em Tempo Real',
      color: '#eee',
    },
  },
  scales: {
    x: {
      ticks: { color: '#ccc' },
      grid: { color: '#444' },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ccc',
        callback: (value: number | string) => `${value}%`, // Adiciona '%' ao eixo Y
      },
      grid: { color: '#444' },
    },
  },
};

/**
 * O componente que exibe os gráficos de desempenho.
 */
const PerformanceChart: React.FC = () => {
  // Estado para armazenar os dados do gráfico
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'CPU Main (%)',
        data: [] as number[],
        borderColor: '#ff79c6', // Rosa
        backgroundColor: 'rgba(255, 121, 198, 0.5)',
      },
      {
        label: 'CPU Renderer (%)',
        data: [] as number[],
        borderColor: '#50fa7b', // Verde
        backgroundColor: 'rgba(80, 250, 123, 0.5)',
      },
    ],
  });

  useEffect(() => {
    // A API 'window.electronDevTools' é injetada pelo nosso script de preload.
    if (!window.electronDevTools) return;

    // --- OUVINTE PARA DADOS DE PERFORMANCE ---
    const removeListener = window.electronDevTools.onPerformanceDataReceived(
      (perfData: PerformanceData) => {
        setChartData((prevData) => {
          // Adiciona um novo rótulo (timestamp)
          const newLabels = [
            ...prevData.labels,
            new Date(perfData.timestamp).toLocaleTimeString(),
          ].slice(-MAX_DATA_POINTS);

          // Função auxiliar para atualizar um dataset específico
          const updateDataset = (label: string, newValue: number) => {
            const dataset = prevData.datasets.find((ds) => ds.label === label);
            if (!dataset) return [];
            return [...dataset.data, newValue].slice(-MAX_DATA_POINTS);
          };

          // Atualiza os datasets de CPU
          const newMainCpuData = updateDataset('CPU Main (%)', perfData.main.cpu);
          const newRendererCpuData = updateDataset('CPU Renderer (%)', perfData.renderer.cpu);

          return {
            labels: newLabels,
            datasets: [
              { ...prevData.datasets[0], data: newMainCpuData },
              { ...prevData.datasets[1], data: newRendererCpuData },
            ],
          };
        });
      }
    );

    // --- SIMULAÇÃO DE DADOS (PARA DESENVOLVIMENTO) ---
    // No futuro, os dados virão do processo main e renderer.
    // Por enquanto, vamos simular para ver o gráfico funcionando.
    const intervalId = setInterval(() => {
      const mockPerfData: PerformanceData = {
        main: {
          cpu: Math.random() * 10 + 2, // Simula uso de CPU do main
          memory: Math.random() * 50 + 80,
        },
        renderer: {
          cpu: Math.random() * 25 + 5, // Simula uso de CPU do renderer (geralmente maior)
          memory: Math.random() * 100 + 150,
        },
        timestamp: new Date().toISOString(),
      };

      // Simula o recebimento do evento
      if (window.electronDevTools) {
        // Chamaria o callback diretamente para simulação
        // Em um cenário real, o evento viria do preload
      }
      // Para este exemplo, vamos atualizar o estado diretamente
       setChartData((prevData) => {
          const newLabels = [...prevData.labels, new Date(mockPerfData.timestamp).toLocaleTimeString()].slice(-MAX_DATA_POINTS);
          const newMainCpuData = [...prevData.datasets[0].data, mockPerfData.main.cpu].slice(-MAX_DATA_POINTS);
          const newRendererCpuData = [...prevData.datasets[1].data, mockPerfData.renderer.cpu].slice(-MAX_DATA_POINTS);
          return {
            labels: newLabels,
            datasets: [
              { ...prevData.datasets[0], data: newMainCpuData },
              { ...prevData.datasets[1], data: newRendererCpuData },
            ],
          };
        });


    }, 2000); // Gera novos dados a cada 2 segundos

    // Função de limpeza
    return () => {
      removeListener?.(); // O '?' é para o caso de a API não existir
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: '#282a36' }}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};

export default PerformanceChart;
