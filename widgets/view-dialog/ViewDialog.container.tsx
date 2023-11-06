import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import { ViewDialog } from "./ViewDialog";
import FrontendApi from "../../api/frontend";

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
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [onlyDialog, setOnlyDialog] = useState<boolean>(false);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [currentDialogIndex, setCurrentDialogIndex] = useState<number>(0);
  const [visibleStatisticsInfo, setVisibleStatisticsInfo] =
    useState<boolean>(false);

  const {
    mutate: postDialogueInfoWithoutSuccess,
    isError: postDialogueInfoErrorWithoutSuccess,
  } = useMutation((data: { blocked?: boolean; viewed?: boolean }) =>
    currentId
      ? FrontendApi.postDialogueInfo(currentId, data)
      : Promise.resolve(null)
  );

  const handleViewDialogIdsSuccess = useCallback((data: Array<string>) => {
    if (data && data.length > 0) {
      setCurrentId(data[0]);
      setCurrentDialogIndex(0);
    } else {
      setCurrentId(null);
    }
  }, []);
  const handleChangeGroupId = useCallback(
    (groupId: string) => {
      {
        postDialogueInfoWithoutSuccess({ viewed: true });
        setGroupId(groupId);
        setOnlyDialog(false);
        setOnlyNew(false);
      }
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
    data: viewDialogMessages,
    isFetching: viewDialogMessagesLoading,
    isError: viewDialogMessagesError,
  } = useQuery(
    "dialogueMessages",
    () =>
      groupId ? FrontendApi.getDialogueMessages(groupId) : Promise.resolve([]),
    {
      enabled: !!groupId,
      staleTime: Infinity,
    }
  );

  console.log(viewDialogMessages);

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
    {
      onSuccess: () => refetchViewDialogIds(),
    }
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

  const visibleStatistics = useMemo(
    () =>
      Boolean(
        !viewDialogMessagesLoading &&
          viewDialogMessages &&
          viewDialogMessages.length > 0 &&
          !viewDialogMessagesError
      ),
    [viewDialogMessagesLoading, viewDialogMessages, viewDialogMessagesError]
  );

  const averageDialogDuration = useMemo(() => {
    if (!visibleStatistics || !Array.isArray(viewDialogMessages)) {
      return 0;
    }

    return avgMsgCount(viewDialogMessages, true);
  }, [visibleStatistics, viewDialogMessages]);

  const averageDialogDurationIfResponse = useMemo(() => {
    if (!visibleStatistics || !Array.isArray(viewDialogMessages)) {
      return 0;
    }

    return avgMsgCount(viewDialogMessages, false);
  }, [visibleStatistics, viewDialogMessages]);

  useEffect(() => {
    if (groupId) {
      refetchViewDialogIds();
    }
  }, [groupId, onlyDialog, onlyNew, refetchViewDialogIds]);

  useEffect(() => {
    if (currentId) {
      refetchViewDialogInfo();
    }
  }, [currentId, refetchViewDialogInfo]);

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
    if (postDialogueInfoError || postDialogueInfoErrorWithoutSuccess) {
      toast.error("Произошла ошибка. Попробуйте еще раз.");
    }
  }, [postDialogueInfoError, postDialogueInfoErrorWithoutSuccess]);

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
      visibleStatisticsInfo={visibleStatisticsInfo}
      onStatistics={() => {
        setVisibleStatisticsInfo((prev) => !prev);
      }}
      averageDialogDuration={averageDialogDuration}
      averageDialogDurationIfResponse={averageDialogDurationIfResponse}
    />
  );
};
