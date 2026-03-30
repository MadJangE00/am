import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          나의 온라인 정보를<br />한 곳에서
        </h1>
        <p className="text-zinc-400 text-lg mb-10">
          GitHub, Google, Instagram, Naver, Kakao 계정을 연결하고
          모든 정보를 한 대시보드에서 관리하세요.
        </p>
        <Link
          href="/login"
          className="inline-block bg-white text-zinc-900 font-semibold px-8 py-3 rounded-full hover:bg-zinc-100 transition-colors"
        >
          시작하기
        </Link>
      </div>
    </div>
  );
}
