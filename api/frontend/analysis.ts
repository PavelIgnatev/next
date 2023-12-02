import axios from "axios";

import { urls } from "../urls";

type analysisCreateData = {
  aiRole: string;
  companyName: string;
  companyDescription: string;
  goal: string;
};

class FrontendAnalysisService {
  async get<T>(url: string, params?: any) {
    return (await axios(url, { params }))?.data as T;
  }

  createAnalysis(data: analysisCreateData) {
    return axios.post<string>(urls.analysisCreate, data);
  }

  getAnalysis() {
    return this.get<Array<{
      companyName: string;
      companyDescription: string;
      companyId: string;
    }> | null>(urls.analysis, {});
  }

  getAnalysisByCompanyId(companyId: string) {
    return this.get<analysisCreateData | null>(`${urls.analysis}/${companyId}`);
  }
}

const FrontendAnalysisApi = new FrontendAnalysisService();
export default FrontendAnalysisApi;
