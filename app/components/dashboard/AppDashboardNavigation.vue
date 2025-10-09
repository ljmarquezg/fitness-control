<script
    setup
    lang="ts"
>
import type { NavigationMenuItem } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';
import { useDashboardNavigation } from '~/composables/useAppNavigation';

const { t } = useI18n();
const appDashboardNavigation = useDashboardNavigation;
const items = ref<NavigationMenuItem[]>([
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
    /*children: [
      {
        label: 'Link',
        icon: 'i-lucide-file-text',
        description: 'Use NuxtLink with superpowers.',
        to: '/components/link'
      },
      {
        label: 'Modal',
        icon: 'i-lucide-file-text',
        description: 'Display a modal within your application.',
        to: '/components/modal'
      },
      {
        label: 'NavigationMenu',
        icon: 'i-lucide-file-text',
        description: 'Display a list of links.',
        to: '/components/navigation-menu'
      },
      {
        label: 'Pagination',
        icon: 'i-lucide-file-text',
        description: 'Display a list of pages.',
        to: '/components/pagination'
      },
      {
        label: 'Popover',
        icon: 'i-lucide-file-text',
        description: 'Display a non-modal dialog that floats around a trigger element.',
        to: '/components/popover'
      },
      {
        label: 'Progress',
        icon: 'i-lucide-file-text',
        description: 'Show a horizontal bar to indicate task progression.',
        to: '/components/progress'
      }
    ]*/
  },
  {
    label: 'Help',
    icon: 'i-lucide-circle-help',
  }
]);

</script>

<template>
  <UNavigationMenu
      :items="items"
      :lang="'en'"
      orientation="vertical"
      class="data-[orientation=vertical]:w-48"
  />
</template>

<style scoped>

</style>