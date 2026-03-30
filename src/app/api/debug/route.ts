import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ db: "ok", env: {
      hasSecret: !!process.env.AUTH_SECRET,
      hasGithubId: !!process.env.GITHUB_CLIENT_ID,
      hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
      hasDbUrl: !!process.env.DATABASE_URL,
      nextauthUrl: process.env.NEXTAUTH_URL,
    }});
  } catch (e) {
    return NextResponse.json({ db: "error", message: String(e) }, { status: 500 });
  }
}
