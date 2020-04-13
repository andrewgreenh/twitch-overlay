import "isomorphic-fetch";
import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../../shared/config";
import {
  getCurrentAccessToken,
  twitchLoginRedirectUri,
} from "../../../../shared/twitch/utils";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.query["user-id"] as string;

  const scopes = "user_read";

  try {
    await getCurrentAccessToken(userId);
    res.writeHead(302, { Location: "/" + userId });
    res.end();
    return;
  } catch (err) {
    console.error("No token present: " + err);
  }

  const baseUrl = "https://id.twitch.tv/oauth2/authorize";

  const idArg = "client_id=" + config.twitch_client_id;
  const stateArg = "state=" + encodeURIComponent(userId);
  const typeArg = "response_type=code";
  const scopeArg = scopes ? "scope=" + encodeURIComponent(scopes) : null;
  const redirectArg =
    "redirect_uri=" + encodeURIComponent(twitchLoginRedirectUri);

  const query = `?${[idArg, typeArg, scopeArg, stateArg, redirectArg]
    .filter(Boolean)
    .join("&")}`;

  res.writeHead(302, { Location: baseUrl + query });
  res.end();
};
