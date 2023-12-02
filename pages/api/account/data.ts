import type { NextApiRequest, NextApiResponse } from "next";

import backendAccountApi from "../../../api/backend-accounts";
import { Dialogue } from "../../../@types/Dialogue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Dialogue> | { message: string }>
) {
  try {
    const { username } = req.query;

    const data = await backendAccountApi.readAccount(String(username));

    res.status(200).json(data);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}