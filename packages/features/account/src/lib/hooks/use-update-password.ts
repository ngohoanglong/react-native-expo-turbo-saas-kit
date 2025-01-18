import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { useSupabase } from '@kit/supabase';

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export function useUpdatePassword() {
  const supabase = useSupabase();

  return useMutation({
    mutationFn: async (values: UpdatePasswordFormValues) => {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        throw error;
      }
    },
  });
}
