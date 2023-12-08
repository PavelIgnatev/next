import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";
import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";

import FrontendAnalysisApi from "../../api/frontend/analysis";
import { AnalysisId } from "./analysis-id";
import { makeRequestGPT } from "../../utils/makeRequestGPT";

const defaultDialogues = [
  { role: "assistant" as "assistant", content: "Здравствуйте! Меня зовут Евгений." },
  {
    role: "assistant" as "assistant",
    content: "Обнаружил ваш контакт в бизнес-чате, и меня заинтересовал вопрос о том, чем вы занимаетесь. Можете немного рассказать о себе?",
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
Твоя роль: ${analysisData && analysisData.aiRole ? analysisData.aiRole : ""}.
Описание компании: ${
            analysisData && analysisData.companyDescription
              ? analysisData.companyDescription
              : ""
          } 
Целевое действие:  ${
            analysisData && analysisData.goal ? analysisData.goal : ""
          } 
Твоя задача: отвечать пользователю и вести к целевому действию по воронке (не торопясь и не переходя к следующему этапу раньше, чем это необходимо): 
1) приветствие
2) проявление интереса к услуге из описания продукта, но без целевого действия 
3) выдвигаем оффер с ключевым наводящим вопросом по ключевому действию, учитывая также и контекст компании 
4) обрабатываем возражение или отвечаем на вопросы 
5) благодарим пользователя 

Длина ответного сообщения должна быть не более 25 слов. Если ты уже рассказал часть информации из "Описания компании", то повторно рассказывать не надо. Не путай этапы и не беги вперед. Не используй ссылки.  Не возвращай в ответе скобки: []. Если пользователь просит информацию, которая не указана в оффере - пропускай вопрос и продолжай вести по воронке. Отвечай так, будто ты реальный человек. Пиши корректно и по правилам русского языка. Не приветствуй. Не здоровайся. Не извиняйся. Обрабатывай возражения пользователя, пытайся проявить у него интерес к услуге. Если пользователь уже согласен - выдвинь оффер для пользователя из целевого действия и поблагодари его за согласие, не задавая лишних вопросов, а если пока еще не согласен, то в конце ответного сообщения задай наводящий вопрос относительно информации из оффера и описания продукта чтобы проявить интерес. Бессмысленные открытые вопросы задавать запрещено.`,
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
        const newMessages = [...p, defaultDialogues];

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

        postGenerateLLM([...p[dialogId], { role: "user", content: message }]);

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
