import type { GitHubProfile, GitHubRepo } from "@/lib/platforms/github";

interface GitHubWidgetProps {
  profile: GitHubProfile;
  repos: GitHubRepo[];
}

export function GitHubWidget({ profile, repos }: GitHubWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <img
          src={profile.avatar_url}
          alt="github avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold text-zinc-900">{profile.name ?? profile.login}</p>
          <p className="text-xs text-zinc-500">@{profile.login}</p>
        </div>
        <span className="ml-auto text-[10px] font-medium bg-zinc-900 text-white px-2 py-1 rounded-full">
          GitHub
        </span>
      </div>

      {profile.bio && (
        <p className="text-sm text-zinc-600 mb-4">{profile.bio}</p>
      )}

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="레포" value={profile.public_repos} />
        <Stat label="팔로워" value={profile.followers} />
        <Stat label="팔로잉" value={profile.following} />
      </div>

      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
          최근 레포지토리
        </p>
        <ul className="flex flex-col gap-2">
          {repos.slice(0, 5).map((repo) => (
            <li key={repo.id}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-2 hover:bg-zinc-50 rounded-lg p-2 -mx-2 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{repo.name}</p>
                  {repo.description && (
                    <p className="text-xs text-zinc-500 truncate">{repo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {repo.language && (
                    <span className="text-[10px] text-zinc-400">{repo.language}</span>
                  )}
                  <span className="text-[10px] text-zinc-400">★ {repo.stargazers_count}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-50 rounded-xl p-3 text-center">
      <p className="text-lg font-bold text-zinc-900">{value.toLocaleString()}</p>
      <p className="text-[10px] text-zinc-500">{label}</p>
    </div>
  );
}
