<script
    setup
    lang="ts"
>
import { useAppUserState } from '~/composables/state/useAppUserState';
import { PROFILE_ICONS } from '~/schemas/profile/UserProfileSchema';
import { calculateBMI, getSexIcon } from '~/utils/profile/profileData';

const { userProfile } = useAppUserState();
const { isLoadingProfile } = useUserProfile();
const isLoading = computed(() => !userProfile?.value?.firstName || isLoadingProfile.value);
const measurements = computed(() => {
  return userProfile.value?.settings?.measurements;
});
const sexIcon = computed(() => {
  return getSexIcon(userProfile?.value?.sex);
});
</script>

<template>
  <div class="profile">
    <UCard>
      <div class="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-8">
        <template v-if="isLoading">
          <div class="flex items-center gap-4">
            <USkeleton class="w-24 h-24 rounded-full"/>
            <div class="grid gap-2">
              <USkeleton class="h-8 w-[250px]"/>
              <USkeleton class="h-4 w-[200px]"/>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="flex-shrink-0 mb-4 sm:mb-0">
            <div class="relative w-24 h-24 rounded-full ring-4 ring-violet-200 ring-offset-2 ring-offset-white">
              <img
                  class="w-full h-full rounded-full object-cover shadow-md"
                  src="https://placehold.co/128x128/a78bfa/eef2ff?text=LM"
                  alt="Avatar de usuario"
              >
              <div class="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full ring-2 ring-white"></div>
            </div>
          </div>
          <div class="text-center sm:text-left">
            <h1 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ userProfile?.displayName }}</h1>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">
              <ULink
                  :href="`mailto:${userProfile?.email}`"
                  target="_blank"
              >{{ userProfile?.email }}
              </ULink>
            </p>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">
              <UIcon :name="sexIcon"/>
              {{ $t(`profile.sex.${userProfile?.sex}`) }}
            </p>
          </div>
        </template>
      </div>
    </UCard>
    <div class="mb-8">
      <div class="flex items-center gap-2 my-4">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-800">{{ $t('profile.health_info') }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppStatCard
            :profile-icon="PROFILE_ICONS.age"
            label="profile.form.age_label"
            :value="userProfile?.age"
            :unit="$t('profile.form.years')"
            :is-loading="isLoading"
        />

        <AppStatCard
            :profile-icon="PROFILE_ICONS.height"
            label="profile.form.height_label"
            :value="userProfile?.height"
            :unit="$t(`measurements.${measurements?.height}`)"
            :is-loading="isLoading"
        />

        <AppStatCard
            :profile-icon="PROFILE_ICONS.weight"
            label="profile.form.weight_label"
            :value="userProfile?.weight"
            :unit="$t(`measurements.${measurements?.weight}`)"
            :is-loading="isLoading"
        />

        <AppStatCard
            color="bg-orange-500/10 text-orange-500 dark:bg-orange-300/10 dark:text-orange"
            :profile-icon="PROFILE_ICONS.muscleMass"
            label="profile.form.muscleMass_label"
            :value="userProfile?.muscleMass"
            :unit="$t(`measurements.${measurements?.weight}`)"
            :is-loading="isLoading"
        >
          <template v-if="isLoading">
            <USkeleton class="w-16 h-8 mt-3 mb-2"/>
            <USkeleton class="w-full h-4"/>
          </template>
          <template v-else>
            <p class="text-2xl font-bold mt-4 flex items-baseline">
              {{ calculateBMI(userProfile?.weight, userProfile?.height, userProfile?.sex) }}
            </p>
            <p class="text-sm text-muted-foreground dark:text-muted">
              {{ $t('profile.form.muscleMass_label') }}
            </p>
          </template>
        </AppStatCard>
      </div>

      <div class="flex mt-4 mb-2">
        <h2 class="text-2xl font-extrabold text-gray-800 dark:text-gray-800 mb-1">{{ $t('profile.bodyInformation.title') }}</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppStatCard
            :profile-icon="PROFILE_ICONS.chest"
            label="profile.form.chest_label"
            :value="userProfile?.chest"
            :unit="$t(`measurements.${measurements?.height}`)"
            :is-loading="isLoading"
        />

        <AppStatCard
            :profile-icon="PROFILE_ICONS.hip"
            label="profile.form.hip_label"
            :value="userProfile?.hip"
            :unit="$t(`measurements.${measurements?.height}`)"
            :is-loading="isLoading"
        />

        <AppStatCard
            :profile-icon="PROFILE_ICONS.waist"
            label="profile.form.waist_label"
            :value="userProfile?.waist"
            :unit="$t(`measurements.${measurements?.height}`)"
            :is-loading="isLoading"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>