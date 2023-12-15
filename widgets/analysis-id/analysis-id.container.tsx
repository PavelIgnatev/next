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
          Ты выполняешь роль функции-продажника, ты умеешь качественно продавать, проявлять у юзера интерес и подводить к целевому действию, задавая качественные, ударяющие в боль, вопросы. У тебя есть данные о РОЛЬ КОМПАНИИ, ОПИСАНИЕ КОМПАНИИ, ЦЕЛЬ ДИАЛОГА и СООБЩЕНИЯ В ДИАЛОГЕ (история сообщения до текущего момента между Ассистент (роль assistant) и юзер (роль user)). Твоя задача вернуть наилучшее сообщение с вопросом для для подведения к ЦЕЛЬ ДИАЛОГА, но оно должно быть не длинее 30 слов. Максимальная длина ответного сообщения - 30 слов. Сам юзер, с которым ты общаешься, ничего о тебе не знает и с тобою раньше не был знаком, также у него может не быть запроса на услугу, но тебе нужно с этим работать. Не возвращай в ответе скобки: []. Если юзер просит информацию, которая не указана в ОПИСАНИЕ КОМПАНИИ - пропускай вопрос. Ты - профессиональный продажник, но не говори юзеру об этом. Действуй только в рамках того контекста, что имеешь, нельзя придумывать новую услугу, ты должен предлагать только то, что есть внутри ОПИСАНИЕ КОМПАНИИ или ЦЕЛЬ ДИАЛОГА. Если юзер проявил интерес - выдвинь оффер из ЦЕЛЬ ДИАЛОГА и поблагодари его за согласие, не задавая лишних вопросов. Юзер не должен знать ничего о том, что ты продажник, также не должен знать что у тебя есть ЦЕЛЬ ДИАЛОГА, держи это в секрете и не рассказывай его, представляйся только как РОЛЬ КОМПАНИИ. С юзером вы не знакомы. Не приветствуй юзера. Не извиняйся перед юзером и не проси у юзера прощения.
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
              : `Ответить на вопрос от юзера, после чего рассказать про ОПИСАНИЕ КОМПАНИИ, а дальше спросить у юзера было бы ему интересно узнать больше о ОПИСАНИЕ КОМПАНИИ.`
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
