<script
    setup
    lang="ts"
>

import AppDashboardNavigation from '~/components/dashboard/AppDashboardNavigation.vue';
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <aside class="flex flex-col bg-white shadow-lg border-gray-200 p-6">
      <AppDashboardNavigation />
    </aside>

    <!-- Dynamic content -->
    <main class="flex-1 p-8 md:p-12 lg:p-16">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>

</style>