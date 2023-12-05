import type { NextApiRequest, NextApiResponse } from "next";

import backendApi from "../../../api/backend/backend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string> | { message: string }>
) {
  try {
    const { groupId, activeTab } = req.query;

    const data = await backendApi.getIdsByGroupId(
      Number(groupId),
      String(activeTab) as "Все" | "Диалоги" | "Лиды" | "Ручное управление"
    );

    res.status(200).json(data);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
