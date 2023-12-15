import type { NextApiRequest, NextApiResponse } from "next";

import BackendAnalysisApi from "../../../api/backend/analysis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { message: string }>
) {
  try {
    const { aiRole, companyDescription, companyName, goal, isEnglish = false } =
      req.body;

    if (!aiRole || !companyDescription || !goal || !companyName) {
      throw new Error("Недостаточное количество аргументов");
    }

    const companyId = await BackendAnalysisApi.createAnalysis({
      aiRole,
      companyDescription,
      companyName,
      goal,
      isEnglish,
    });

    res.status(200).json(companyId);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
