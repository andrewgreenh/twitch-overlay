import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../../shared/config";
import {
  getCurrentAccessToken,
  spotifyLoginRedirectUri,
} from "../../../../shared/spotify/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const scopes = "user-read-playback-state";

  const userId = req.query["user-id"] as string;

  try {
    await getCurrentAccessToken(userId);
    res.writeHead(302, { Location: "/" + userId });
    res.end();
    return;
  } catch (err) {
    console.error("No token present: " + err);
    console.log("No token found, redirecting to spotify login page.");
  }
  const baseUrl = "https://accounts.spotify.com/authorize";

  const idArg = "client_id=" + config.spotify_client_id;
  const stateArg = "state=" + encodeURIComponent(userId);
  const typeArg = "response_type=code";
  const scopeArg = scopes ? "scope=" + encodeURIComponent(scopes) : null;
  const redirectArg =
    "redirect_uri=" + encodeURIComponent(spotifyLoginRedirectUri);

  const query = `?${[idArg, typeArg, scopeArg, redirectArg, stateArg]
    .filter(Boolean)
    .join("&")}`;

  res.writeHead(302, { Location: baseUrl + query });
  res.end();
};
