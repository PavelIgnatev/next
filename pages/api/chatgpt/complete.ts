import type { NextApiRequest, NextApiResponse } from "next";

import backendApi from "../../../api/backend/backend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { message: string }>
) {
  try {
    const { prompt } = req.body;
    const data = await backendApi.generateComplete(prompt as string);

    res.status(200).json(data);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
