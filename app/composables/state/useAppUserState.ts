import { UserProfileExtendedFields } from '~/composables/useUserProfile';
import type { UserProfileData } from '~/schemas/profile/UserProfileSchema';
import { filterObjectByKeys } from '~/utils/filterObjectData';

export const useAppUserState = (initialValue?: UserProfileData | null) => {
  const currentUser: Ref<UserProfileData> = useState<UserProfileData>('currentUser', () => initialValue ?? null);
  const userProfile: Ref<UserProfileData> = useState<UserProfileData>('userProfile', () => initialValue ?? null);
  const isUserStateLoading: Ref<boolean> = useState<UserProfileData>('userProfile', () => false);

  const measurementData = computed(() => {
    if (!userProfile.value) return null;
    return filterObjectByKeys(userProfile.value, [
      'height',
      'weight',
      'chest',
      'waist',
      'hip',
      'muscleMass',
    ]);
  });

  const basicInfo = computed(() => {
    if (!userProfile.value) return null;
    return filterObjectByKeys(userProfile.value, ['firstName', 'lastName', 'age', 'sex']);
  });

  const profileInfo = (): UserProfileData => {
    if (!userProfile.value) return null;
    return filterObjectByKeys(userProfile.value, UserProfileExtendedFields);
  };

  const setCurrentUserState = (user: UserProfileData | null): void => {
    currentUser.value = user;
  };

  const updateCurrentUserState = (value: any): void => {
    userProfile.value = {
      ...userProfile.value,
      ...value
    };
    userProfile.value = profileInfo(value);
  };

  const clearCurrentUserState = (): void => {
    setCurrentUserState(null);
  };

  return {
    currentUser,
    userProfile,
    setCurrentUserState,
    updateCurrentUserState,
    clearCurrentUserState,
    isUserStateLoading,
    basicInfo,
    measurementData
  };
};
