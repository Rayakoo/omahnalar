import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Biarkan client-side (AuthContext) yang menukar code menjadi session
  // Kirim code via redirect agar AuthContext bisa memprosesnya
  if (code) {
    return NextResponse.redirect(`${origin}${next}?code=${code}`);
  }

  return NextResponse.redirect(`${origin}/login?message=Auth failed`);
}
