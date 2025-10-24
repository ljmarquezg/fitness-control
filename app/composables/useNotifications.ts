import type { Toast } from '#ui/composables/useToast';

export const useNotifications = () => {
  const toast = useToast()

  const error = (title: string, description?: string): void => {
    toast.add({
      title,
      description,
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }

  const primary = (title: string, description?: string, attributes?:  Partial<Toast>): void => {
    toast.add({
      title,
      description,
      ...attributes
    })
  }

  const secondary = (title: string, description?: string, attributes?:  Partial<Toast>): void => {
    toast.add({
      title,
      description,
      ...attributes
    })
  }

  const success = (title: string, description?: string): void => {
    toast.add({
      title,
      description,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  }

  const info = (title: string, description?: string): void => {
    toast.add({
      title,
      description,
      color: 'info',
      icon: 'i-heroicons-information-circle'
    })
  }

  const warning = (title: string, description?: string): void => {
    toast.add({
      title,
      description,
      color: 'warning',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }

  const neutral = (title: string, description?: string, attributes?:  Partial<Toast>): void => {
    toast.add({
      title,
      description,
      color: 'neutral',
      ...attributes,
    })
  }

  return {
    error,
    primary,
    secondary,
    success,
    info,
    warning,
    neutral
  }
}