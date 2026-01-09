"use server";

import { authApi } from "@/lib/api";
import { createSession } from "@/lib/session";
import { LoginFormSchema, LoginFormState } from "@/lib/type/loginSchema";

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

    // Token in Cookie speichern (Server-Side)
    // const cookieStore = await cookies();
    // cookieStore.set("access_token", response.access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24, // 24 Stunden
    // });

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
