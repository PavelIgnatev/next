import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";

import FrontendAnalysisApi from "../../api/frontend/analysis";
import { AnalysisId } from "./analysis-id";
import { makeRequestGPT } from "../../utils/makeRequestGPT";

const defaultDialogues = [
  {
    role: "assistant" as "assistant",
    content: "Здравствуйте! Меня зовут Евгений.",
  },
  {
    role: "assistant" as "assistant",
    content:
      "Обнаружил ваш контакт в бизнес-чате, и меня заинтересовал вопрос о том, чем вы занимаетесь. Можете немного рассказать о себе?",
  },
];

const defaultDialoguesEnglish = [
  {
    role: "assistant" as "assistant",
    content: "Hello! My name is Eugene.",
  },
  {
    role: "assistant" as "assistant",
    content:
      "Discovered your contact in a business chat and I was interested in asking what you do. Can you tell me a little about yourself?",
  },
];

export const AnalysisIdContainer = () => {
  const router = useRouter();
  const { id: companyId, dialogId: queryDialogId } = router.query;
  const [api, contextHolder] = notification.useNotification();
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant" | "system"; content: string }>[]
  >([]);
  const [dialogId, setDialogId] = useState(0);
  const initialDialogId = queryDialogId
    ? parseInt(queryDialogId as string, 10) - 1
    : -1;

  const toastError = useCallback((description: string) => {
    api["error"]({
      message: "Произошла ошибка.",
      description,
      duration: 5,
    });
  }, []);
  const {
    data: analysisData,
    isLoading: analysisLoading,
    refetch: refetchAnalysisData,
  } = useQuery(
    "analysisById",
    () =>
      companyId
        ? FrontendAnalysisApi.getAnalysisByCompanyId(String(companyId))
        : Promise.resolve(null),
    {
      enabled: !!companyId,
      staleTime: Infinity,
      onError: () => router.push("/"),
    }
  );

  const { mutate: postAnalysisByCompanyId } = useMutation(
    ({
      companyId,
      messages,
    }: {
      companyId: string;
      messages: Array<{
        role: "assistant" | "system" | "user";
        content: string;
      }>[];
    }) => FrontendAnalysisApi.postAnalysisByCompanyId(companyId, messages),
    { onSuccess: () => refetchAnalysisData() }
  );

  const {
    mutate: postGenerateLLM,
    isLoading: postGenerateLLMLoading,
    isError: postGenerateLLMError,
  } = useMutation(
    (
      dialogue: Array<{
        role: "assistant" | "system" | "user";
        content: string;
      }>
    ) =>
      makeRequestGPT([
        {
          role: "system",
          content: `
          Вы выполняете роль топ-продавца, умеете очень хорошо продавать, проявлять интерес у пользователя к услуге и подводить его к целевому действию. У вас есть данные о вашей реальной РОЛИ В КОМПАНИИ, ОПИСАНИИ КОМПАНИИ, ЦЕЛИ ДИАЛОГА и СООБЩЕНИЯХ В ДИАЛОГЕ (история сообщений до текущего момента между помощником (роль помощника) и пользователем (роль пользователя)). Ваша задача - вернуть лучшее сообщение с вопросом на ЦЕЛЬ ДИАЛОГА, но оно должно быть не длиннее 30 слов. Максимальная длина ответного сообщения - 30 слов. Человек, с которым вы общаетесь, ничего о вас не знает и не встречался с вами раньше, и у него может не быть просьбы об услуге, но вы должны работать с этим. Не возвращайте скобки в ответе: []. Если пользователь запрашивает информацию, которой нет в ОПИСАНИИ КОМПАНИИ, пропустите вопрос. Вы - профессиональный продавец, но не говорите об этом пользователю. Действуйте только в рамках имеющегося контекста, вы не можете придумывать новые услуги, вы должны предлагать только то, что указано в ОПИСАНИИ КОМПАНИИ или ЦЕЛИ ДИАЛОГА. Если пользователь проявляет интерес, выдвиньте предложение из ЦЕЛИ ДИАЛОГА и поблагодарите его за согласие, не задавая лишних вопросов. Пользователь не должен ничего знать о том, что вы продавец, также он не должен знать, что у вас есть ЦЕЛЬ ДИАЛОГА, держите это в секрете и не говорите ему, представьтесь только как РОЛЬ КОМПАНИИ. Не приветствуйте пользователя. Не извиняйтесь перед пользователем и не просите у него прощения.
          Ниже предоставлена ДОПОЛНИТЕЛЬНАЯ информация:
          РОЛЬ ВНУТРИ КОМПАНИИ: ${
            analysisData && analysisData.aiRole ? analysisData.aiRole : ""
          }
          ОПИСАНИЕ КОМПАНИИ: ${
            analysisData && analysisData.companyDescription
              ? analysisData.companyDescription
              : ""
          }
          ЦЕЛЬ ДИАЛОГА:  ${
            analysisData &&
            analysisData.goal &&
            dialogue.filter((e) => e.role === "user").length > 1
              ? analysisData.goal
              : `Поблагодари юзера за ответ, если он задал вопрос - ответь, а дальше расскажи чем занимается  ОПИСАНИЕ КОМПАНИИ, после чего спроси у юзера было бы ему интересно узнать больше о ОПИСАНИЕ КОМПАНИИ.`
          }
          Максимальная длина ответного сообщения - 30 слов.`,
        },
        ...dialogue,
      ]),

    {
      onSuccess: (content) =>
        setMessages((p) => {
          p[dialogId] = [
            ...p[dialogId],
            { role: "assistant" as "assistant", content },
          ];

          postAnalysisByCompanyId({
            messages: p,
            companyId: String(companyId),
          });

          return p;
        }),
    }
  );

  useEffect(() => {
    if (
      analysisData &&
      analysisData.dialogs &&
      dialogId !== analysisData.dialogs.length
    ) {
      if (initialDialogId >= 0 && analysisData.dialogs[initialDialogId]) {
        setDialogId(initialDialogId);
        setMessages(analysisData.dialogs);
      } else {
        setDialogId(analysisData.dialogs.length - 1);
        setMessages(analysisData.dialogs);
        router.replace(
          {
            query: {
              ...router.query,
              dialogId: analysisData.dialogs.length,
            },
          },
          undefined,
          {
            shallow: true,
          }
        );
      }
    }
  }, [analysisData]);

  useEffect(() => {
    if (postGenerateLLMError) {
      toastError(
        "Произошла ошибка при написании сообщения, попробуйте отправить еще раз"
      );
    }
  }, [postGenerateLLMError]);

  const handleNewDialog = () => {
    if (messages?.[dialogId]?.length <= 2) {
      toastError(
        `Не получилось начать новый диалог.
      Пожалуйста, ответьте на сообщения Ai Менеджера, после чего попробуйте снова.`
      );
    } else if (messages && messages[dialogId]) {
      setMessages((p) => {
        const newMessages = [
          ...p,
          analysisData?.isEnglish ? defaultDialoguesEnglish : defaultDialogues,
        ];

        postAnalysisByCompanyId({
          messages: newMessages,
          companyId: String(companyId),
        });

        return newMessages;
      });

      setDialogId(messages.length);
      router.replace(
        { query: { ...router.query, dialogId: messages.length + 1 } },
        undefined,
        {
          shallow: true,
        }
      );
    }
  };
  const handleSaveMessage = (message: string) => {
    if (message) {
      setMessages((p) => {
        p[dialogId] = [...p[dialogId], { role: "user", content: message }];

        try {
          postGenerateLLM(p[dialogId]);
        } catch {}

        return p;
      });
    }
  };
  const handleHistoryDialogClick = (dialogId: number) => {
    setDialogId(dialogId);
    router.replace(
      { query: { ...router.query, dialogId: dialogId + 1 } },
      undefined,
      {
        shallow: true,
      }
    );
  };

  return (
    <>
      {contextHolder}
      <AnalysisId
        analysisData={analysisData}
        analysisLoading={analysisLoading}
        messages={messages?.[dialogId] || []}
        onNewDialog={handleNewDialog}
        onSaveMessage={handleSaveMessage}
        onHistoryDialogClick={handleHistoryDialogClick}
        messageLoading={postGenerateLLMLoading}
      />
    </>
  );
};
