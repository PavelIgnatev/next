import type { NextApiRequest, NextApiResponse } from "next";

import backendApi from "../../../api/backend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string> | { message: string }>
) {
  try {
    const { groupId, onlyDialog, onlyNew } = req.query;

    const data = await backendApi.getIdsByGroupId(
      Number(groupId),
      Boolean(onlyNew && onlyNew === "true"),
      Boolean(onlyDialog && onlyDialog === "true")
    );

    res.status(200).json(data);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
