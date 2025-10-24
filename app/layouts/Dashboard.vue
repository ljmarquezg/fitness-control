<script
    setup
    lang="ts"
>
import * as locales from '#ui/locale';
import { toasterConfiguration } from '~/app.config';

const {
  locale,
  t
} = useI18n();

definePageMeta({
  requiresAuth: true,
});

const { isUserProfileCompleted } = useUserProfile();
const auth = useAuth();
const toast = useToast();
const routes = useRoutes();

const showProfileCompletionWarning = ref(false);

watch(() => auth.isLoggedIn.value, (loggedIn) => {
  showProfileCompletionWarning.value = isUserProfileCompleted();
  if (loggedIn && showProfileCompletionWarning.value) {
    toast.add({
      title: t('profile.personalInformation.incompleteProfileTitle'),
      description: t('profile.personalInformation.incompleteProfileDescription'),
      orientation: 'vertical',
      icon: 'i-lucide-user',
      actions: [{
        label: t('profile.personalInformation.completeNow'),
        color: 'neutral',
        variant: 'outline',
        onClick: () => navigateTo({
          path: routes.profile(),
          query: { edit: 'true' }
        })
      }]
    });
  }
});

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