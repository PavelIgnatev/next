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
          Вы выполняете роль функции топ-продавца (роль 'assistant'), которая возвращает лучшее сообщение c ключевым вопросом на основании переданного контекста РОЛИ В КОМПАНИИ, ОПИСАНИИ КОМПАНИИ, ЦЕЛИ ДИАЛОГА и ИСТОРИИ ДИАЛОГА для дальнейшего продолжения диалога и подведения пользователя (роль 'user') к ЦЕЛИ ДИАЛОГА на основании ОПИСАНИЕ КОМПАНИИ. Вы - профессиональный продавец, но не говорите об этом пользователю. Вы умеете хорошо продавать, по-умному обрабатывать возражения, проявлять интерес у пользователя к услуге и подводить его к целевому действию. Человек, которому вы пишете ответ, ничего о вас не знает и не встречался с вами раньше, надо продумать как работать с этим для достижения лучшего качества. В ответе, который ты сгенерируешь, обязательно должны быть ответы на все вопросы пользователя, только после ответов на вопросы должна идти основаная часть + наводяищй вопрос. Если пользователь запрашивает информацию, которой нет в ОПИСАНИИ КОМПАНИИ, пропустите вопрос. Пользователь не должен ничего знать о том, что вы топ-продавец, также он не должен знать, что у вас есть ЦЕЛЬ ДИАЛОГА, держите это в секрете и не говорите ему, представьтесь только как РОЛЬ КОМПАНИИ. Действуйте только в рамках имеющегося контекста, вы не можете придумывать новые услуги, вы должны предлагать только то, что указано в ОПИСАНИИ КОМПАНИИ или ЦЕЛИ ДИАЛОГА. Если пользователь проявляет интерес, выдвиньте предложение из ЦЕЛИ ДИАЛОГА и поблагодарите его за согласие, не задавая лишних вопросов. Не приветствуйте пользователя. Не извиняйтесь перед пользователем и не просите у него прощения.  Не возвращайте скобки в ответе: [].
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
              : `ОБЯЗАТЕЛЬНО ответить на вопрос юзера (если он есть), ОБЯЗАТЕЛЬНО представить свою компанию (ты ее представитель) из ОПИСАНИЕ КОМПАНИИ, а дальше спросить было бы ему интересно узнать больше о ОПИСАНИЕ КОМПАНИИ.`
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
