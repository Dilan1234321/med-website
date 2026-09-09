export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/session";

export async function GET() {
  const cookieStore = await cookies();
  const loggedIn = isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ loggedIn });
}
