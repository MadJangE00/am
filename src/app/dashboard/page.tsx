import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlatformCard } from "@/components/platform/PlatformCard";
import { GitHubWidget } from "@/components/platform/GitHubWidget";
import { GoogleWidget } from "@/components/platform/GoogleWidget";
import { fetchGitHubProfile, fetchGitHubRepos } from "@/lib/platforms/github";
import { fetchGoogleProfile } from "@/lib/platforms/google";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // 연결된 계정 목록 가져오기
  const accounts = await prisma.account.findMany({
    where: { userId },
  });

  const githubAccount = accounts.find((a: { provider: string }) => a.provider === "github") as typeof accounts[0] | undefined;
  const googleAccount = accounts.find((a: { provider: string }) => a.provider === "google") as typeof accounts[0] | undefined;

  // 플랫폼 데이터 병렬 fetch
  const [githubData, googleData] = await Promise.allSettled([
    githubAccount?.access_token
      ? Promise.all([
          fetchGitHubProfile(githubAccount.access_token),
          fetchGitHubRepos(githubAccount.access_token),
        ])
      : Promise.reject("not connected"),
    googleAccount?.access_token
      ? fetchGoogleProfile(googleAccount.access_token)
      : Promise.reject("not connected"),
  ]);

  const platforms = [
    {
      id: "github",
      name: "GitHub",
      connected: !!githubAccount,
      color: "zinc",
    },
    {
      id: "google",
      name: "Google",
      connected: !!googleAccount,
      color: "blue",
    },
    {
      id: "instagram",
      name: "Instagram",
      connected: false,
      color: "pink",
      comingSoon: true,
    },
    {
      id: "naver",
      name: "Naver",
      connected: false,
      color: "green",
      comingSoon: true,
    },
    {
      id: "kakao",
      name: "Kakao",
      connected: false,
      color: "yellow",
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">내 정보 허브</h1>
          <div className="flex items-center gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-zinc-600">{session.user.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 플랫폼 연결 현황 */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">연결된 플랫폼</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {platforms.map((p) => (
              <PlatformCard key={p.id} {...p} />
            ))}
          </div>
        </section>

        {/* 위젯 영역 */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">데이터 요약</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {githubData.status === "fulfilled" ? (
              <GitHubWidget
                profile={githubData.value[0]}
                repos={githubData.value[1]}
              />
            ) : (
              <ConnectPrompt platform="GitHub" loginProvider="github" />
            )}

            {googleData.status === "fulfilled" ? (
              <GoogleWidget profile={googleData.value} />
            ) : (
              <ConnectPrompt platform="Google" loginProvider="google" />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ConnectPrompt({
  platform,
  loginProvider,
}: {
  platform: string;
  loginProvider: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-zinc-200 p-8 flex flex-col items-center justify-center text-center gap-3">
      <p className="text-zinc-500 text-sm">{platform} 계정이 연결되지 않았어요</p>
      <a
        href={`/api/auth/signin/${loginProvider}`}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        연결하기
      </a>
    </div>
  );
}
