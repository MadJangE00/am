export interface GitHubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

export async function fetchGitHubProfile(accessToken: string): Promise<GitHubProfile> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) throw new Error("GitHub 프로필 조회 실패");
  return res.json();
}

export async function fetchGitHubRepos(accessToken: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?sort=updated&per_page=10&type=owner",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) throw new Error("GitHub 레포 조회 실패");
  return res.json();
}

export async function fetchGitHubContributions(username: string): Promise<number> {
  // GitHub REST API로 올해 커밋 수 근사치
  const now = new Date();
  const since = new Date(now.getFullYear(), 0, 1).toISOString();
  const res = await fetch(
    `https://api.github.com/search/commits?q=author:${username}&since=${since}`,
    {
      headers: {
        Accept: "application/vnd.github.cloak-preview+json",
      },
    }
  );

  if (!res.ok) return 0;
  const data = await res.json();
  return data.total_count ?? 0;
}
