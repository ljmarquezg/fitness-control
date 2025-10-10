<script
    setup
    lang="ts"
>
import * as locales from '@nuxt/ui/locale';
import { toasterConfiguration } from '~/app.config';
const { locale } = useI18n();

</script>

<template>
  <div>
    <NuxtLayout>
      <UApp :toaster="toasterConfiguration" :locale="locales[locale]" >
        <NuxtPage/>
      </UApp>
    </NuxtLayout>
  </div>
</template>