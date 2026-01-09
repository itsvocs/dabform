import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z
    .email({ message: "Geben Sie eine gültige E-Mail-Adresse ein." })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Das Passwort muss mindestens 8 Zeichen lang sein." })
    .trim(),
});
export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
