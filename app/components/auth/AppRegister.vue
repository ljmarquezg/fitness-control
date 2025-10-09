<script
    setup
    lang="ts"
>
import type { FormSubmitEvent } from '@nuxt/ui';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { userRegisterFormSchema, type UserRegisterFormSchema } from '~/schemas/profile/UserProfileSchema';

const routes = useRoutes();
const schema = userRegisterFormSchema;

const state = reactive<Partial<UserRegisterFormSchema>>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const toast = useNotifications();

async function onSubmit(event: FormSubmitEvent<UserRegisterFormSchema>) {
  const {
    firstName,
    lastName,
    email,
    password
  } = event.data;

  const auth = useAuth();

  try {
    const userCredential = await auth.register(email, password);

    if (userCredential) {
      updateProfile(userCredential, {
        displayName: `${firstName} ${lastName}`,
        photoURL: 'https://example.com/avatar.png'
      })
          .then(() => {
            console.log('Perfil actualizado con éxito!');
          })
          .catch((error) => {
            console.error('Error actualizando perfil:', error);
          });

      const db = useFirebase().db;

      await setDoc(doc(db, 'users', userCredential.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString()
      });

      toast.success(`Welcome ${firstName} ${lastName}`, 'Your account and profile created successfully.');

    }
  } catch (error) {
    console.log(error);
    toast.error('Error', 'Failed to login. Please check your credentials.');
    return;
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-col items-center">
        <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('register.title') }}</h2>
        <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('register.description') }}</p>
      </div>
    </template>

    <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField
            :label="$t('register.form.first_name_label')"
            name="firstName"
        >
          <UInput
              v-model="state.firstName"
              icon="i-heroicons-user"
          />
        </UFormField>

        <UFormField
            :label="$t('register.form.last_name_label')"
            name="lastName"
        >
          <UInput
              v-model="state.lastName"
              icon="i-heroicons-user"
          />
        </UFormField>
      </div>

      <UFormField
          :label="$t('register.form.email_label')"
          name="email"
      >
        <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
        />
      </UFormField>

      <UFormField
          :label="$t('register.form.password_label')"
          name="password"
      >
        <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
        />
      </UFormField>

      <UButton
          type="submit"
          class="w-full justify-center"
          size="lg"
          color="primary"
      >
        {{ $t('register.form.button') }}
      </UButton>
    </UForm>

    <template #footer>
      <p class="text-center text-sm mt-4">
        {{ $t('register.have_account') }}
        <ULink
            :to="routes.login()"
            class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
        >
          {{ $t('register.login_link') }}
        </ULink>
      </p>
    </template>
  </UCard>
</template>