import type { GoogleProfile } from "@/lib/platforms/google";

interface GoogleWidgetProps {
  profile: GoogleProfile;
}

export function GoogleWidget({ profile }: GoogleWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <img
          src={profile.picture}
          alt="google avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-zinc-900">{profile.name}</p>
          <p className="text-xs text-zinc-500">{profile.email}</p>
        </div>
        <span className="ml-auto text-[10px] font-medium bg-blue-500 text-white px-2 py-1 rounded-full">
          Google
        </span>
      </div>

      <div className="bg-zinc-50 rounded-xl p-4 flex items-center gap-3">
        {profile.verified_email ? (
          <>
            <span className="text-green-500 text-lg">✓</span>
            <p className="text-sm text-zinc-700">이메일 인증 완료</p>
          </>
        ) : (
          <>
            <span className="text-yellow-500 text-lg">!</span>
            <p className="text-sm text-zinc-700">이메일 미인증</p>
          </>
        )}
      </div>
    </div>
  );
}
