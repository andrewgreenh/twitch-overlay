import formUrlEncoded from "form-urlencoded";
import { config } from "../config";
import { environemnt } from "../env";
import { getUserInfo, updateUserInfo } from "../temp/userInfo";

export const spotifyLoginRedirectUri = `${environemnt.origin}/api/spotify/callback`;

export async function getCurrentAccessToken(userId: string) {
  const tokenInfo = (await getUserInfo(userId)).spotifyAuthData;

  if (!tokenInfo) {
    throw new Error("No token");
  }

  if (tokenInfo.expires_at > new Date().toISOString()) {
    return tokenInfo.access_token;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${config.spotify_client_id}:${config.spotify_client_secret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formUrlEncoded({
      grant_type: "refresh_token",
      refresh_token: tokenInfo.refresh_token,
      state: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Error refreshing the token.");
  }

  const result = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  const newTokenInfo: SpotifyTokenInformation = {
    access_token: result.access_token,
    refresh_token: tokenInfo.refresh_token,
    expires_at: new Date(
      new Date().getTime() + result.expires_in * 1000
    ).toISOString(),
  };

  await updateUserInfo(userId, (oldInfo) => ({
    ...oldInfo,
    spotifyAuthData: newTokenInfo,
  }));

  return newTokenInfo.access_token;
}

export type SpotifyTokenInformation = {
  access_token: string;
  expires_at: string;
  refresh_token: string;
};
