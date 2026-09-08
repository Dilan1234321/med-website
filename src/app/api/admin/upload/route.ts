export const runtime = "nodejs";

import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/admin/session";

const MAX_BYTES = 5 * 1024 * 1024;

async function sniffImageType(file: File): Promise<{ extension: string; contentType: string } | null> {
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return { extension: "jpg", contentType: "image/jpeg" };
  }
  if (
    header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47 &&
    header[4] === 0x0d && header[5] === 0x0a && header[6] === 0x1a && header[7] === 0x0a
  ) {
    return { extension: "png", contentType: "image/png" };
  }
  const ascii = new TextDecoder("ascii").decode(header);
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP") {
    return { extension: "webp", contentType: "image/webp" };
  }
  return null;
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "Please choose a file to upload." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Please upload an image under 5MB." }, { status: 400 });
    }

    const sniffed = await sniffImageType(file);
    if (!sniffed) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image." }, { status: 400 });
    }

    const pathname = `content/${randomUUID()}.${sniffed.extension}`;

    const blob = await put(pathname, file, { access: "public", contentType: sniffed.contentType });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Blob upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }
}
