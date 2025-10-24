import * as z from 'zod';
import { HEIGHT_UNITS, WEIGHT_UNITS } from '~/schemas/profile/UserProfileSchema';

export const unitLanguagesFormSchema = z.object({
  language: z.string(),
});

export const unitPreferencesFormSchema = z.object({
  weight: z.enum(WEIGHT_UNITS),
  height: z.enum(HEIGHT_UNITS),
});

export type UnitsPreferencesSchema = z.infer<typeof unitPreferencesFormSchema>;
export type UnitsLanguagesSchema = z.infer<typeof unitLanguagesFormSchema>;