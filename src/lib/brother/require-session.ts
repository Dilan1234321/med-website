import { cookies } from "next/headers";
import { SESSION_COOKIE as BROTHER_COOKIE, isValidSessionToken as isValidBrotherToken } from "./session";
import { SESSION_COOKIE as ADMIN_COOKIE, isValidSessionToken as isValidAdminToken } from "@/lib/admin/session";

/**
 * Route-handler check (returns a boolean instead of redirecting, since API
 * routes need to answer with JSON, not a redirect) used as defense-in-depth
 * inside /api/speed-dating/* handlers. The proxy already blocks unauthenticated
 * requests at the edge; this guarantees the check still holds even if that
 * matcher is ever misconfigured.
 *
 * Admins count as brothers here too (an officer should be able to rate PNMs
 * without needing a second login), so either cookie being valid passes.
 */
export async function hasBrotherSession(): Promise<boolean> {
  const cookieStore = await cookies();
  if (isValidBrotherToken(cookieStore.get(BROTHER_COOKIE)?.value)) return true;
  if (isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)) return true;
  return false;
}
