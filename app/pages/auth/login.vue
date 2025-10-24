<script
    setup
    lang="ts"
>
import AppLogin from '~/components/auth/AppLogin.vue';
definePageMeta({
  layout: 'auth',
  requiresAuth: false
});
</script>

<template>
  <div id="login">
    <AppLogin class="w-full max-w-lg"/>
  </div>
</template>