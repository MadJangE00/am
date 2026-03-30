import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    await prisma.$queryRaw`SELECT 1`;
    results.db = "ok";
  } catch (e) {
    results.db = String(e);
  }

  try {
    // Test createUser (what NextAuth calls on first login)
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@debug.com`,
        name: "Debug User",
        emailVerified: new Date(),
      },
    });
    results.createUser = "ok";

    // Test linkAccount
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "oidc",
        provider: "google",
        providerAccountId: `debug-${Date.now()}`,
        access_token: "test",
        token_type: "bearer",
        scope: "openid email profile",
      },
    });
    results.linkAccount = "ok";

    // Test createSession
    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: `session-${Date.now()}`,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
    results.createSession = "ok";

    // Cleanup
    await prisma.user.delete({ where: { id: user.id } });
    results.cleanup = "ok";
  } catch (e) {
    results.adapterError = String(e);
  }

  return NextResponse.json(results);
}
