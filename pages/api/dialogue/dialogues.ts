import type { NextApiRequest, NextApiResponse } from "next";

import backendApi from "../../../api/backend";
import { Dialogue } from "../../../@types/Dialogue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Dialogue> | { message: string }>
) {
  try {
    const { groupId } = req.query;

    const data = await backendApi.getDialoguesByGroupId(Number(groupId));

    res.status(200).json(data);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
