<script
    setup
    lang="ts"
>

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true
});
</script>

<template>
  <!-- Encabezado del Dashboard -->
  <header class="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
    <div>
      <h2 class="text-3xl font-extrabold text-gray-900 leading-tight mb-1">
        {{ $t('dashboard.title') }}
      </h2>
      <p class="text-lg text-gray-500">
        {{ $t('dashboard.description') }}
      </p>
    </div>
    <div class="mt-4 md:mt-0">
      <UButton color="secondary">
        {{ $t('dashboard.newRecord') }}
      </UButton>
    </div>
  </header>

  <!-- Cuadrícula de Tarjetas con Estadísticas -->
  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Tarjeta 1 -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-500">Visitas totales</h3>
        <svg
            class="h-6 w-6 text-violet-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </div>
      <p class="text-4xl font-extrabold text-gray-900">4,567</p>
      <p class="text-sm font-medium text-green-500 mt-2">+12% desde el mes pasado</p>
    </div>

    <!-- Tarjeta 2 -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-500">Ingresos</h3>
        <svg
            class="h-6 w-6 text-violet-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2m0 0a3 3 0 100 6 3 3 0 000-6zm-9 2h18a1 1 0 001-1V5a1 1 0 00-1-1H3a1 1 0 00-1 1v6a1 1 0 001 1z"
          />
        </svg>
      </div>
      <p class="text-4xl font-extrabold text-gray-900">$2,450</p>
      <p class="text-sm font-medium text-red-500 mt-2">-5% desde el mes pasado</p>
    </div>

    <!-- Tarjeta 3 -->
    <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-gray-500">Nuevos usuarios</h3>
        <svg
            class="h-6 w-6 text-violet-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h-4a2 2 0 01-2-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 01-2 2H3V8h18v12zM5 8V6a2 2 0 012-2h10a2 2 0 012 2v2"
          />
        </svg>
      </div>
      <p class="text-4xl font-extrabold text-gray-900">125</p>
      <p class="text-sm font-medium text-green-500 mt-2">+25% desde el mes pasado</p>
    </div>
  </section>

  <!-- Gráfica de Ejemplo (Simulada) -->
  <section class="bg-white p-8 rounded-2xl shadow-md border border-gray-200 mt-8">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Gráfica de Visitas Diarias</h3>
    <div class="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-medium">
      HOLA
    </div>
  </section>
</template>