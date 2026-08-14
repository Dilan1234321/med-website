import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  year?: string;
  pathway?: string;
  notes?: string;
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
  if (!body.year?.trim()) errors.year = "Class year is required.";
  if (!body.pathway?.trim()) errors.pathway = "Select a pathway.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const endpoint = process.env.FORMSPREE_RUSH_ENDPOINT;
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
    message:
      "You’re registered for rush updates. An officer will follow up with dates.",
  });
}
