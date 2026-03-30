export interface GoogleProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  verified_email: boolean;
}

export async function fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("Google 프로필 조회 실패");
  return res.json();
}
