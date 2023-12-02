const { MongoClient, Db, Collection } = require("mongodb");

class BackendAnalysisService {
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
    this.collection = this.db.collection("analysis");
  }

  async createAnalysis(data: {
    aiRole: string;
    companyName: string;
    companyDescription: string;
    goal: string;
  }) {
    await this.connect();

    const companyId = String(Math.random()).substr(2, 12);

    await this.collection?.insertOne({
      companyId,
      ...data,
    });

    return companyId;
  }

  async getAnalysis() {
    await this.connect();

    const analysis = await this.collection
      ?.find(
        {},
        {
          projection: {
            companyId: 1,
            companyName: 3,
            companyDescription: 2,
          },
        }
      )
      .toArray();

    if (!analysis) {
      throw new Error("No analysis found");
    }

    return analysis;
  }

  async getAnalysisByCompanyId(companyId: string) {
    await this.connect();

    const analysis = await this.collection?.findOne({ companyId });

    if (!analysis) {
      throw new Error(`Analysis with companyId ${companyId} not found`);
    }

    return analysis;
  }
}

const BackendApi = new BackendAnalysisService();
export default BackendApi;
