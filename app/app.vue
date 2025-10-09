<script
    setup
    lang="ts"
>
import * as locales from '@nuxt/ui/locale';
const { locale } = useI18n();

const toaster = {
  position: 'bottom-right',
  expand: true,
  duration: 5000,
  hoverPause: true,
  progress: true
};
</script>

<template>
  <div>
    <NuxtLayout>
      <UApp :toaster="toaster" :locale="locales[locale]" >
        <NuxtPage/>
      </UApp>
    </NuxtLayout>
  </div>
</template>