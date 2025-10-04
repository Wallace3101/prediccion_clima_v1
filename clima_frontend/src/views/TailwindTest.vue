<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 class="text-4xl font-bold text-indigo-600 mb-4">
          ✅ Tailwind CSS está funcionando!
        </h1>
        <p class="text-gray-600 text-lg">
          Si ves estos estilos correctamente, Tailwind está configurado y funcionando.
        </p>
      </div>

      <!-- Grid de tarjetas de prueba -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- Tarjeta 1: Colores -->
        <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div class="text-2xl mb-2">🎨</div>
          <h3 class="text-xl font-bold mb-2">Gradientes</h3>
          <p class="text-sm opacity-90">Colores degradados funcionando</p>
        </div>

        <!-- Tarjeta 2: Spacing -->
        <div class="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div class="text-2xl mb-2">📏</div>
          <h3 class="text-xl font-bold mb-2">Espaciado</h3>
          <p class="text-sm opacity-90">Padding y margins correctos</p>
        </div>

        <!-- Tarjeta 3: Responsive -->
        <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <div class="text-2xl mb-2">📱</div>
          <h3 class="text-xl font-bold mb-2">Responsive</h3>
          <p class="text-sm opacity-90">Grid adaptable funcionando</p>
        </div>
      </div>

      <!-- Sección de botones -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Botones de prueba</h2>
        <div class="flex flex-wrap gap-4">
          <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md">
            Primario
          </button>
          <button class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md">
            Éxito
          </button>
          <button class="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md">
            Advertencia
          </button>
          <button class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md">
            Peligro
          </button>
          <button class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
            Secundario
          </button>
        </div>
      </div>

      <!-- Sección de tipografía -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Tipografía</h2>
        <div class="space-y-3">
          <p class="text-xs text-gray-600">Texto extra pequeño (text-xs)</p>
          <p class="text-sm text-gray-600">Texto pequeño (text-sm)</p>
          <p class="text-base text-gray-700">Texto base (text-base)</p>
          <p class="text-lg text-gray-700">Texto grande (text-lg)</p>
          <p class="text-xl text-gray-800">Texto extra grande (text-xl)</p>
          <p class="text-2xl font-bold text-gray-900">Título 2xl (text-2xl)</p>
        </div>
      </div>

      <!-- Sección de flex y alineación -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Flexbox</h2>
        <div class="flex items-center justify-between bg-indigo-50 rounded-lg p-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <div>
              <p class="font-semibold text-gray-800">Flex funciona</p>
              <p class="text-sm text-gray-600">Items alineados correctamente</p>
            </div>
          </div>
          <button class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            Acción
          </button>
        </div>
      </div>

      <!-- Indicadores de estado -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Estados y Utilidades</h2>
        
        <!-- Badges -->
        <div class="flex flex-wrap gap-3 mb-6">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            Info
          </span>
          <span class="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Activo
          </span>
          <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            Pendiente
          </span>
          <span class="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            Error
          </span>
        </div>

        <!-- Barra de progreso -->
        <div class="mb-4">
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Progreso</span>
            <span class="text-sm font-medium text-indigo-600">75%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-indigo-600 h-3 rounded-full" style="width: 75%"></div>
          </div>
        </div>

        <!-- Alerta -->
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div class="flex items-start">
            <div class="text-2xl mr-3">✅</div>
            <div>
              <p class="font-medium text-green-800">¡Tailwind CSS configurado correctamente!</p>
              <p class="text-sm text-green-700 mt-1">
                Todos los estilos de utilidad están funcionando como se espera.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer de información -->
      <div class="mt-8 text-center">
        <div class="inline-block bg-white rounded-xl shadow-lg p-6">
          <p class="text-gray-600 mb-2">
            <strong class="text-gray-800">Clases de Tailwind detectadas:</strong>
          </p>
          <div class="flex items-center justify-center gap-2 text-sm">
            <span class="px-2 py-1 bg-gray-100 rounded">Colores ✓</span>
            <span class="px-2 py-1 bg-gray-100 rounded">Spacing ✓</span>
            <span class="px-2 py-1 bg-gray-100 rounded">Flexbox ✓</span>
            <span class="px-2 py-1 bg-gray-100 rounded">Grid ✓</span>
            <span class="px-2 py-1 bg-gray-100 rounded">Responsive ✓</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
// Este componente es solo para probar Tailwind CSS
</script>

<style scoped>
/* No se necesitan estilos adicionales - todo es con Tailwind */
</style>
