import * as z from 'zod';

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
  age: z.int().min(1, 'Age is required'),
});

export const userProfileFormSchema = z.object({
    weight: z.number().min(1, 'Weight is required'),
    height: z.number().min(1, 'Height is required email'),
    chest: z.number().optional(),
    hip: z.number().optional(),
    waist: z.number().optional(),
    muscle: z.number().optional(),
  }
);

export const updateUserProfileFormSchema = userFormSchema.merge(userProfileFormSchema);;

export type UserLoginFormSchema = z.output<typeof userLoginFormSchema>
export type UserRegisterFormSchema = z.output<typeof userRegisterFormSchema>
export type UserFormSchema = z.output<typeof userFormSchema>
export type UserProfileFormSchema = z.output<typeof userProfileFormSchema>
export type UpdateUserProfileFormSchema = z.output<typeof updateUserProfileFormSchema>
