import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { debounce } from "lodash";

import { ViewDialog } from "./ViewDialog";
import FrontendApi from "../../api/frontend";
import { Dialogue } from "../../@types/Dialogue";

function avgMsgCount(arrays: string[][], includeLenOne = true) {
  const result = arrays.reduce(
    (acc, array) => {
      if (array.length > 1 || includeLenOne) {
        acc.totalMsgCount += array.length;
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
  const [onlyDialog, setOnlyDialog] = useState<boolean>(false);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [currentDialogIndex, setCurrentDialogIndex] = useState<number>(0);
  const [managerMessage, setManagerMessage] = useState("");
  const [visibleStatisticsInfo, setVisibleStatisticsInfo] =
    useState<boolean>(false);

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
        ? FrontendApi.postDialogueInfo(currentId, data)
        : Promise.resolve(null)
  );

  const handleViewDialogIdsSuccess = useCallback((data: Array<string>) => {
    if (data && data.length > 0) {
      setCurrentId(data[0]);
      setCurrentDialogIndex(0);
      setAccountId("");
    } else {
      setCurrentId(null);
      setAccountId("");
    }
  }, []);
  const handleChangeGroupId = useCallback(
    (groupId: string) => {
      setVisibleStatisticsInfo(false);
      postDialogueInfoWithoutSuccess({ viewed: true });
      setGroupId(groupId);
      setOnlyDialog(false);
      setOnlyNew(false);
      setAccountId("");
    },
    [postDialogueInfoWithoutSuccess]
  );
  const handleOnlyNewClick = useCallback(() => {
    postDialogueInfoWithoutSuccess({ viewed: true });
    setOnlyNew((prev) => !prev);
  }, [postDialogueInfoWithoutSuccess]);
  const handleOnlyDialogClick = useCallback(() => {
    postDialogueInfoWithoutSuccess({ viewed: true });
    setOnlyDialog((prev) => !prev);
  }, [postDialogueInfoWithoutSuccess]);

  const {
    data: viewDialogIdsData,
    isFetching: viewDialogIdsLoading,
    isError: viewDialogIdsError,
    refetch: refetchViewDialogIds,
  } = useQuery(
    "dialogueIds",
    () =>
      groupId
        ? FrontendApi.getDialogueIds(groupId, onlyDialog, onlyNew)
        : Promise.resolve([]),
    {
      enabled: !!groupId,
      onSuccess: handleViewDialogIdsSuccess,
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
    (data: { blocked?: boolean; viewed?: boolean }) =>
      currentId
        ? FrontendApi.postDialogueInfo(currentId, data)
        : Promise.resolve(null),
    { onSuccess: () => refetchViewDialogInfo() }
  );

  const handleNextButtonClick = useCallback(() => {
    if (currentDialogIndex < (viewDialogIdsData?.length || 0) - 1) {
      postDialogueInfoWithoutSuccess({ viewed: true });
      setCurrentDialogIndex((prev) => prev + 1);
    }
  }, [currentDialogIndex, viewDialogIdsData, postDialogueInfoWithoutSuccess]);

  const handlePrevButtonClick = useCallback(() => {
    if (currentDialogIndex > 0) {
      postDialogueInfoWithoutSuccess({ viewed: true });
      setCurrentDialogIndex((prev) => prev - 1);
    }
  }, [currentDialogIndex, postDialogueInfoWithoutSuccess]);

  const handleManagerMessageChangeApi = useCallback(
    debounce((value: string) => {
      postDialogueInfoWithoutSuccess({ managerMessage: value });
    }, 500),
    []
  );

  const handleManagerMessageChange = useCallback(
    (value: string) => {
      setManagerMessage(value);
      handleManagerMessageChangeApi(value);
    },
    [setManagerMessage, handleManagerMessageChangeApi]
  );

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

    return viewDialogs.reduce<{ [key: string]: Dialogue[] }>((acc, cur) => {
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
      viewDialogs.map((dialog) => dialog?.messages ?? []),
      true
    );
  }, [visibleStatistics, viewDialogs]);

  const averageDialogDurationIfResponse = useMemo(() => {
    if (!visibleStatistics || !viewDialogs) {
      return 0;
    }

    return avgMsgCount(
      viewDialogs.map((dialog) => dialog?.messages ?? []),
      false
    );
  }, [visibleStatistics, viewDialogs]);

  const messagesToDialog = useMemo(() => {
    if (!visibleStatistics || !viewDialogs) {
      return 0;
    }

    return (
      (viewDialogs.filter(
        (dialog) => dialog.messages && dialog.messages.length > 1
      ).length /
        viewDialogs.length) *
      100
    );
  }, [visibleStatistics, viewDialogs]);

  const accountStatus = useMemo(() => {
    if (viewAccountDataLoading) {
      return "Ожидание...";
    }
    console.log(viewAccountData)
    if (viewAccountDataError || !viewAccountData) {
      return "Не определен";
    }

    if (!viewAccountData.banned) {
      return "Активен";
    }

    return "Заблокирован";
  }, [viewAccountDataLoading, viewAccountData, viewAccountDataError]);

  useEffect(() => {
    if (groupId) {
      refetchViewDialogIds();
    }
  }, [groupId, onlyDialog, onlyNew, refetchViewDialogIds]);

  useEffect(() => {
    if (groupId) {
      refetchViewDialogs();
    }
  }, [groupId, refetchViewDialogs]);

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
    if (viewDialogInfoData && viewDialogInfoData.managerMessage) {
      setManagerMessage(viewDialogInfoData.managerMessage);
    }
  }, [viewDialogInfoData]);

  useEffect(() => {
    refetchAccountData();
  }, [accountId, refetchAccountData]);

  // useEffect(() => {
  //   if (viewDialogInfoData) {
  //     refetchAccountData();
  //   }
  // }, [viewDialogInfoData, refetchAccountData]);

  return (
    <ViewDialog
      currentDialogIndex={currentDialogIndex}
      onlyDialog={onlyDialog}
      onlyNew={onlyNew}
      postDialogueInfo={postDialogueInfo}
      viewDialogIdsData={viewDialogIdsData}
      viewDialogInfoData={viewDialogInfoData}
      viewDialogIdsLoading={viewDialogIdsLoading}
      viewDialogInfoLoading={viewDialogInfoLoading}
      postDialogueInfoLoading={postDialogueInfoLoading}
      viewDialogIdsError={viewDialogIdsError}
      viewDialogInfoError={viewDialogInfoError}
      onChangeGroupId={handleChangeGroupId}
      onOnlyNewClick={handleOnlyNewClick}
      onOnlyDialogClick={handleOnlyDialogClick}
      onNextButtonClick={handleNextButtonClick}
      onPrevButtonClick={handlePrevButtonClick}
      visibleStatistics={visibleStatistics}
      statisticsByDay={statisticsByDay}
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
    />
  );
};
