import { NextApiRequest, NextApiResponse } from "next";
import { nodeFetch } from "../../../../shared/nodeFetch";
import { getCurrentAccessToken } from "../../../../shared/twitch/utils";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query["user-id"] as string;

  const token = await getCurrentAccessToken(userId);

  try {
    const response = await nodeFetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const userId = (await response.json()).data[0].id;

    const followersResponse = await nodeFetch(
      "https://api.twitch.tv/helix/users/follows?to_id=" + userId,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!followersResponse.ok) {
      throw new Error(await followersResponse.text());
    }

    res.send(await followersResponse.json());
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.send(JSON.stringify(err));
    res.end();
  }
}
