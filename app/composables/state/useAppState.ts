import { useAppUserSettingsState } from '~/composables/state/useAppUserSettingsState';
import { useAppUserState } from '~/composables/state/useAppUserState';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';

export const useAppState = (initialValue?: UserProfileData | null) => {
  return {
    useAppUserState: useAppUserState(initialValue),
    useAppUserSettingsState: useAppUserSettingsState(initialValue),
  };
};
