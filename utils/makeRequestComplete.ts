import FrontendApi from "../api/frontend/frontend";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function makeRequestComplete(prompt: string, error = true) {
  while (true) {
    try {
      const response = await FrontendApi.generateComplete(prompt);
      const { data } = response;

      if (!data.trim()) {
        throw new Error("Пустое сообщение");
      }

      const message = data
        .replace("\n", "")
        .replace("\n", "")
        .replace("\n", "")
        .replace("\n", "")
        .replace("\n", "")
        .replace("\n", "")
        .replace("\n", "")
        .trim();

      if (
        message.includes("[") ||
        message.includes("]") ||
        message.includes("(") ||
        message.includes(")") ||
        message.includes("{") ||
        message.includes("}")
      ) {
        console.log(
          `\x1b[4mПотенциальное сообщение:\x1b[0m \x1b[36m${message}\x1b[0m`
        );
        throw new Error("В ответе содержатся подозрительные символы");
      }

      if (
        error &&
        (message.toLowerCase().includes("чем я") ||
          message.toLowerCase().includes("могу помоч") ||
          message.toLowerCase().includes("могу тебе") ||
          message.toLowerCase().includes("тебе помоч") ||
          message.toLowerCase().includes("конкретный вопрос") ||
          message.toLowerCase().includes("конкретные вопрос") ||
          message.toLowerCase().includes("готов на них") ||
          message.toLowerCase().includes("готов помоч") ||
          message.toLowerCase().includes("вопросы по данно") ||
          message.toLowerCase().includes("вас какие-либо") ||
          message.toLowerCase().includes("какие-либо вопрос") ||
          message.toLowerCase().includes("какие вопро") ||
          message.toLowerCase().includes("наших услуг") ||
          message.toLowerCase().includes("по поводу услуг") ||
          message.toLowerCase().includes("по поводу наших") ||
          message.toLowerCase().includes("вопросы по это") ||
          message.toLowerCase().includes("цели диалог") ||
          message.toLowerCase().includes("цель диалог") ||
          message.toLowerCase().includes("моя цел") ||
          message.toLowerCase().includes("готов ответит") ||
          message.toLowerCase().includes("них ответит") ||
          message.toLowerCase().includes("чем могу") ||
          message.toLowerCase().includes("полезен быть") ||
          message.toLowerCase().includes("быть полезен") ||
          message.toLowerCase().includes("пошло не так") ||
          message.toLowerCase().includes("что-то пошло") ||
          message.toLowerCase().includes("возникнут вопрос") ||
          message.toLowerCase().includes("возникли у вас") ||
          message.toLowerCase().includes("вас заинтересовало") ||
          message.toLowerCase().includes("у вас возникли"))
      ) {
        console.log(
          `\x1b[4mПотенциальное сообщение:\x1b[0m \x1b[36m${message}\x1b[0m`
        );
        throw new Error("В ответе содержатся подозретельные части сообщения");
      }

      return capitalizeFirstLetter(
        message
          .replace("Привет, ", "")
          .replace("Привет,", "")

          .replace("Привет! ", "")
          .replace("Привет!", "")
          .replace("Здравствуйте, ", "")
          .replace("Здравствуйте,", "")
          .replace("Здравствуйте! ", "")
          .replace("Здравствуйте!", "")
          .replace("Приветствую, ", "")
          .replace("Приветствую,", "")

          .replace("Приветствую! ", "")
          .replace("Приветствую!", "")
          .replace("Здравствуй, ", "")
          .replace("Здравствуй,", "")

          .replace("Здравствуй! ", "")
          .replace("Здравствуй!", "")
          .replace("Доброе утро, ", "")
          .replace("Доброе утро,", "")

          .replace("Доброе утро! ", "")
          .replace("Доброе утро!", "")
          .replace("Добрый вечер,", "")
          .replace("Добрый вечер! ", "")
          .replace("Добрый вечер!", "")
          .replace("Добрый день,", "")
          .replace("Добрый день! ", "")
          .replace("Добрый день!", "")
          .replace("Привет", "")
          .replace("Здравствуйте", "")
          .replace("Приветствую", "")
          .replace("Здравствуй", "")
          .replace("Доброе утро", "")
          .replace("Добрый вечер", "")
          .replace("Добрый день", "")
          .replace("привет", "")
          .replace("здравствуйте", "")
          .replace("приветствую", "")
          .replace("здравствуй", "")
          .replace("доброе утро", "")
          .replace("добрый вечер", "")
          .replace("добрый день", "")
          .replace("Hi,", "")
          .replace("Hi! ", "")
          .replace("Hi!", "")
          .replace("Hi", "")
          .replace("hi", "")
          .replace("Hello,", "")
          .replace("Hello! ", "")
          .replace("Hello!", "")
          .replace("Hello", "")
          .replace("hello", "")
          .replace("Good morning,", "")
          .replace("Good morning! ", "")
          .replace("Good morning!", "")
          .replace("Good morning", "")
          .replace("good morning", "")
          .replace("Good evening,", "")
          .replace("Good evening! ", "")
          .replace("Good evening!", "")
          .replace("Good evening", "")
          .replace("good evening", "")
          .replace("Good afternoon,", "")
          .replace("Good afternoon! ", "")
          .replace("Good afternoon!", "")
          .replace("Good afternoon", "")
          .replace("good afternoon", "")
      );
    } catch (error: any) {
      console.log(`Ошибка запроса. ${error.message}`);
    }
  }
}
