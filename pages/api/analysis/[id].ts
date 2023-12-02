import type { NextApiRequest, NextApiResponse } from "next";

import BackendAnalysisApi from "../../../api/backend/analysis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { message: string }>
) {
  try {
    const { id } = req.query;

    if (!id) {
      throw new Error("Id не найден");
    }

    const analysis = await BackendAnalysisApi.getAnalysisByCompanyId(
      String(id)
    );

    if (!analysis) {
      return res.redirect("/");
    }

    res.status(200).json(analysis);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
