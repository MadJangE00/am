"use client";

import { signIn } from "next-auth/react";

const platformIcons: Record<string, string> = {
  github: "⬛",
  google: "🔵",
  instagram: "📸",
  naver: "🟢",
  kakao: "🟡",
};

interface PlatformCardProps {
  id: string;
  name: string;
  connected: boolean;
  comingSoon?: boolean;
}

export function PlatformCard({ id, name, connected, comingSoon }: PlatformCardProps) {
  const handleClick = () => {
    if (comingSoon || connected) return;
    signIn(id, { callbackUrl: "/dashboard" });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative bg-white rounded-xl border p-4 flex flex-col items-center gap-2
        transition-all duration-150
        ${connected ? "border-green-200 shadow-sm" : "border-zinc-100"}
        ${comingSoon ? "opacity-50 cursor-not-allowed" : connected ? "cursor-default" : "cursor-pointer hover:border-blue-300 hover:shadow-md hover:scale-[1.02]"}
      `}
    >
      <span className="text-2xl">{platformIcons[id]}</span>
      <span className="text-xs font-medium text-zinc-700">{name}</span>
      {comingSoon ? (
        <span className="text-[10px] text-zinc-400">준비 중</span>
      ) : connected ? (
        <span className="text-[10px] text-green-600 font-medium">연결됨</span>
      ) : (
        <span className="text-[10px] text-blue-500 font-medium">연결하기 →</span>
      )}
    </div>
  );
}
