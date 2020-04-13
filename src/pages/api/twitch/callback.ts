import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../shared/config";
import { updateUserInfo } from "../../../shared/temp/userInfo";
import {
  twitchLoginRedirectUri,
  TwitchTokenInformation,
} from "../../../shared/twitch/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const twitchAuthCode = req.query.code;
  const userId = req.query.state as string;

  const idArg = "client_id=" + config.twitch_client_id;
  const secretArg = "client_secret=" + config.twtich_client_secret;
  const codeArg = "code=" + twitchAuthCode;
  const grantArg = "grant_type=authorization_code";
  const redirectArg =
    "redirect_uri=" + encodeURIComponent(twitchLoginRedirectUri);

  const query = `?${[idArg, secretArg, codeArg, grantArg, redirectArg]
    .filter(Boolean)
    .join("&")}`;

  const response = await fetch("https://id.twitch.tv/oauth2/token" + query, {
    method: "POST",
  });

  if (!response.ok) {
    res.send(await response.text());
    return;
  }

  const result = (await response.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  };

  const tokenInfo: TwitchTokenInformation = {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: new Date(
      new Date().getTime() + result.expires_in * 1000
    ).toISOString(),
  };

  updateUserInfo(userId, (oldInfo) => ({
    ...oldInfo,
    twitchAuthData: tokenInfo,
  }));

  res.writeHead(302, { Location: "/" + userId });
  res.end();
};
