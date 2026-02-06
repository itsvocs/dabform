// /lib/session.ts
import "server-only";
import { cookies } from "next/headers";

/**
 * Session Management 
 
 */

export async function createSession(backendToken: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  cookieStore.set("session", backendToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
    // domain: 'localhost',
  });
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value || null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
