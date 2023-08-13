import { ViewDialogScreen } from "./components/__screen/view-dialog__screen";
import { ViewDialogSearch } from "./components/__search/view-dialog__search";
import { ViewDialogHeader } from "./components/__header/view-dialog__header";

import { Dialogue } from "../../@types/dialogue";

import classes from "./view-dialog.module.css";

export interface ViewDialogProps {
  currentDialogIndex: number;

  viewDialogIdsData?: Array<string> | null;
  viewDialogInfoData?: Dialogue | null;

  onlyDialog: boolean;
  onlyNew: boolean;
  viewDialogIdsLoading: boolean;
  viewDialogInfoLoading: boolean;
  viewDialogIdsError: boolean;
  viewDialogInfoError: boolean;
  postDialogueInfoLoading: boolean;

  postDialogueInfo: (data: { blocked?: boolean; viewed?: boolean }) => void;
  onChangeGroupId: (groupId: string) => void;
  onOnlyNewClick: () => void;
  onOnlyDialogClick: () => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
}

export const ViewDialog = (props: ViewDialogProps) => {
  const {
    currentDialogIndex,
    onlyDialog,
    onlyNew,
    onChangeGroupId,
    viewDialogIdsLoading,
    viewDialogIdsData,
    viewDialogInfoData,
    viewDialogInfoLoading,
    onOnlyNewClick,
    onOnlyDialogClick,
    onNextButtonClick,
    onPrevButtonClick,
    postDialogueInfo,
  } = props;

  return (
    <div className={classes.viewDialog}>
      <ViewDialogHeader />
      <ViewDialogSearch
        onSearch={onChangeGroupId}
        loading={viewDialogIdsLoading || viewDialogInfoLoading}
      />
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
    </div>
  );
};
