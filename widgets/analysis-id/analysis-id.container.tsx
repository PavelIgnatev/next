import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import { notification } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

import FrontendAnalysisApi from "../../api/frontend/analysis";
import { AnalysisId } from "./analysis-id";
import { makeRequestComplete } from "../../utils/makeRequestComplete";

function checkArrayForSubstring(arr: Array<string>, substring: string) {
  for (let i = 0; i < arr.length; i++) {
    if (substring.includes(arr[i])) {
      return true;
    }
  }

  return false;
}

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

  const hasPromo =
    messages?.[dialogId]?.some((dialog) =>
      checkArrayForSubstring(
        [
          "pdf",
          "материа",
          "промо",
          "сайт",
          "коммерческое",
          "ссылк",
          "кп ",
          "bot",
          "бот",
          "zoom",
          'зум',
          'встреч',
          'созвон',
          'звонок'
        ],
        (dialog.content ?? "").toLowerCase()
      )
    ) || false;

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
    async (
      dialogue: Array<{
        role: "assistant" | "system" | "user";
        content: string;
      }>
    ) =>
      makeRequestComplete(`
    ИСТОРИЯ ДИАЛОГА:
      ${[...dialogue]
        .slice(-8)
        .map(
          (dialog) =>
            `# ${dialog.role === "user" ? "Павел" : "Евгений"}: ${
              dialog.content
            }`
        )
        .join("\n")}
    ТВОЕ ИМЯ: Евгений
    ТВОЯ РОЛЬ: ${analysisData && analysisData.aiRole ? analysisData.aiRole : ""}
    ОПИСАНИЕ КОМПАНИИ: ${
      analysisData && analysisData.companyDescription
        ? analysisData.companyDescription
        : ""
    }
    ${
      hasPromo &&
      `ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ: ${
        analysisData && analysisData.addedInformation
          ? analysisData.addedInformation
          : ""
      }`
    }
    ЦЕЛЬ ДЛЯ Евгений: ответить на сообщениe(я) пользователя Павел, проявить у него интерес к получению подробной информации. ${
      analysisData &&
      analysisData.goal &&
      dialogue.filter((e) => e.role === "user").length > 1
        ? "В случае, если пользователь проявил активный интерес к получению подробной информации - " +
          analysisData.goal
        : ""
    }.

    Верни сообщение ТОЛЬКО для пользователя Евгений, в котором будет содержаться основаная часть-отсылка на последний вопрос пользователя Павел с наводящим вопросом для продолжения общения.
    # Евгений:`),
    {
      onSuccess: (content) => {
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
        });
      },
    }
  );

  useEffect(() => {
    if (
      analysisData &&
      analysisData.dialogs &&
      dialogId !== analysisData.dialogs.length
    ) {
      if (initialDialogId >= 0 && analysisData.dialogs[initialDialogId]) {
        if (initialDialogId !== dialogId || !dialogId) {
          setDialogId(initialDialogId);

          setMessages(analysisData.dialogs);
        }
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
  }, [analysisData, dialogId]);

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
          analysisData?.language === "АНГЛИЙСКИЙ"
            ? defaultDialoguesEnglish
            : defaultDialogues,
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
