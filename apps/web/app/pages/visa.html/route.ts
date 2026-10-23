import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL("/visa", request.url);
  const response = NextResponse.redirect(url, { status: 301 });
  // Tell search engines to drop this URL from Google Search index
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet");
  return response;
}
