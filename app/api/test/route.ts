export async function GET() {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return new Response(JSON.stringify({ ok: true, echo: body }), { status: 200 });
}
