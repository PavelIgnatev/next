import axios from "axios";

import { urls } from "../urls";

type analysisCreateData = {
  aiRole: string;
  companyName: string;
  companyDescription: string;
  goal: string;
  isEnglish: boolean;
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
      companyId: string;
      aiRole: string;
      companyName: string;
      companyDescription: string;
      goal: string;
    }> | null>(urls.analysis, {});
  }

  getAnalysisByCompanyId(companyId: string) {
    return this.get<{
      aiRole: string;
      companyName: string;
      companyDescription: string;
      goal: string;
      dialogs: Array<{
        role: "user" | "assistant" | "system";
        content: string;
      }>[];
      isEnglish?: boolean;
    } | null>(`${urls.analysis}/${companyId}`);
  }

  postAnalysisByCompanyId(
    companyId: string,
    messages: Array<{
      role: "assistant" | "system" | "user";
      content: string;
    }>[]
  ) {
    return axios.post(`${urls.analysis}/${companyId}`, { messages });
  }
}

const FrontendAnalysisApi = new FrontendAnalysisService();
export default FrontendAnalysisApi;
