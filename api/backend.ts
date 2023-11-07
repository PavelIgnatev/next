const { MongoClient, Db, Collection, ObjectId } = require("mongodb");
import { config as dotenvConfig } from "dotenv";

import { Dialogue } from "../@types/dialogue";

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
    onlyNew = false,
    onlyDialog = false
  ): Promise<string[]> {
    await this.connect();

    let query: {
      groupId: number;
      viewed?: boolean;
      ["messages.1"]?: { $exists: true };
    } = { groupId };

    if (onlyNew) {
      query.viewed = false;
    }

    if (onlyDialog) {
      query["messages.1"] = { $exists: true };
    }

    const ids = await this.collection?.distinct("_id", query);
    return ids || [];
  }

  async getDialoguesByGroupId(groupId: number): Promise<Dialogue[]> {
    await this.connect();

    const result = await this.collection?.find({ groupId }).toArray();

    return result || [];
  }
}

const BackendApi = new BackendService();
export default BackendApi;
