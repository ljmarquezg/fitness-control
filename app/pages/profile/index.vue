<script
    setup
    lang="ts"
>
definePageMeta({
  layout: 'dashboard'
});

const state = ref({
  editing: false,
  loading: false,
});

const editIcon = computed(() => state.value.editing ? 'i-lucide-x' : 'i-lucide-edit-2');
const editButtonColor = computed(() => state.value.editing ? 'default' : 'info');

const toggleEdit = () => {
  state.value.editing = !state.value.editing;
};

const onSaved = () => {
  state.value.editing = false;
};
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
          @click="toggleEdit()"
      />
    </div>
    <AppProfileEdit
        v-if="state.editing"
        @saved="onSaved"
    />

    <AppProfile v-if="!state.editing"/>
  </div>
</template>

<style scoped>

</style>