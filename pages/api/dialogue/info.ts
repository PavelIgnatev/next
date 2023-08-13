import type { NextApiRequest, NextApiResponse } from "next";

import backendApi from "../../../api/backend";
import { Dialogue } from "../../../@types/dialogue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Dialogue | null | { message: string }>
) {
  try {
    if (req.method === "POST") {
      const { id, data = {} } = req.body;

      await backendApi.postDialogue(String(id), data);
      res.status(200).json(data);
    } else {
      const { id } = req.query;

      const data = await backendApi.getDialogue(String(id));
      res.status(200).json(data);
    }
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
