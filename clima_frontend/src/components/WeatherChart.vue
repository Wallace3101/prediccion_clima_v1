<template>
  <div class="weather-chart-container">
    <div class="chart-header">
      <CloudRain :size="24" class="icon" />
      <h3>{{ title }}</h3>
    </div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { CloudRain } from 'lucide-vue-next';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  title: {
    type: String,
    default: 'Predicción del Clima'
  },
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: 'Temperatura (°C)'
  }
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.data,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}));
</script>

<style scoped>
.weather-chart-container {
  @apply bg-white rounded-lg shadow-md p-6;
}

.chart-header {
  @apply flex items-center gap-2 mb-4;
}

.chart-header h3 {
  @apply text-xl font-semibold text-gray-800;
}

.icon {
  @apply text-blue-500;
}
</style>
