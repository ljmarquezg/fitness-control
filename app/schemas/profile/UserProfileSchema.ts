import type { UserInfo } from '@firebase/auth';
import * as z from 'zod';

export const HEIGHT_UNITS = ['cm', 'ft-in'] as const;
export const WEIGHT_UNITS = ['kg', 'lb'] as const;
export const SEX_OPTIONS = ['male', 'female', 'other'] as const;

export const DEFAULT_HEIGHT_UNIT: HeightUnit = 'cm';
export const DEFAULT_WEIGHT_UNIT: WeightUnit = 'kg';
export const PROFILE_ICONS = {
  age: {
    icon: 'i-lucide-cake',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-300/10 dark:text-amber-300',
  },
  chest: {
    icon: 'i-lucide-shirt',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-300/10 dark:text-blue-300',
  },
  height: {
    icon: 'i-lucide-ruler',
    color: 'bg-green-500/10 text-green-500 dark:bg-green-300/10 dark:text-green-300',
  },
  hip: {
    icon: 'i-lucide-ruler-dimension-line',
    color: 'bg-pink-500/10 text-pink-500 dark:bg-pink-300/10 dark:text-pink-300',
  },
  muscleMass: {
    icon: 'i-lucide-biceps-flexed',
    color: 'bg-orange-500/10 text-orange-500 dark:bg-orange-300/10 dark:text-orange-300',
  },
  weight: {
    icon: 'i-lucide-scale',
    color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-300/10 dark:text-purple-300',
  },
  waist: {
    icon: 'i-lucide-pencil-ruler',
    color: 'bg-red-500/10 text-red-500 dark:bg-red-300/10 dark:text-red-300',
  },
  male: {
    icon: 'i-lucide-mars',
    color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-300/10 dark:text-blue-300',
  }
};

export type HeightUnit = (typeof HEIGHT_UNITS)[number];
export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export interface ProfileIcons {
  [key: string]: {
    icon: string;
    color: string;
  };
}

export interface UserPreferences {
  language?: string;
}

export interface MeasurementSettings {
  createdAt?: Date;
  heightUnit?: HeightUnit;
  updatedAt?: Date;
  weightUnit?: WeightUnit;
}

export interface UserSettings {
  measurements?: MeasurementSettings;
  preferences?: UserPreferences;
}

export interface UserProfileData extends UserInfo {
  firstName?: string;
  lastName?: string;
  age?: number;
  chest?: number;
  height?: number;
  hip?: number;
  muscleMass?: number;
  weight?: number;
  waist?: number;
  sex?: string;
  settings: UserSettings;
}

export const userLoginFormSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
});

export const userRegisterFormSchema = userLoginFormSchema.extend({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const userFormSchema = userRegisterFormSchema.omit({
  password: true,
  email: true,
}).extend({
  photoURL: z.string().url('Invalid URL').optional().or(z.literal('')),
  age: z.coerce.number().min(1, 'Age is required'),
  sex: z.enum(SEX_OPTIONS),
});

export const userProfileFormSchema = z.object({
    height: z.coerce.number().min(1, 'Height must be greater than 0'),
    weight: z.coerce.number().min(1, 'Weight must be greater than 0'),
    chest: z.coerce.number().min(0, 'Chest cannot be negative').optional(),
    hip: z.coerce.number().min(0, 'Hip cannot be negative').optional(),
    waist: z.coerce.number().min(0, 'Waist cannot be negative').optional(),
    muscleMass: z.coerce.number().min(0, 'Muscle mass cannot be negative').optional(),
  }
);

export const updateUserProfileFormSchema = userFormSchema.extend(userProfileFormSchema.shape);

export type UserLoginFormSchema = z.output<typeof userLoginFormSchema>
export type UserRegisterFormSchema = z.output<typeof userRegisterFormSchema>
export type UserFormSchema = z.output<typeof userFormSchema>
export type UserProfileFormSchema = z.output<typeof userProfileFormSchema>
export type UpdateUserProfileFormSchema = z.output<typeof updateUserProfileFormSchema>
