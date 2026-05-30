import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory counter — resets on cold start; upgrade to KV for persistence
let count = 0;

export async function GET() {
  return NextResponse.json({ count });
}

export async function POST() {
  count += 1;
  return NextResponse.json({ count });
}
