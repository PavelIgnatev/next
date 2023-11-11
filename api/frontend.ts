import axios from "axios";

import { Dialogue } from "../@types/Dialogue";
import { urls } from "./urls";
import { Account } from "../@types/Account";

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

  postDialogueInfo(id: string, data: { blocked?: boolean }) {
    return axios.post<void>(urls.dialogueInfo, { id, data });
  }

  generateMessages(
    aiRoleBot: string,
    offerDescription: string
  ): Promise<{ data: string }> {
    const dialogue = [
      `Описание оффера: ${offerDescription}. Твоя роль - ${aiRoleBot}. Ты должен придумать диалог между двумя пользователями на основании данных выше длиной не менее 15 сообщений начни с простого вопроса например о деятельности клиента на текущий момент никакой информации о деятельности нет, клиент не связан с твоей ролью и не связан никак с оффером его деятельность может быть различной, а дальше представляйся своей ролью и продолжай диалог на основании этого, первым пишешь ты, клиент отвечает, ты обрабатываешь исходящий траффик сам пишешь выводи результат только роль ты или клиент и двоеточие без цифр первое сообщение должно быть с привествием и каким-то общим вопросом, а дальше диалог идет относительно оффера обязательно диалог должен приводить к цели которая написана в оффере`,
    ];
    const result = axios.post(urls.chatGptGenerate, { dialogue });

    return result as any;
  }
}

const FrontendApi = new FrontendService();
export default FrontendApi;
