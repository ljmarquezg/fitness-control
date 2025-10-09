<script
    lang="ts"
    setup
>

import { useFirestoreDatabase } from '~/composables/useFirestoreDatabase';

const routes = useRoutes();
definePageMeta({
  router: {
    alias: ['/dashboard']
  },
  redirect: routes.dashboard,
});

const {
  addDocument,
  updateDocument,
  deleteDocument,
  listenToCollection
} = useFirestoreDatabase();

// Reactive data
const items = ref([]);
const newItem = ref({
  title: '',
  description: ''
});
const editingItem = ref(null);
const loading = ref(false);

// Real-time listener
let unsubscribe = null;

onMounted(() => {
  // Set up real-time listener
  unsubscribe = listenToCollection('items', (data) => {
    items.value = data;
  });
});

onUnmounted(() => {
  // Clean up listener
  if (unsubscribe) {
    unsubscribe();
  }
});

// Methods
const addNewItem = async () => {
  if (!newItem.value.title.trim()) return;

  loading.value = true;
  try {
    await addDocument('items', {
      title: newItem.value.title,
      description: newItem.value.description
    });

    // Reset form
    newItem.value = {
      title: '',
      description: ''
    };
  } catch (error) {
    console.error('Error adding item:', error);
  } finally {
    loading.value = false;
  }
};

const editItem = (item) => {
  editingItem.value = { ...item };
};

const updateItem = async () => {
  if (!editingItem.value) return;

  try {
    await updateDocument('items', editingItem.value.id, {
      title: editingItem.value.title,
      description: editingItem.value.description
    });
    editingItem.value = null;
  } catch (error) {
    console.error('Error updating item:', error);
  }
};

const removeItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    await deleteDocument('items', id);
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

const logout = async () => {
  const auth = useAuth();
  try {
    await auth.logout();
    console.log('User logged out');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

// SEO
useHead({
  title: 'Nuxt Firebase App'
});

</script>

<template>
  <div>
    <h1>Welcome to the homepage</h1>
    <AppAlert>
      This is an auto-imported component
    </AppAlert>
    <UButton>
      This is an auto-imported component from @nuxt/ui
    </UButton>

    <UButton
        icon="lucide:circle-plus"
        variant="subtle"
    >Add Record
    </UButton>
    <UButton
        icon="lucide:circle-plus"
        variant="subtle"
        @click="logout"
    >logout
    </UButton>
    <AppAlert>
      Thjis is asmdlaksd asdjlk
    </AppAlert>


    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Nuxt + Firebase Demo</h1>

      <!-- Add new item form -->
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">Add New Item</h2>
        <form
            class="space-y-4"
            @submit.prevent="addNewItem"
        >
          <div>
            <input
                v-model="newItem.title"
                class="w-full p-2 border rounded"
                placeholder="Item title"
                required
                type="text"
            />
          </div>
          <div>
          <textarea
              v-model="newItem.description"
              class="w-full p-2 border rounded"
              placeholder="Item description"
              rows="3"
          />
          </div>
          <button
              :disabled="loading"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              type="submit"
          >
            {{ loading ? 'Adding...' : 'Add Item' }}
          </button>
        </form>
      </div>

      <!-- Items list -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Items ({{ items.length }})</h2>
        <div
            v-for="item in items"
            :key="item.id"
            class="bg-white p-4 rounded-lg shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ item.title }}</h3>
              <p class="text-gray-600 mt-1">{{ item.description }}</p>
              <small class="text-gray-400">
                Created: {{ formatDate(item.createdAt) }}
              </small>
            </div>
            <div class="space-x-2">
              <button
                  class="text-blue-500 hover:text-blue-700"
                  @click="editItem(item)"
              >
                Edit
              </button>
              <button
                  class="text-red-500 hover:text-red-700"
                  @click="removeItem(item.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit modal -->
      <div
          v-if="editingItem"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h3 class="text-lg font-semibold mb-4">Edit Item</h3>
          <form
              class="space-y-4"
              @submit.prevent="updateItem"
          >
            <input
                v-model="editingItem.title"
                class="w-full p-2 border rounded"
                required
                type="text"
            />
            <textarea
                v-model="editingItem.description"
                class="w-full p-2 border rounded"
                rows="3"
            ></textarea>
            <div class="flex space-x-2">
              <button
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  type="submit"
              >
                Update
              </button>
              <button
                  class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  type="button"
                  @click="editingItem = null"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>