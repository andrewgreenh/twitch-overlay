import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentAccessToken } from "../../../../shared/spotify/utils";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query["user-id"] as string;

  const token = await getCurrentAccessToken(userId);
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      res.statusCode = 500;
      res.send(await response.text());
      return;
    }

    if (response.status === 204) {
      res.statusCode = 204;
      res.statusMessage = "no content";
      res.end();
      return;
    }

    res.send(await response.json());
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = err;
    res.end();
  }
}
