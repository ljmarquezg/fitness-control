import type { Toast } from '#ui/composables/useToast';

export const useNotifications = () => {
  const toast = useToast();

  const showToast = (
    type: string,
    titleOrConfig: string | ToastConfig,
    description?: string
  ) => {
    if (!import.meta.client) return;

    const defaults: Record<string, Partial<Toast>> = {
      error: {
        color: 'error',
        icon: 'i-heroicons-x-circle'
      },
      success: {
        color: 'success',
        icon: 'i-heroicons-check-circle'
      },
      info: {
        color: 'info',
        icon: 'i-heroicons-information-circle'
      },
      warning: {
        color: 'warning',
        icon: 'i-heroicons-exclamation-triangle'
      },
      neutral: { color: 'neutral' },
      primary: {},
      secondary: {},
    };
    const config: ToastConfig =
      typeof titleOrConfig === 'string' ? { title: titleOrConfig, description } : titleOrConfig;

    toast.add({
      ...defaults[type],
      ...config,
    });
  };

  const error = (title: string, description?: string) => showToast('error', title, description);

  const success = (title: string, description?: string) => showToast('success', title, description);

  const info = (title: string | ToastConfig, description?: string) => showToast('info', title, description);

  const warning = (title: string, description?: string) => showToast('warning', title, description);

  const neutral = (title: string, description?: string, a?: Partial<Toast>) => showToast('neutral', {
    title,
    description: description, ...a
  });

  const primary = (title: string, description?: string, a?: Partial<Toast>) => showToast('primary', {
    title,
    description: description, ...a
  });

  const secondary = (title: string, description?: string, a?: Partial<Toast>) => showToast('secondary', {
    title,
    description: description, ...a
  });

  return {
    error,
    primary,
    secondary,
    success,
    info,
    warning,
    neutral
  };
};