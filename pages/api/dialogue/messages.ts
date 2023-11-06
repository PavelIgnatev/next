import type { NextApiRequest, NextApiResponse } from "next";

import backendApi from "../../../api/backend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Array<string>> | { message: string }>
) {
  try {
    const { groupId } = req.query;

    const data = await backendApi.getMessagesByGroupId(Number(groupId));

    res.status(200).json(data);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
