<script
    setup
    lang="ts"
>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useAppUserState } from '~/composables/state/useAppUserState';
import { PROFILE_ICONS, updateUserProfileFormSchema, type UpdateUserProfileFormSchema, type UserFormSchema } from '~/schemas/profile/UserProfileSchema';

const { userProfile } = useAppUserState();
const { updateUserProfile } = useUserProfile();
const emit = defineEmits(['saved']);
const formRef = ref();

function submitForm() {
  return formRef.value?.submit();
}

defineExpose({
  submitForm,
});

const {
  firstName,
  lastName,
  photoURL,
  age,
  weight,
  height,
  chest,
  hip,
  waist,
  muscle,
  sex
} = userProfile.value;

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

const sexOptions = [
  {
    label: $t('profile.form.sex.male'),
    value: 'male',
    icon: 'i-lucide-mars'
  },
  {
    label: $t('profile.form.sex.female'),
    value: 'female',
    icon: 'i-lucide-venus'
  },
  {
    label: $t('profile.form.sex.other'),
    value: 'other',
    icon: 'i-lucide-g'
  },
];

const stateUserForm = reactive<Partial<UpdateUserProfileFormSchema>>({
  firstName,
  lastName,
  photoURL,
  age,
  weight,
  height,
  chest,
  hip,
  waist,
  muscle,
  sex: sex ?? 'male',
});
const isLoading = ref(false);
const isSubmitting = ref(false);

async function onSubmitUserForm(event: FormSubmitEvent<UserFormSchema>) {
  isSubmitting.value = true;
  await updateUserProfile(event.data).then(() => {
    emit('saved');
  }).finally(() => {
    isSubmitting.value = false;
  });
}
</script>

<template>
  <div class="profile">
    <UForm
        ref="formRef"
        :schema="updateUserProfileFormSchema"
        :state="stateUserForm"
        class="space-y-6"
        @submit="onSubmitUserForm"
        @error="console.log('❌ Form error:', $event)"
    >
      <UCard>
        <template #header>
          <div class="flex flex-col items-center">
            <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('profile.personalInformation.title') }}</h2>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('profile.personalInformation.description') }}</p>
          </div>
        </template>

        <div class="flex flex-col sm:flex-row content-center justify-start sm:items-center space-x-0 sm:space-x-8 gap-4">
          <template v-if="isLoading">
            <USkeleton class="w-24 h-24 rounded-lg"/>
          </template>
          <template v-else>
            <UFileUpload
                v-model="stateUserForm.photoURL"
                variant="button"
                size="xl"
                icon="i-lucide-image"
                label=""
                description=""
                :interactive="true"
                :highlight="true"
                accept="image/*"
                :max-files="1"
                :max-size="1024 * 1024"
                class="rounded-lg"
                :ui="ui"
            />

            <div class="flex flex-col items-center w-full">
              <UFormField
                  :label="$t('profile.form.first_name_label')"
                  name="firstName"
                  class="w-full mb-4"
              >
                <UInput
                    v-model="stateUserForm.firstName"
                    icon="i-heroicons-user"
                    :disabled="isSubmitting.value"
                />
              </UFormField>

              <UFormField
                  :label="$t('profile.form.last_name_label')"
                  name="lastName"
                  class="w-full"
              >
                <UInput
                    v-model="stateUserForm.lastName"
                    icon="i-heroicons-user"
                    :disabled="isSubmitting.value"
                />
              </UFormField>

              <div class="flex flex-row items-start w-full">
                <UFormField
                    :label="$t('profile.form.sex.label')"
                    name="sex"
                    class="mt-2"
                >
                  <URadioGroup
                      v-model="stateUserForm.sex"
                      :items="sexOptions"
                      orientation="horizontal"
                      variant="card"
                  >
                    <template #label="{ item }">
                      <div class="flex items-center gap-2">
                        <UIcon
                            v-if="item.icon"
                            :name="item.icon"
                            class="w-5 h-5"
                        />
                        <span>{{ item.label }}</span>
                      </div>
                    </template>
                  </URadioGroup>
                </UFormField>
              </div>
            </div>
          </template>
        </div>
      </UCard>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppStatCard
            v-model="stateUserForm.age"
            :profile-icon="PROFILE_ICONS.age"
            :editing="true"
            label="profile.form.age_label"
            name="age"
            type="number"
            :placeholder="$t('profile.form.years_old')"
            :trailing="true"
            trailing-label="profile.form.years"
            :value="userProfile.age"
        />

        <AppStatCard
            v-model="stateUserForm.height"
            :profile-icon="PROFILE_ICONS.height"
            :editing="true"
            label="profile.form.height_label"
            name="height"
            type="number"
            :placeholder="$t('profile.form.height_label')"
            :trailing="true"
            trailing-label="measurements.cm"
            :value="userProfile.height"
        />

        <AppStatCard
            v-model="stateUserForm.weight"
            :profile-icon="PROFILE_ICONS.weight"
            :editing="true"
            label="profile.form.weight_label"
            name="weight"
            type="number"
            :placeholder="$t('profile.form.weight_label')"
            :trailing="true"
            trailing-label="measurements.cm"
            :value="userProfile.weight"
        />

        <AppStatCard
            v-model="stateUserForm.muscleMass"
            :profile-icon="PROFILE_ICONS.muscleMass"
            :editing="true"
            label="profile.form.bmi_label"
            name="muscleMass"
            type="number"
            :placeholder="$t('profile.form.bmi_label')"
            :trailing="true"
            trailing-label=""
            :value="userProfile.muscleMass"
        />
      </div>

      <UCard>
        <template #header>
          <div class="flex flex-col items-center">
            <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('profile.bodyInformation.title') }}</h2>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('profile.bodyInformation.description') }}</p>
          </div>

        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AppStatCard
              v-model="stateUserForm.chest"
              :profile-icon="PROFILE_ICONS.chest"
              :editing="true"
              label="profile.form.chest_label"
              name="chest"
              type="number"
              :placeholder="$t('profile.form.chest_label')"
              :trailing="true"
              trailing-label="measurements.cm"
              :value="userProfile.chest"
          />

          <AppStatCard
              v-model="stateUserForm.hip"
              :profile-icon="PROFILE_ICONS.hip"
              :editing="true"
              label="profile.form.hip_label"
              name="hip"
              type="number"
              :placeholder="$t('profile.form.hip_label')"
              :trailing="true"
              trailing-label="measurements.cm"
              :value="userProfile.hip"
          />

          <AppStatCard
              v-model="stateUserForm.waist"
              :profile-icon="PROFILE_ICONS.waist"
              :editing="true"
              label="profile.form.waist_label"
              name="waist"
              type="number"
              :placeholder="$t('profile.form.waist_label')"
              :trailing="true"
              trailing-label="measurements.kg"
              :value="userProfile.waist"
          />
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
    <!--    <UCard class="mt-8">
          <template #header>
            <div class="flex flex-col items-center">
              <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('profile.bodyInformation.title') }}</h2>
              <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('profile.bodyInformation.description') }}</p>
            </div>
          </template>

          <UForm
              :schema="userProfileSchema"
              :state="state"
              class="space-y-6"
              @submit="onSubmitUserForm"
          >

            <UFormField
                :label="$t('profile.form.first_name_label')"
                name="firstName"
            >
              <UInput
                  v-model="state.firstName"
                  icon="i-heroicons-user"
              />
            </UFormField>

            <UFormField
                :label="$t('profile.form.last_name_label')"
                name="lastName"
            >
              <UInput
                  v-model="state.lastName"
                  icon="i-heroicons-user"
              />
            </UFormField>

            <UFormField
                :label="$t('profile.form.age_label')"
                name="age"
            >
              <UInput
                  v-model="state.age"
                  type="number"
                  placeholder="30"
                  icon="i-heroicons-calendar"
              />
            </UFormField>

            <UButton
                type="submit"
                class="w-full justify-center"
                size="lg"
                color="primary"
            >
              {{ $t('profile.form.button') }}
            </UButton>
          </UForm>
        </UCard>-->
  </div>
</template>

<style scoped>

</style>