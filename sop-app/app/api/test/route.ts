import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    return NextResponse.json({ status: "ok", received: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
