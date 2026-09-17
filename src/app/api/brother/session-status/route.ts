export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { hasBrotherSession } from "@/lib/brother/require-session";

export async function GET() {
  const loggedIn = await hasBrotherSession();
  return NextResponse.json({ loggedIn });
}
