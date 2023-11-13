import { ViewDialogScreen } from "./components/__screen/view-dialog__screen";
import { ViewDialogSearch } from "./components/__search/view-dialog__search";
import { ViewDialogStatistics } from "./components/__statistics/view-dialog__statistics";
import { Header } from "../header/header";

import { Dialogue } from "../../@types/Dialogue";
import classes from "./view-dialog.module.css";
import { ViewDialogTopButtons } from "./components/__top-buttons/view-dialog__buttons";
import { Account } from "../../@types/Account";

export interface ViewDialogProps {
  activeTab: "Все" | "Диалоги" | "Лиды" | "Ручное управление";
  viewDialogCounts?: { [key: string]: number } | null;

  currentDialogIndex: number;
  averageDialogDuration: number;
  secondsToRefresh: number;
  averageDialogDurationIfResponse: number;
  messagesToDialog: number;
  managerMessageValue: string;
  messagesDialogCount: number;
  viewAccountData?: Account | null;
  viewDialogIdsData?: Array<string> | null;
  viewDialogInfoData?: Dialogue | null;
  statisticsByDay: { [key: string]: { dateCreated: Date; messages: number }[] };

  visibleSendMessage: boolean;
  viewDialogIdsLoading: boolean;
  viewDialogInfoLoading: boolean;
  viewDialogIdsError: boolean;
  viewDialogInfoError: boolean;
  postDialogueInfoLoading: boolean;
  viewAccountDataLoading: boolean;
  visibleStatistics: boolean;
  visibleStatisticsInfo: boolean;
  accountStatus: "Не определен" | "Ожидание..." | "Активен" | "Заблокирован";

  postDialogueInfo: (data: {
    blocked?: boolean;
    viewed?: boolean;
    stopped?: boolean;
  }) => void;
  onChangeGroupId: (groupId: string) => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  onStatistics: () => void;
  onManagerMessageSend: () => void;
  onManagerMessageChange: (value: string) => void;
  onChangeActiveTab: (
    value: "Все" | "Диалоги" | "Лиды" | "Ручное управление"
  ) => void;
}

export const ViewDialog = (props: ViewDialogProps) => {
  const {
    activeTab,
    currentDialogIndex,
    averageDialogDuration,
    averageDialogDurationIfResponse,
    messagesToDialog,
    managerMessageValue,
    viewDialogCounts,
    messagesDialogCount,
    secondsToRefresh,
    statisticsByDay,
    visibleSendMessage,
    accountStatus,
    viewAccountData,
    onChangeGroupId,
    viewAccountDataLoading,
    viewDialogIdsLoading,
    viewDialogIdsData,
    postDialogueInfoLoading,
    viewDialogInfoData,
    viewDialogInfoLoading,
    visibleStatisticsInfo,
    onNextButtonClick,
    onPrevButtonClick,
    postDialogueInfo,
    visibleStatistics,
    onManagerMessageChange,
    onManagerMessageSend,
    onStatistics,
    onChangeActiveTab,
  } = props;

  return (
    <div className={classes.viewDialog}>
      <Header />
      <ViewDialogSearch
        onSearch={onChangeGroupId}
        loading={
          viewDialogIdsLoading ||
          viewDialogInfoLoading ||
          postDialogueInfoLoading ||
          viewAccountDataLoading
        }
        visibleStatistics={visibleStatistics}
        onStatistics={onStatistics}
        dialog={viewDialogInfoData}
        dialogIds={viewDialogIdsData}
      />
      {viewDialogIdsData &&
        viewDialogIdsData.length > 0 &&
        viewDialogInfoData &&
        !viewDialogInfoLoading &&
        !viewAccountDataLoading &&
        !viewDialogIdsLoading &&
        !postDialogueInfoLoading && (
          <ViewDialogTopButtons
            activeTab={activeTab}
            onChangeActiveTab={onChangeActiveTab}
            viewDialogCounts={viewDialogCounts}
          />
        )}
      {!visibleStatisticsInfo ? (
        <ViewDialogScreen
          accountStatus={accountStatus}
          messagesDialogCount={messagesDialogCount}
          managerMessageValue={managerMessageValue}
          dialogIds={viewDialogIdsData}
          dialog={viewDialogInfoData}
          dialogIdsLoading={viewDialogIdsLoading}
          postDialogueInfoLoading={postDialogueInfoLoading}
          dialogLoading={viewDialogInfoLoading}
          viewAccountDataLoading={viewAccountDataLoading}
          viewAccountData={viewAccountData}
          dialogIndex={currentDialogIndex}
          onNextButtonClick={onNextButtonClick}
          onPrevButtonClick={onPrevButtonClick}
          postDialogueInfo={postDialogueInfo}
          onManagerMessageChange={onManagerMessageChange}
          onManagerMessageSend={onManagerMessageSend}
          visibleSendMessage={visibleSendMessage}
          secondsToRefresh={secondsToRefresh}
        />
      ) : (
        <ViewDialogStatistics
          averageDialogDuration={averageDialogDuration}
          averageDialogDurationIfResponse={averageDialogDurationIfResponse}
          statisticsByDay={statisticsByDay}
          messagesToDialog={messagesToDialog}
        />
      )}
    </div>
  );
};
