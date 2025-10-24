<script
    setup
    lang="ts"
>
definePageMeta({
  requiresAuth: false,
});
</script>

<template>
  <div
      id="login"
      class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black"
  >
    <AppLanguageSelector class="mb-8"/>
    <NuxtPage/>
  </div>
</template>

<style scoped>

</style>