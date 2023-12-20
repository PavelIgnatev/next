import axios from "axios";

import { Dialogue } from "../../@types/Dialogue";
import { urls } from "../urls";
import { Account } from "../../@types/Account";

class FrontendService {
  async get<T>(url: string, params?: any) {
    return (await axios(url, { params }))?.data as T;
  }

  getDialogueInfo(id: string) {
    return this.get<Dialogue | null>(urls.dialogueInfo, { id });
  }

  getDialogueIds(
    groupId: string,
    activeTab: "Все" | "Диалоги" | "Лиды" | "Ручное управление"
  ) {
    return this.get<Array<string> | null>(urls.dialogueIds, {
      groupId,
      activeTab,
    });
  }

  getDialogues(groupId: string) {
    return this.get<Array<{ dateCreated: Date; messages: number }> | null>(
      urls.dialogues,
      {
        groupId,
      }
    );
  }

  getAccountData(username: string) {
    return this.get<Account | null>(urls.accountData, {
      username,
    });
  }

  postDialogueInfo(
    id: string,
    data: { blocked?: boolean; viewed?: boolean },
    incognito: boolean
  ) {
    if (incognito) {
      delete data["viewed"];
    }

    return axios.post<void>(urls.dialogueInfo, { id, data });
  }

  getDocumentCountsByGroupId(groupId: string) {
    return this.get<{ [key: string]: number }>(urls.dialogueCounts, {
      groupId,
    });
  }

  generateMessages(
    dialogue: Array<{ role: "assistant" | "system" | "user"; content: string }>
  ): Promise<{ data: string }> {
    const result = axios.post(urls.chatGptGenerate, { dialogue });

    return result as any;
  }

  generateComplete(prompt: string): Promise<{ data: string }> {
    const result = axios.post(urls.chatGptGenerateComplete, { prompt });

    return result as any;
  }
}

const FrontendApi = new FrontendService();
export default FrontendApi;
