import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../../shared/config";
import { nodeFetch } from "../../../../shared/nodeFetch";
import { getCurrentAccessToken } from "../../../../shared/twitch/utils";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query["user-id"] as string;

  const token = await getCurrentAccessToken(userId);

  try {
    const response = await nodeFetch(
      "https://api.twitch.tv/helix/users",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Client-ID": config.twitch_client_id,
        },
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const userId = (await response.json()).data[0].id;

    const followersResponse = await nodeFetch(
      "https://api.twitch.tv/helix/users/follows?to_id=" +
        userId,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Client-ID": config.twitch_client_id,
        },
      }
    );

    if (!followersResponse.ok) {
      throw new Error(await followersResponse.text());
    }

    res.send(await followersResponse.json());
    res.end();
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.statusMessage = String(err);
    res.end();
  }
}
