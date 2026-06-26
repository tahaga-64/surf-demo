import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body ?? {};

    if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json({ error: "CONTACT_WEBHOOK_URL is not configured" }, { status: 503 });
    }

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message, source: "chiba-surfing-federation-lp" }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
