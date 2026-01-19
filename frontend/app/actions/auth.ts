"use server";

import { authApi } from "@/lib/api";
import { createSession, deleteSession } from "@/lib/session";
import { LoginFormSchema, LoginFormState } from "@/lib/type/loginSchema";
import { redirect } from "next/navigation";
export async function loginAction(formData: FormData): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await authApi.login(email, password);

    await createSession(response.access_token);

    return {
      success: true,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Login fehlgeschlagen",
    };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
