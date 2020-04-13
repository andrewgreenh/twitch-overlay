import { config } from "../config";
import { environemnt } from "../env";
import { getUserInfo, updateUserInfo } from "../temp/userInfo";

export const twitchLoginRedirectUri = `${environemnt.origin}/api/twitch/callback`;

export async function getCurrentAccessToken(userId: string) {
  const tokenInfo = (await getUserInfo(userId)).twitchAuthData;

  if (!tokenInfo) {
    throw new Error("No token");
  }

  if (tokenInfo.expires_at > new Date().toISOString()) {
    return tokenInfo.access_token;
  }

  const idArg = "client_id=" + config.twitch_client_id;
  const secretArg = "client_secret=" + config.twtich_client_secret;
  const grantArg = "grant_type=refresh_token";
  const refreshTOkenArg = "refresh_token=" + tokenInfo.refresh_token;

  const query = `?${[idArg, secretArg, grantArg, refreshTOkenArg]
    .filter(Boolean)
    .join("&")}`;

  const response = await fetch("https://id.twitch.tv/oauth2/token" + query, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error refreshing the token.");
  }

  const result = (await response.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  };

  const newTokenInfo: TwitchTokenInformation = {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: new Date(
      new Date().getTime() + result.expires_in * 1000
    ).toISOString(),
  };

  await updateUserInfo(userId, (oldInfo) => ({
    ...oldInfo,
    twitchAuthData: newTokenInfo,
  }));

  return newTokenInfo.access_token;
}

export type TwitchTokenInformation = {
  access_token: string;
  expires_at: string;
  refresh_token: string;
};
