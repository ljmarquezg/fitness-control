<script
    setup
    lang="ts"
>
import type { FormSubmitEvent } from '@nuxt/ui';
import { updateUserProfileFormSchema, type UpdateUserProfileFormSchema, type UserFormSchema } from '~/schemas/profile/UserProfileSchema';

const userProfile = useUserProfile();
const profileData = userProfile.profileData;
const isLoading = userProfile.isLoadingProfile;
const emit = defineEmits(['saved']);
const toast = useNotifications();

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
  muscle
} = profileData.value;

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
});

async function onSubmitUserForm(event: FormSubmitEvent<UserFormSchema>) {
  try {
    await userProfile.updateUser(event.data);
    toast.success('Success', 'Profile updated successfully.');
    emit('saved');
  } catch (error) {
    console.log(error);
    toast.error('Error', 'Failed to login. Please check your credentials.');
    return;
  }
}
</script>

<template>
  <div class="profile">
    <UForm
        :schema="updateUserProfileFormSchema"
        :state="stateUserForm"
        class="space-y-6"
        @submit="onSubmitUserForm"
    >
      <UCard>
        <template #header>
          <div class="flex flex-col items-center">
            <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('profile.personalInformation.title') }}</h2>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('profile.personalInformation.description') }}</p>
          </div>
        </template>


        <div class="flex flex-col sm:flex-row content-center justify-start sm:items-center space-x-0 sm:space-x-8 gap-4">
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
              />
            </UFormField>
          </div>
        </div>
      </UCard>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppStatCard
            v-model="stateUserForm.age"
            color="bg-blue-500/10 text-blue-500 dark:bg-blue dark:text-blue-500"
            icon="i-lucide-cake"
            :editing="true"
            label="profile.form.age_label"
            :placeholder="$t('profile.form.years_old')"
            :trailing="true"
            trailing-label="profile.form.years"
            :value="profileData.age"
        />

        <AppStatCard
            v-model="stateUserForm.height"
            color="bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-500"
            icon="i-lucide-ruler"
            :editing="true"
            label="profile.form.height_label"
            :placeholder="$t('profile.form.height_label')"
            :trailing="true"
            trailing-label="measurements.cm"
            :value="profileData.age"
        />

        <AppStatCard
            v-model="stateUserForm.weight"
            color="bg-teal-500/10 text-teal-500 dark:bg-teal/10 dark:text-teal-500"
            icon="i-heroicons-scale"
            :editing="true"
            label="profile.form.weight_label"
            :placeholder="$t('profile.form.weight_label')"
            :trailing="true"
            trailing-label="measurements.cm"
            :value="profileData.weight"
        />

        <AppStatCard
            v-model="stateUserForm.muscle"
            color="bg-orange-500/10 text-orange-500 dark:bg-orange-300/10 dark:text-orange"
            icon="i-heroicons-user"
            :editing="true"
            label="profile.form.bmi_label"
            :placeholder="$t('profile.form.bmi_label')"
            :trailing="true"
            trailing-label="measurements.kg"
            :value="profileData.muscle"
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
              color="bg-blue-500/10 text-blue-500 dark:bg-blue dark:text-blue-500"
              icon="i-lucide-cake"
              :editing="true"
              label="profile.form.chest_label"
              :placeholder="$t('profile.form.chest_label')"
              :trailing="true"
              trailing-label="measurements.cm"
              :value="profileData.chest"
          />

          <AppStatCard
              v-model="stateUserForm.hip"
              color="bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-500"
              icon="i-lucide-ruler"
              :editing="true"
              label="profile.form.hip_label"
              :placeholder="$t('profile.form.hip_label')"
              :trailing="true"
              trailing-label="measurements.cm"
              :value="profileData.hip"
          />

          <AppStatCard
              v-model="stateUserForm.waist"
              color="bg-orange-500/10 text-orange-500 dark:bg-orange-300/10 dark:text-orange"
              icon="i-heroicons-user"
              :editing="true"
              label="profile.form.waist_label"
              :placeholder="$t('profile.form.waist_label')"
              :trailing="true"
              trailing-label="measurements.kg"
              :value="profileData.waist"
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