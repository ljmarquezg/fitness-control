<script
    setup
    lang="ts"
>

const userProfile = useUserProfile();
const profileData = userProfile.profileData;
const isLoading = userProfile.isLoadingProfile;
const state = ref({
  editing: false,
  loading: false,
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
            <h1 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ profileData?.displayName }}</h1>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-2">
              <ULink
                  :href="`mailto:${profileData?.email}`"
                  target="_blank"
              >{{ profileData?.email }}
              </ULink>
            </p>
          </div>
        </template>
      </div>
    </UCard>
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <h2 class="text-2xl font-bold">Métricas de Salud</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AppStatCard
            color="bg-blue-500/10 text-blue-500 dark:bg-blue dark:text-blue-500"
            icon="i-lucide-cake"
            label="profile.form.age_label"
            :value="profileData.age"
            :unit="$t('profile.form.years')"
        />

        <AppStatCard
            color="bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-500"
            icon="i-lucide-ruler"
            label="profile.form.height_label"
            :value="profileData.height"
            :unit="$t('measurements.cm')"
        />

        <AppStatCard
            color="bg-teal-500/10 text-teal-500 dark:bg-teal/10 dark:text-teal-500"
            icon="i-heroicons-scale"
            label="profile.form.weight_label"
            :value="profileData.weight"
            :unit="$t('measurements.kg')"
        />

        <AppStatCard
            color="bg-orange-500/10 text-orange-500 dark:bg-orange-300/10 dark:text-orange"
            icon="i-heroicons-user"
            label="profile.form.muscle_mass_label"
            :value="profileData.muscle_mass"
            :unit="$t('measurements.kg')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>