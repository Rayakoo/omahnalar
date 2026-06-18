import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, nextUrl } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const origin = nextUrl.origin;

  if (code) {
    return NextResponse.redirect(`${origin}${next}?code=${code}`);
  }

  return NextResponse.redirect(`${origin}/login?message=Auth failed`);
}
