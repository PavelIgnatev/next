import { ViewDialogScreen } from "./components/__screen/view-dialog__screen";
import { ViewDialogSearch } from "./components/__search/view-dialog__search";
import { ViewDialogStatistics } from "./components/__statistics/view-dialog__statistics";
import { Header } from "../header/header";

import { Dialogue } from "../../@types/Dialogue";
import classes from "./view-dialog.module.css";

export interface ViewDialogProps {
  currentDialogIndex: number;
  averageDialogDuration: number;
  averageDialogDurationIfResponse: number;
  messagesToDialog: number;
  managerMessageValue: string;

  viewDialogIdsData?: Array<string> | null;
  viewDialogInfoData?: Dialogue | null;
  statisticsByDay: { [key: string]: Dialogue[] };

  onlyDialog: boolean;
  onlyNew: boolean;
  viewDialogIdsLoading: boolean;
  viewDialogInfoLoading: boolean;
  viewDialogIdsError: boolean;
  viewDialogInfoError: boolean;
  postDialogueInfoLoading: boolean;
  visibleStatistics: boolean;
  visibleStatisticsInfo: boolean;
  accountStatus: "Не определен"  | "Ожидание..." | "Активен" | "Заблокирован";

  postDialogueInfo: (data: {
    blocked?: boolean;
    viewed?: boolean;
    stopped?: boolean;
  }) => void;
  onChangeGroupId: (groupId: string) => void;
  onOnlyNewClick: () => void;
  onOnlyDialogClick: () => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  onStatistics: () => void;
  onManagerMessageChange: (value: string) => void;
}

export const ViewDialog = (props: ViewDialogProps) => {
  const {
    currentDialogIndex,
    averageDialogDuration,
    averageDialogDurationIfResponse,
    messagesToDialog,
    onlyDialog,
    managerMessageValue,
    onlyNew,
    statisticsByDay,
    accountStatus,
    onChangeGroupId,
    viewDialogIdsLoading,
    viewDialogIdsData,
    viewDialogInfoData,
    viewDialogInfoLoading,
    visibleStatisticsInfo,
    onOnlyNewClick,
    onOnlyDialogClick,
    onNextButtonClick,
    onPrevButtonClick,
    postDialogueInfo,
    visibleStatistics,
    onManagerMessageChange,
    onStatistics,
  } = props;

  return (
    <div className={classes.viewDialog}>
      <Header />
      <ViewDialogSearch
        onSearch={onChangeGroupId}
        loading={viewDialogIdsLoading || viewDialogInfoLoading}
        visibleStatistics={visibleStatistics}
        onStatistics={onStatistics}
        dialog={viewDialogInfoData}
        dialogIds={viewDialogIdsData}
      />
      {!visibleStatisticsInfo ? (
        <ViewDialogScreen
          accountStatus={accountStatus}
          onlyNew={onlyNew}
          managerMessageValue={managerMessageValue}
          onlyDialog={onlyDialog}
          dialogIds={viewDialogIdsData}
          dialog={viewDialogInfoData}
          dialogIdsLoading={viewDialogIdsLoading}
          dialogLoading={viewDialogInfoLoading}
          onOnlyNewClick={onOnlyNewClick}
          onOnlyDialogClick={onOnlyDialogClick}
          dialogIndex={currentDialogIndex}
          onNextButtonClick={onNextButtonClick}
          onPrevButtonClick={onPrevButtonClick}
          postDialogueInfo={postDialogueInfo}
          onManagerMessageChange={onManagerMessageChange}
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
