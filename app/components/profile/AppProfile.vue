<script
    setup
    lang="ts"
>
import { useAppUserState } from '~/composables/state/useAppUserState';

const { userProfile } = useAppUserState();
const { isLoadingProfile } = useUserProfile();
const state = ref({ editing: false });
const isLoading = computed(() => !userProfile?.value || isLoadingProfile.value);
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
          <div
              v-if="!state.editing"
              class="flex-shrink-0 mb-4 sm:mb-0"
          >
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
          </div>
        </template>
      </div>
    </UCard>
    <div class="mb-8">
      <div class="flex items-center gap-2 my-4">
        <h2 class="text-2xl font-bold">{{ $t('profile.health_info') }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppStatCard
            color="bg-blue-500/10 text-blue-500 dark:bg-blue dark:text-blue-500"
            icon="i-lucide-cake"
            label="profile.form.age_label"
            :value="userProfile?.age"
            :unit="$t('profile.form.years')"
            :isLoading="isLoading"
        />

        <AppStatCard
            color="bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-500"
            icon="i-lucide-ruler"
            label="profile.form.height_label"
            :value="userProfile?.height"
            :unit="$t('measurements.cm')"
            :isLoading="isLoading"
        />

        <AppStatCard
            color="bg-teal-500/10 text-teal-500 dark:bg-teal/10 dark:text-teal-500"
            icon="i-heroicons-scale"
            label="profile.form.weight_label"
            :value="userProfile?.weight"
            :unit="$t('measurements.kg')"
            :isLoading="isLoading"
        />

        <AppStatCard
            color="bg-orange-500/10 text-orange-500 dark:bg-orange-300/10 dark:text-orange"
            icon="i-heroicons-user"
            label="profile.form.muscle_mass_label"
            :value="userProfile?.muscle_mass"
            :unit="$t('measurements.kg')"
            :isLoading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>