import { SpotifyTokenInformation } from "../spotify/utils";
import { TwitchTokenInformation } from "../twitch/utils";
import { temp } from "./temp";

type UserInfo = {
  spotifyAuthData?: SpotifyTokenInformation;
  twitchAuthData?: TwitchTokenInformation;
};

export async function getUserInfo(userId: string) {
  const info = await temp.getOrDefault<UserInfo>(userId, {});

  return info;
}

export async function updateUserInfo(
  userId: string,
  updater: (oldInfo: UserInfo) => UserInfo
) {
  const oldInfo = (await getUserInfo(userId)) ?? {};
  const newInfo = updater(oldInfo);

  await temp.save(userId, newInfo);
  return newInfo;
}
