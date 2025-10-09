<script
    setup
    lang="ts"
>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useRoutes } from '~/composables/useRoutes';
import { type UserLoginFormSchema, userLoginFormSchema } from '~/schemas/profile/UserProfileSchema';

const schema = userLoginFormSchema;

const state = reactive<Partial<UserLoginFormSchema>>({
  email: '',
  password: ''
});

const toast = useNotifications();

const routes = useRoutes();

async function onSubmit(event: FormSubmitEvent<UserLoginFormSchema>) {
  const {
    email,
    password
  } = event.data;
  const auth = useAuth();

  try {
    const status = await auth.login(email, password);
    console.log(status);
    toast.success('Success', 'Login Success.');
  } catch (error) {
    console.error(error);
    toast.error('Error', 'Failed to login. Please check your credentials.');
    return;
  }
}
</script>

<template>
    <UCard>
      <template #header>
        <div class="flex flex-col items-center">
          <h2 class="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">{{ $t('login.title') }}</h2>
          <p class="text-base text-gray-500 dark:text-gray-400 mt-2">{{ $t('login.description') }}</p>
        </div>
      </template>

      <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
      >
        <UFormField
            :label="$t('login.form.email_label')"
            name="email"
        >
          <UInput
              v-model="state.email"
              placeholder="you@example.com"
              icon="i-heroicons-envelope"
              size="lg"
          />
        </UFormField>

        <UFormField
            :label="$t('login.form.password_label')"
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
          {{ $t('login.form.button') }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm mt-4">
          {{ $t('login.no_account') }}
          <ULink
              :to="routes.register()"
              class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline transition-colors"
          >
            {{ $t('login.register_link') }}
          </ULink>
        </p>
      </template>
    </UCard>
</template>