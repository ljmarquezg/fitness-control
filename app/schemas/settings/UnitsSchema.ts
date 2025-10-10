import * as z from 'zod';

export const unitPreferencesFormSchema = z.object({
  weight: z.enum(["kg", "lb"]),
  height: z.enum(["cm", "ft-in"]),
});

export type UnitsPreferencesSchema = z.infer<typeof unitPreferencesFormSchema>;