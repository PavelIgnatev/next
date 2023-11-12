import axios from "axios";
const { MongoClient, Db, Collection, ObjectId } = require("mongodb");
import { config as dotenvConfig } from "dotenv";

import { Dialogue } from "../@types/Dialogue";

dotenvConfig();

class BackendService {
  private client: typeof MongoClient | null;
  private db: typeof Db | null;
  private collection: typeof Collection | null;

  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;

    this.connect = this.connect.bind(this);
  }

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    this.client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.client.db(process.env.MONGODB_NAME);
    this.collection = this.db.collection(process.env.MONGODB_COLLECTION);
  }

  async getDialogue(id: string): Promise<Dialogue | null> {
    await this.connect();

    const dialogue = await this.collection?.findOne({ _id: new ObjectId(id) });

    return dialogue || null;
  }

  async postDialogue(id: string, data: { blocked?: boolean }): Promise<void> {
    await this.connect();

    await this.collection?.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
      { upsert: true }
    );
  }

  async getIdsByGroupId(
    groupId: number,
    activeTabe: "Все" | "Диалоги" | "Лиды" | "Ручное управление"
  ): Promise<string[]> {
    await this.connect();

    let query: {
      groupId: number;
      viewed?: boolean;
      lead?: boolean;
      ["messages.1"]?: { $exists: true };
      stopped?: boolean;
      blocked?: { $ne: true };
    } = { groupId };

    if (activeTabe === "Диалоги") {
      query["messages.1"] = { $exists: true };
    }

    if (activeTabe === "Лиды") {
      query["lead"] = true;
    }

    if (activeTabe === "Ручное управление") {
      query["stopped"] = true;
      query["blocked"] = { $ne: true };
    }

    const priorityQuery = { ...query, viewed: false };
    const nonPriorityQuery = { ...query, viewed: { $ne: false } };

    const priorityIds = await this.collection?.distinct("_id", priorityQuery);
    const nonPriorityIds = await this.collection?.distinct(
      "_id",
      nonPriorityQuery
    );

    return (priorityIds || []).concat(nonPriorityIds || []);
  }

  async getDialoguesByGroupId(groupId: number): Promise<Dialogue[]> {
    await this.connect();

    const result = await this.collection
      ?.find(
        { groupId },
        {
          projection: {
            dateCreated: 1,
            messages: { $size: "$messages" },
            _id: 0,
          },
        }
      )
      .toArray();

    return result || [];
  }

  async generateLLM(dialogue: Array<string>): Promise<string> {
    const apiUrl = "http://194.135.25.158/answer/";

    const { data }: { data: string } = await axios.post(apiUrl, {
      dialogue,
    });

    return data;
  }
}

const BackendApi = new BackendService();
export default BackendApi;
