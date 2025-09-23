import { NextResponse } from "next/server";

type SuccessResponse = {
  ok: true;
  request: unknown;
};

type ErrorResponse = {
  ok: false;
  error: string;
};

function createErrorResponse(error: unknown, status = 400) {
  const message =
    error instanceof SyntaxError
      ? "Invalid JSON payload"
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return NextResponse.json<ErrorResponse>(
    { ok: false, error: message },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return NextResponse.json<SuccessResponse>({ ok: true, request: payload });
  } catch (error) {
    return createErrorResponse(error);
  }
}
