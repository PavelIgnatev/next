import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import { ViewDialog } from "./ViewDialog";
import FrontendApi from "../../api/frontend";

function avgMsgCount(arrays: number[], includeLenOne = true) {
  const result = arrays.reduce(
    (acc, array) => {
      if (array > 1 || includeLenOne) {
        acc.totalMsgCount += array;
        acc.totalArraysCount++;
      }
      return acc;
    },
    { totalMsgCount: 0, totalArraysCount: 0 }
  );

  if (result.totalArraysCount === 0) {
    return 0;
  }

  return result.totalMsgCount / result.totalArraysCount;
}

export const ViewDialogContainer = () => {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string>("");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentDialogIndex, setCurrentDialogIndex] = useState<number>(0);
  const [managerMessage, setManagerMessage] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(300);
  const [incognito, setIncognito] = useState<boolean>(
    typeof window !== "undefined" &&
      localStorage.getItem("incognito") === "true"
  );
  const [visibleStatisticsInfo, setVisibleStatisticsInfo] =
    useState<boolean>(false);
  const [intervalId, setIntervalId] = useState(null);
  const [activeTab, setActiveTab] = useState<
    "Все" | "Диалоги" | "Лиды" | "Ручное управление"
  >("Все");

  const {
    mutate: postDialogueInfoWithoutSuccess,
    isError: postDialogueInfoErrorWithoutSuccess,
  } = useMutation(
    (data: {
      blocked?: boolean;
      viewed?: boolean;
      stopped?: boolean;
      managerMessage?: string;
    }) =>
      currentId
        ? FrontendApi.postDialogueInfo(currentId, data, incognito)
        : Promise.resolve(null)
  );

  const handleViewDialogIdsSuccess = useCallback((data: Array<string>) => {
    if (data && data.length > 0) {
      setCurrentId(data[0]);
      setCurrentDialogIndex(0);
      setManagerMessage("");
    } else {
      setCurrentId(null);
      setManagerMessage("");
    }
  }, []);
  const handleChangeGroupId = useCallback(
    (groupId: string) => {
      setVisibleStatisticsInfo(false);
      postDialogueInfoWithoutSuccess({ viewed: true });
      setGroupId(groupId);
      setManagerMessage("");
      setActiveTab("Все");
    },
    [postDialogueInfoWithoutSuccess]
  );

  const {
    data: viewDialogIdsData,
    isFetching: viewDialogIdsLoading,
    isError: viewDialogIdsError,
    refetch: refetchViewDialogIds,
  } = useQuery(
    "dialogueIds",
    () =>
      groupId
        ? FrontendApi.getDialogueIds(groupId, activeTab)
        : Promise.resolve([]),
    {
      enabled: !!groupId,
      onSuccess: handleViewDialogIdsSuccess,
      staleTime: Infinity,
    }
  );
  const {
    data: viewDialogCounts,
    isFetching: viewDialogCountsLoading,
    isError: viewDialogCountsError,
    refetch: refetchViewDialogCounts,
  } = useQuery(
    "dialogueCounts",
    () =>
      groupId
        ? FrontendApi.getDocumentCountsByGroupId(groupId)
        : Promise.resolve(null),
    {
      enabled: !!groupId,
      staleTime: Infinity,
    }
  );

  const {
    data: viewDialogs,
    isFetching: viewDialogsLoading,
    isError: viewDialogsError,
    refetch: refetchViewDialogs,
  } = useQuery(
    "dialogueMessages",
    () => (groupId ? FrontendApi.getDialogues(groupId) : Promise.resolve([])),
    {
      enabled: !!groupId,
      staleTime: Infinity,
    }
  );

  const {
    data: viewDialogInfoData,
    isFetching: viewDialogInfoLoading,
    isError: viewDialogInfoError,
    refetch: refetchViewDialogInfo,
  } = useQuery(
    "dialogueInfo",
    () =>
      currentId
        ? FrontendApi.getDialogueInfo(currentId)
        : Promise.resolve(null),
    {
      enabled: !!currentId,
      staleTime: Infinity,
      onSuccess: (e) => setAccountId(e?.accountId ?? ""),
    }
  );

  const {
    data: viewAccountData,
    isFetching: viewAccountDataLoading,
    isError: viewAccountDataError,
    refetch: refetchAccountData,
  } = useQuery(
    "accountData",
    () =>
      accountId ? FrontendApi.getAccountData(accountId) : Promise.resolve(null),
    {
      enabled: !!viewDialogInfoData,
      staleTime: Infinity,
    }
  );

  const {
    mutate: postDialogueInfo,
    isError: postDialogueInfoError,
    isLoading: postDialogueInfoLoading,
  } = useMutation(
    (data: { blocked?: boolean; viewed?: boolean; managerMessage?: string }) =>
      currentId
        ? FrontendApi.postDialogueInfo(currentId, data, incognito)
        : Promise.resolve(null),
    { onSuccess: () => refetchViewDialogInfo() }
  );

  const handleNextButtonClick = useCallback(() => {
    if (currentDialogIndex < (viewDialogIdsData?.length || 0) - 1) {
      postDialogueInfoWithoutSuccess({ viewed: true });
      setCurrentDialogIndex((prev) => prev + 1);
      setSecondsToRefresh(300);
    }
  }, [
    currentDialogIndex,
    viewDialogIdsData,
    postDialogueInfoWithoutSuccess,
    setSecondsToRefresh,
  ]);

  const handlePrevButtonClick = useCallback(() => {
    if (currentDialogIndex > 0) {
      postDialogueInfoWithoutSuccess({ viewed: true });
      setCurrentDialogIndex((prev) => prev - 1);
      setSecondsToRefresh(300);
    }
  }, [currentDialogIndex, postDialogueInfoWithoutSuccess, setSecondsToRefresh]);

  const handleManagerMessageChange = useCallback(
    (value: string) => {
      setManagerMessage(value);
    },
    [setManagerMessage]
  );

  const handleManagerMessageSend = useCallback(() => {
    if (viewDialogInfoData?.managerMessage !== managerMessage) {
      postDialogueInfo({ managerMessage });
      setManagerMessage("");
    }
  }, [postDialogueInfo, managerMessage, viewDialogInfoData]);

  const handleChangeIncognito = () => {
    localStorage.setItem("incognito", incognito ? "false" : "true");
    setIncognito((p) => !p);
  };

  const visibleStatistics = useMemo(
    () =>
      Boolean(
        !viewDialogsLoading &&
          viewDialogs &&
          viewDialogs.length > 0 &&
          !viewDialogsError
      ),
    [viewDialogsLoading, viewDialogs, viewDialogsError]
  );
  const statisticsByDay = useMemo(() => {
    if (!visibleStatistics || !viewDialogs) {
      return {};
    }

    return viewDialogs.reduce<{
      [key: string]: { dateCreated: Date; messages: number }[];
    }>((acc, cur) => {
      const { dateCreated } = cur;
      const date = new Date(dateCreated);
      const day = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime();

      if (!acc[day]) {
        acc[day] = [];
      }

      acc[day].push(cur);

      return acc;
    }, {});
  }, [visibleStatistics, viewDialogs]);

  const averageDialogDuration = useMemo(() => {
    if (!visibleStatistics || !viewDialogs) {
      return 0;
    }

    return avgMsgCount(
      viewDialogs.map((dialog) => dialog?.messages ?? 0),
      true
    );
  }, [visibleStatistics, viewDialogs]);

  const averageDialogDurationIfResponse = useMemo(() => {
    if (!visibleStatistics || !viewDialogs) {
      return 0;
    }

    return avgMsgCount(
      viewDialogs.map((dialog) => dialog?.messages ?? 0),
      false
    );
  }, [visibleStatistics, viewDialogs]);

  const messagesToDialog = useMemo(() => {
    if (!visibleStatistics || !viewDialogs) {
      return 0;
    }

    return (
      (viewDialogs.filter((dialog) => dialog.messages && dialog.messages > 1)
        .length /
        viewDialogs.length) *
      100
    );
  }, [visibleStatistics, viewDialogs]);

  const visibleSendMessage = useMemo(() => {
    if (managerMessage) {
      return true;
    }

    return true;
  }, [managerMessage]);

  const accountStatus = useMemo(() => {
    if (viewAccountDataLoading) {
      return "Ожидание...";
    }

    if (viewAccountDataError || !viewAccountData) {
      return "Заблокирован";
    }

    if (!viewAccountData.banned) {
      return "Активен";
    }

    return "Заблокирован";
  }, [viewAccountDataLoading, viewAccountData, viewAccountDataError]);

  useEffect(() => {
    if (groupId && activeTab) {
      refetchViewDialogIds();
    }
  }, [groupId, activeTab]);

  useEffect(() => {
    if (groupId) {
      refetchViewDialogs();
    }
  }, [groupId, refetchViewDialogs]);

  useEffect(() => {
    if (groupId) {
      setSecondsToRefresh(300);
      refetchViewDialogCounts();
    }
  }, [groupId, setSecondsToRefresh, refetchViewDialogCounts]);

  useEffect(() => {
    if (currentId) {
      refetchViewDialogInfo();
      setAccountId("");
    }
  }, [currentId, refetchViewDialogInfo, setAccountId]);

  useEffect(() => {
    if (viewDialogIdsData && viewDialogIdsData[currentDialogIndex]) {
      setCurrentId(viewDialogIdsData[currentDialogIndex]);
    }
  }, [currentDialogIndex, viewDialogIdsData]);

  useEffect(() => {
    if (viewDialogIdsError) {
      setCurrentId(null);

      toast.error("Произошла ошибка. Попробуйте еще раз.");
    }
  }, [viewDialogIdsError]);

  useEffect(() => {
    if (viewDialogInfoError) {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    }
  }, [viewDialogInfoError]);

  useEffect(() => {
    if (viewAccountDataError) {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    }
  }, [viewAccountDataError]);

  useEffect(() => {
    if (postDialogueInfoError || postDialogueInfoErrorWithoutSuccess) {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    }
  }, [postDialogueInfoError, postDialogueInfoErrorWithoutSuccess]);

  useEffect(() => {
    if (viewDialogCountsError) {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    }
  }, [viewDialogCountsError]);

  useEffect(() => {
    refetchAccountData();
  }, [accountId, refetchAccountData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!viewAccountData || viewAccountData.banned) {
        return;
      }

      setSecondsToRefresh((prevSeconds) => {
        if (prevSeconds === 1) {
          refetchViewDialogInfo();
          refetchAccountData();
          return 300;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    intervalId,
    setIntervalId,
    viewAccountData,
    refetchViewDialogInfo,
    refetchAccountData,
    secondsToRefresh,
  ]);

  return (
    <ViewDialog
      activeTab={activeTab}
      viewDialogCounts={viewDialogCounts}
      secondsToRefresh={secondsToRefresh}
      onChangeActiveTab={(value: typeof activeTab) => {
        setActiveTab(value);
        setSecondsToRefresh(300);
        refetchViewDialogCounts();
      }}
      incognito={incognito}
      currentDialogIndex={currentDialogIndex}
      postDialogueInfo={postDialogueInfo}
      viewDialogInfoLoading={viewDialogInfoLoading || viewDialogCountsLoading}
      viewDialogIdsData={viewDialogIdsData}
      viewDialogInfoData={viewDialogInfoData}
      viewDialogIdsLoading={viewDialogIdsLoading}
      viewAccountData={viewAccountData}
      viewAccountDataLoading={viewAccountDataLoading}
      postDialogueInfoLoading={postDialogueInfoLoading}
      viewDialogIdsError={viewDialogIdsError}
      viewDialogInfoError={viewDialogInfoError}
      onChangeGroupId={handleChangeGroupId}
      onNextButtonClick={handleNextButtonClick}
      onPrevButtonClick={handlePrevButtonClick}
      visibleStatistics={visibleStatistics}
      statisticsByDay={statisticsByDay}
      visibleSendMessage={visibleSendMessage}
      visibleStatisticsInfo={visibleStatisticsInfo}
      onStatistics={() => {
        setVisibleStatisticsInfo((prev) => !prev);
      }}
      accountStatus={accountStatus}
      averageDialogDuration={averageDialogDuration}
      averageDialogDurationIfResponse={averageDialogDurationIfResponse}
      messagesToDialog={messagesToDialog}
      onManagerMessageChange={handleManagerMessageChange}
      managerMessageValue={managerMessage}
      onManagerMessageSend={handleManagerMessageSend}
      messagesDialogCount={viewDialogInfoData?.messages?.length || 0}
      onChangeIncognito={handleChangeIncognito}
    />
  );
};
