import formUrlEncoded from "form-urlencoded";
import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../shared/config";
import {
  spotifyLoginRedirectUri,
  SpotifyTokenInformation,
} from "../../../shared/spotify/utils";
import { updateUserInfo } from "../../../shared/temp/userInfo";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const spotifyAuthCode = req.query.code;
  const userId = req.query.state as string;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formUrlEncoded({
      grant_type: "authorization_code",
      code: spotifyAuthCode,
      redirect_uri: spotifyLoginRedirectUri,
      client_id: config.spotify_client_id,
      client_secret: config.spotify_client_secret,
    }),
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

  const tokenInfo: SpotifyTokenInformation = {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: new Date(
      new Date().getTime() + result.expires_in * 1000
    ).toISOString(),
  };

  updateUserInfo(userId, (oldInfo) => ({
    ...oldInfo,
    spotifyAuthData: tokenInfo,
  }));

  res.writeHead(302, { Location: "/" + userId });
  res.end();
};
