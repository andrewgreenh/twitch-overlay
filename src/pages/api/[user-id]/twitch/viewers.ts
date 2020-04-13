import { NextApiRequest, NextApiResponse } from "next";
import { nodeFetch } from "../../../../shared/nodeFetch";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const viewersResponse = await nodeFetch(
    "https://tmi.twitch.tv/group/user/andreasgruenh/chatters"
  );
  const viewersData = await viewersResponse.json();
  res.send(viewersData.chatters);
}
