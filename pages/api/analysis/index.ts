import type { NextApiRequest, NextApiResponse } from "next";

import BackendAnalysisApi from "../../../api/backend/analysis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | { message: string }>
) {
  try {
    const companyId = await BackendAnalysisApi.getAnalysis();

    res.status(200).json(companyId);
  } catch ({ message }: any) {
    res.status(400).json({ message });
  }
}
