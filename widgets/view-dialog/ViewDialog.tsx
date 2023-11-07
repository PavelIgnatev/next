import { ViewDialogScreen } from "./components/__screen/view-dialog__screen";
import { ViewDialogSearch } from "./components/__search/view-dialog__search";
import { ViewDialogHeader } from "./components/__header/view-dialog__header";

import { Dialogue } from "../../@types/dialogue";

import classes from "./view-dialog.module.css";
import { ViewDialogStatistics } from "./components/__statistics/view-dialog__statistics";

export interface ViewDialogProps {
  currentDialogIndex: number;
  averageDialogDuration: number;
  averageDialogDurationIfResponse: number;
  messagesToDialog: number

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

  postDialogueInfo: (data: { blocked?: boolean }) => void;
  onChangeGroupId: (groupId: string) => void;
  onOnlyNewClick: () => void;
  onOnlyDialogClick: () => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  onStatistics: () => void;
}

export const ViewDialog = (props: ViewDialogProps) => {
  const {
    currentDialogIndex,
    averageDialogDuration,
    averageDialogDurationIfResponse,
    messagesToDialog,
    onlyDialog,
    onlyNew,
    statisticsByDay,
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
    onStatistics,
  } = props;

  return (
    <div className={classes.viewDialog}>
      <ViewDialogHeader />
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
          onlyNew={onlyNew}
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
