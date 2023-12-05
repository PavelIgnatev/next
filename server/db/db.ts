import { MongoClient, Db } from "mongodb";

type CollectionNames = "accounts";

interface DatabaseQuery {
  [key: string]: string;
}

interface DatabaseProjection {
  [key: string]: number;
}

class DatabaseService {
  private client: MongoClient | null;
  private db: Db | null;

  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    this.client = await MongoClient.connect(process.env.MONGODB_URI!);
    this.db = this.client.db(process.env.MONGODB_NAME!);
  }

  async findOne<T>(
    collectionName: CollectionNames,
    query: DatabaseQuery,
    projection?: DatabaseProjection
  ) {
    await this.connect();

    if (!this.db) {
      throw new Error("Database connection not established.");
    }

    const collection = this.db.collection(collectionName);
    return collection.findOne(query, { projection }) as T;
  }
}

const db = new DatabaseService();
export { db };
