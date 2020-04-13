import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentAccessToken } from "../../../../shared/twitch/utils";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query["user-id"] as string;
  try {
    const token = await getCurrentAccessToken(userId);
    if (!token) {
      res.writeHead(401);
      res.end();
    } else {
      res.writeHead(200);
      res.end();
    }
    return;
  } catch (err) {
    res.writeHead(401);
    res.end();
  }
}
