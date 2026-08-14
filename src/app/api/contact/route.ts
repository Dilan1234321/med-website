import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON." }, { status: 400 });
  }

  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = "Name is required.";
  if (!body.email?.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.email = "Enter a valid email.";
  if (!body.reason?.trim()) errors.reason = "Select a reason.";
  if (!body.message?.trim()) errors.message = "Message is required.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const endpoint = process.env.FORMSPREE_CONTACT_ENDPOINT;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json(
        { message: "Submission failed upstream. Try again later." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    message: "Message received. We’ll reply by email.",
  });
}
