<script
    setup
    lang="ts"
>
definePageMeta({
  layout: 'dashboard',
  requiresAuth: true
});
const { t } = useI18n();
const notifications = useNotifications();
const state = ref({
  editing: false,
  loading: false,
});
const editIcon = computed(() => state.value.editing ? 'i-lucide-x' : 'i-lucide-edit-2');
const editButtonColor = computed(() => state.value.editing ? 'default' : 'info');
const route = useRoute();
const profileEditRef = ref(null);

const toggleEdit = () => {
  state.value.editing = !state.value.editing;
};

const handleSave = async () => {
  if (profileEditRef.value) {
    const isValid = await profileEditRef.value.submitForm();
    if (isValid) {
      state.value.editing = false;
      notifications.success(t('profile.saved.title'), t('profile.saved.message'));
    }
  }
};

const onSaved = () => {
  state.value.editing = false;
};

watch(
    () => route.query.edit,
    (newEdit) => {
      state.value.editing = newEdit === 'true';
    },
    { immediate: true }
);
</script>

<template>
  <div id="profile">
    <div class="flex flex-row justify-end">
      <UButton
          :icon="editIcon"
          size="lg"
          :color="editButtonColor"
          variant="solid"
          class="rounded-full p-4 mb-5 cursor-pointer shadow-lg"
          @click="toggleEdit()"
      />

      <UButton
          v-if="state.editing"
          icon="i-lucide-save"
          size="lg"
          color="primary"
          variant="solid"
          class="rounded-full p-4 mb-5 cursor-pointer ml-4 shadow-lg"
          @click="handleSave"
      />
    </div>

    <AppProfileEdit
        v-if="state.editing"
        ref="profileEditRef"
        @saved="onSaved"
    />

    <AppProfile v-if="!state.editing"/>
  </div>
</template>

<style scoped>

</style>