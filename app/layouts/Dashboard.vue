<script
    setup
    lang="ts"
>
import * as locales from '#ui/locale';
import { toasterConfiguration } from '~/app.config';
</script>

<template>
  <UApp
      :toaster="toasterConfiguration"
      :locale="locales[locale]"
  >

    <div class="flex min-h-screen bg-gray-50">
      <aside class="flex flex-col bg-white shadow-lg border-gray-200 p-6">
        <AppDashboardNavigation/>
      </aside>

      <!-- Dynamic content -->
      <main class="flex-1 p-8 md:p-12 lg:p-16">
        <NuxtPage/>
      </main>
    </div>
  </UApp>
</template>

<style scoped>

</style>