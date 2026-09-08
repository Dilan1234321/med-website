import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isValidSessionToken } from "./session";

/**
 * Defense-in-depth check inside Server Actions. The proxy already blocks
 * unauthenticated requests to /admin/* and /api/admin/*, but this guarantees
 * any action added later is still protected even if the matcher is ever
 * misconfigured.
 */
export async function requireSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    redirect("/admin/login");
  }
}
