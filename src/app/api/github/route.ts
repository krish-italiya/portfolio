import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch("https://api.github.com/users/krish-italiya", {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      next: { revalidate: 3600 }
    });
    if (!response.ok) throw new Error("GitHub profile request failed");
    const user = await response.json();
    return NextResponse.json({
      publicRepos: user.public_repos,
      followers: user.followers,
      profileUrl: user.html_url,
      fetchedAt: new Date().toISOString()
    }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "GitHub stats are temporarily unavailable." }, { status: 503 });
  }
}
