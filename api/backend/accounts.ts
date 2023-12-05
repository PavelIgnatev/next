const { MongoClient, Db, Collection } = require("mongodb");
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

class BackendAccountService {
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
    this.collection = this.db.collection("accounts");
  }

  // метод для получения акканта по полю "username"
  async readAccount(username: string) {
    await this.connect();

    return await this.collection.findOne(
      { username },
      { projection: { banned: 1, name: 2, _id: 0 } }
    );
  }
}

const BackendApi = new BackendAccountService();
export default BackendApi;
