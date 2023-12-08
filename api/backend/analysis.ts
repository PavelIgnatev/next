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
      dialogs: [
        [
          { role: "assistant", content: "Здравствуйте! Меня зовут Евгений." },
          {
            role: "assistant",
            content:
              "Обнаружил ваш контакт в бизнес-чате, и меня заинтересовал вопрос о том, чем вы занимаетесь. Можете немного рассказать о себе?",
          },
        ],
      ],
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

  async postAnalysisByCompanyId(
    companyId: string,
    messages: Array<{
      role: "user" | "assistant" | "system";
      content: string;
    }>[]
  ) {
    await this.connect();

    const analysis = await this.collection?.findOne({ companyId });

    if (!analysis) {
      throw new Error(`Analysis with companyId ${companyId} not found`);
    }

    await this.collection?.updateOne(
      { companyId },
      {
        $set: {
          dialogs: messages,
        },
      }
    );

    const updatedAnalysis = await this.collection?.findOne({ companyId });
    return updatedAnalysis;
  }
}

const BackendApi = new BackendAnalysisService();
export default BackendApi;
