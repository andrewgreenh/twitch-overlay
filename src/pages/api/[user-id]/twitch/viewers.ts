import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const viewersResponse = await fetch(
    "https://tmi.twitch.tv/group/user/andreasgruenh/chatters"
  );
  const viewersData = await viewersResponse.json();
  res.send(viewersData.chatters);
}
