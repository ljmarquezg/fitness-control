<script
    setup
    lang="ts"
>
import type { FormSubmitEvent } from '@nuxt/ui';
import { useRoutes } from '~/composables/useRoutes';
import { type UserLoginFormSchema, userLoginFormSchema } from '~/schemas/profile/UserProfileSchema';

const { t } = useI18n();
const schema = userLoginFormSchema;
const state = reactive<Partial<UserLoginFormSchema>>({
  email: '',
  password: ''
});
const notifications = useNotifications();
const routes = useRoutes();
const {
  login,
  isFetchingUserLoading
} = useAuth();
const buttonProps = computed(() => ({
  type: isFetchingUserLoading.value ? 'button' : 'submit',
  disabled: isFetchingUserLoading.value,
}));

async function onSubmit(event: FormSubmitEvent<UserLoginFormSchema>) {
  const {
    email,
    password
  } = event.data;
  try {
    await login(email, password);
    notifications.success(t('login.success.title'), t('login.success.message'));
  } catch (error) {
    notifications.error(t('login.error.title'), t('login.error.message'));
    console.error('❌ Error logging in:', error);
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
            :disabled="isFetchingUserLoading"
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
            :disabled="isFetchingUserLoading"
        />
      </UFormField>

      <UButton
          :type="buttonProps.type"
          class="w-full justify-center"
          size="lg"
          color="primary"
          :disabled="buttonProps.disabled"
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