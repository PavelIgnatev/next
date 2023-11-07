import axios from "axios";

import { Dialogue } from "../@types/dialogue";
import { urls } from "./urls";

class FrontendService {
  async get<T>(url: string, params?: any) {
    return (await axios(url, { params }))?.data as T;
  }

  getDialogueInfo(id: string) {
    return this.get<Dialogue | null>(urls.dialogueInfo, { id });
  }

  getDialogueIds(groupId: string, onlyDialog: boolean, onlyNew: boolean) {
    return this.get<Array<string> | null>(urls.dialogueIds, {
      groupId,
      onlyDialog,
      onlyNew,
    });
  }

  getDialogues(groupId: string) {
    return this.get<Array<Dialogue> | null>(urls.dialogues, {
      groupId,
    });
  }

  postDialogueInfo(id: string, data: { blocked?: boolean }) {
    return axios.post<void>(urls.dialogueInfo, { id, data });
  }
}

const FrontendApi = new FrontendService();
export default FrontendApi;
