<script
    setup
    lang="ts"
>
import type { NavigationMenuItem } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';
import { useDashboardNavigation } from '~/composables/useAppNavigation';

const { t } = useI18n();
const auth = useAuth();
const logout = async () => {
  await auth.logout();
};

const appDashboardNavigation = useDashboardNavigation;
const items: Ref<NavigationMenuItem[]> = computed(() => [
  {
    label: t(appDashboardNavigation.dashboard().label),
    icon: 'i-lucide-home',
    to: appDashboardNavigation.dashboard().url
  },
  {
    label: t(appDashboardNavigation.reports().label),
    icon: 'i-lucide-chart-pie',
    to: appDashboardNavigation.reports().url,
    children: [
      {
        label: 'defineShortcuts',
        icon: 'i-lucide-file-text',
        description: 'Define shortcuts for your application.',
        to: '/composables/define-shortcuts'
      },
      {
        label: 'useOverlay',
        icon: 'i-lucide-file-text',
        description: 'Display a modal/slideover within your application.',
        to: '/composables/use-overlay'
      },
      {
        label: 'useToast',
        icon: 'i-lucide-file-text',
        description: 'Display a toast within your application.',
        to: '/composables/use-toast'
      }
    ]
  },
  {
    label: t(appDashboardNavigation.profile().label),
    icon: 'i-lucide-user',
    to: appDashboardNavigation.profile().url,
    slot: 'profile' as const,
  },
  {
    label: t(appDashboardNavigation.settings().label),
    icon: 'i-lucide-settings',
    to: appDashboardNavigation.settings().url,
  }
]);
const logoutModalVisible = ref(false);
const toggleLogoutModel = () => {
  logoutModalVisible.value = !logoutModalVisible.value;
};

</script>

<template>
  <div class="flex flex-col h-full justify-between">
    <div class="flex flex-col">
      <UNavigationMenu
          :items="items"
          :lang="'en'"
          orientation="vertical"
          class="data-[orientation=vertical]:w-48"
      />

    </div>
    <div class="flex-flex-col">
      <AppLanguageSelector/>
      <UButton
          icon="i-lucide-log-out"
          size="lg"
          color="neutral"
          variant="link"
          @click="toggleLogoutModel()"
      >
        Logout
      </UButton>
    </div>
  </div>
  <UModal :open="logoutModalVisible">
    <template #content>
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">{{ t('logout.confirm.title') }}</h2>
        <p class="mb-6">{{ t('logout.confirm.message') }}</p>
        <div class="flex justify-end space-x-4">
          <UButton
              color="default"
              @click="toggleLogoutModel()"
          >
            {{ t('logout.confirm.cancelButton') }}
          </UButton>
          <UButton
              color="error"
              @click="logout();"
          >
            {{ t('logout.confirm.confirmButton') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>

</style>