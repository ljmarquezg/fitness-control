<script
    setup
    lang="ts"
>
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';

const {
  locale,
  availableLocales,
  t
} = useI18n();
const { currentUser } = useAppUserState();
const { userSettings } = useAppUserSettingsState();
const settings = useSettings();
const toast = useNotifications();

const changeLanguage = (lang: string) => {
  if (lang === locale.value) return;
  locale.value = lang;
};

const options = computed(() => {
  return availableLocales.map(code => ({
    label: t(`languages.${code}`),
    value: code,
  }));
});

onMounted(() => {
  const language = userSettings.value?.preferences?.language;
  if (language && language !== locale.value) {
    locale.value = language;
  }
});

watch(locale, async (newLocale) => {
  if (!currentUser.value || !userSettings.value) return;

  const language = { language: locale.value };
  try {
    const updatedSettings = {
      ...userSettings.value,
      preferences: {
        ...userSettings.value.settings?.preferences,
        ...language
      },
    };

    await settings.updateUserPreferences(updatedSettings);

    userSettings.value = updatedSettings;

    toast.success(t('languages.languageUpdated'), t('languages.languageChangedTo', { language: t(`languages.${newLocale}`) }));
  } catch (error) {
    console.error('Error al actualizar idioma en Firebase:', error);
    toast.error(t('languages.error'), t('languages.languageSaveFailed'));
  }
});

</script>

<template>
  <!--  <USelect
        :key="locale"
        v-model="locale"
        :items="options"
        option-attribute="label"
        class="w-40"
    />-->

  <UDropdownMenu
      :items="options"
      @select="(item) => changeLanguage(item.value)"
  >

    <!-- Trigger -->
    <template #default="{ open }">
      <UButton
          color="gray"
          variant="soft"
          icon="i-lucide-globe"
          class="flex items-center gap-1"
          :aria-expanded="open"
      >
        {{ $t(`languages.${locale}`) }}
      </UButton>
    </template>

    <!-- Parte superior opcional -->
    <template #content-top>
      <div class="px-3 py-1 text-xs text-gray-500 uppercase">Language</div>
    </template>

    <!-- Render de cada item -->
    <template #item="{ item, active }">
      <div
          class="flex items-center gap-2 w-full px-3 py-2 rounded-md cursor-pointer"
          :class="[
            active ? 'bg-gray-100 dark:bg-gray-800' : '',
            item.value === locale ? 'font-semibold text-primary-600' : 'text-gray-700 dark:text-gray-200'
          ]"
          @click="changeLanguage(item.value)"
      >
        <!-- Slot personalizado: item-leading -->
        <div
            :key="item.code"
            size="sm"
            class="justify-start"
        >
          {{ item.label }}
        </div>
      </div>
    </template>
  </UDropdownMenu>

</template>
