<script
    setup
    lang="ts"
>
import * as locales from '@nuxt/ui/locale';
import { toasterConfiguration } from '~/app.config';

const { locale } = useI18n();

</script>

<template>
  <UApp
      :toaster="toasterConfiguration"
      :locale="locales[locale]"
  >
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </UApp>
</template>