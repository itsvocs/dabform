import * as z from "zod";

export const ResetPasswordFormSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
    .trim(),
  newPassword: z
    .string()
    .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
    .trim(),
});
export type ResetPasswordFormState =
  | {
      errors?: {
        currentPassword?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
