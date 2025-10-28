<script
    setup
    lang="ts"
>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';
import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';
import { useSettingsTranslations } from '~/composables/useSettings';
import { PROFILE_ICONS, type UserFormSchema } from '~/schemas/profile/UserProfileSchema';
import { unitPreferencesFormSchema, type UnitsPreferencesSchema } from '~/schemas/settings/UnitsSchema';

const { t } = useI18n();
const weightMetric = useSettingsTranslations.weight().metric;
const weightImperial = useSettingsTranslations.weight().imperial;
const heightMetric = useSettingsTranslations.height().metric;
const heightImperial = useSettingsTranslations.height().imperial;

const heightItems = computed(() => [
  {
    label: t(heightMetric.label),
    value: heightMetric.value
  },
  {
    label: t(heightImperial.label),
    value: heightImperial.value
  },
]);

const weightItems = computed(() => [
  {
    label: t(weightMetric.label),
    value: weightMetric.value
  },
  {
    label: t(weightImperial.label),
    value: weightImperial.value
  },
]);
const { currentUser } = useAppUserState();
const { userSettings } = useAppUserSettingsState();
const { isLoadingSettings } = useUserProfile();
const { updateUserSettings } = useSettings();
const emit = defineEmits(['saved']);
const toast = useNotifications();

const unitsPreferencesForm = reactive<Partial<UnitsPreferencesSchema>>({
  weight: undefined,
  height: undefined
});

const patchUnitsForm = (partial: Partial<UnitsPreferencesSchema>) => {
  Object.assign(unitsPreferencesForm, partial);
};

const ui = {
  root: 'relative flex flex-col relative w-24 h-24 rounded-full',
  base: [
    'relative w-24 h-24 rounded-full ring-4 border-0',
    'transition-[background]'
  ],
  layout: {
    grid: {
      fileLeadingAvatar: 'size-full rounded-full',
    }
  },
  fileLeadingAvatar: 'w-full h-full rounded-full object-cover',
};

async function onSubmitPreferencesForm(event: FormSubmitEvent<UserFormSchema>) {
  try {
    await updateUserSettings(event.data);
    toast.success('Success', 'Profile updated successfully.');
    emit('saved');
  } catch (error) {
    console.error(error);
    toast.error('Error', 'Failed to login. Please check your credentials.');
    return;
  }
}

watch(() => userSettings.value, (settings) => {
  if (userSettings.value) {
    patchUnitsForm({
      weight: settings.measurements.weight,
      height: settings.measurements.height
    });
  }
});

</script>

<template>
  <div class="profile">
    <UForm
        :schema="unitPreferencesFormSchema"
        :state="unitsPreferencesForm"
        class="space-y-6"
        v-if="currentUser"
        @submit="onSubmitPreferencesForm"
    >
      <UCard>
        <template #header>
          <div class="flex flex-col items-center">
            <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('settings.measurement_units.title') }}</h2>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('settings.measurement_units.description') }}</p>
          </div>
        </template>

        <div class="grid grid-cols-1 gap-4">

          <AppStatCard
              color="bg-blue-500/10 text-blue-500 dark:bg-blue dark:text-blue-500"
              :profile-icon="PROFILE_ICONS.height"
          >
            <template #default>
              <UFormField
                  :label="$t('measurements.height')"
                  name="height"
                  class="mt-2 text-xs text-muted"
              >
                <URadioGroup
                    v-model="unitsPreferencesForm.height"
                    :items="heightItems"
                    orientation="horizontal"
                    variant="card"
                />
              </UFormField>
            </template>
          </AppStatCard>

          <AppStatCard
              :profile-icon="PROFILE_ICONS.weight"
          >
            <template #default>
              <UFormField
                  :label="$t('measurements.weight')"
                  name="weight"
                  class="mt-2 text-xs text-muted"
              >
                <URadioGroup
                    v-model="unitsPreferencesForm.weight"
                    :items="weightItems"
                    orientation="horizontal"
                    variant="card"
                />
              </UFormField>
            </template>
          </AppStatCard>

        </div>

        <UButton
            type="submit"
            class="w-full justify-center mt-5 cursor-pointer"
            size="lg"
            color="primary"
        >
          {{ $t('profile.form.button') }}
        </UButton>
      </UCard>
    </UForm>
  </div>
</template>

<style scoped>

</style>