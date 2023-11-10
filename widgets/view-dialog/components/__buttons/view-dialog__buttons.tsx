import { Dialogue } from "../../../../@types/dialogue";

import classes from "./view-dialog__buttons.module.css";

export interface ViewDialogButtonsProps {
  dialog?: Dialogue | null;

  onlyDialog: boolean;
  onlyNew: boolean;

  postDialogueInfo: (data: { blocked?: boolean; viewed?: boolean }) => void;
  onOnlyNewClick: () => void;
  onOnlyDialogClick: () => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
}

export const ViewDialogButtons = (props: ViewDialogButtonsProps) => {
  const {
    dialog,
    onlyDialog,
    onlyNew,
    postDialogueInfo,
    onOnlyNewClick,
    onOnlyDialogClick,
    onNextButtonClick,
    onPrevButtonClick,
  } = props;

  return (
    <div className={classes.viewDialogButtons}>
      <div className={classes.viewDialogButtonsWrapper}>
        {!dialog?.blocked && (
          <button
            onClick={() => postDialogueInfo({ viewed: true, blocked: true })}
            className={classes.viewDialogButton}
          >
            Заблокировать
          </button>
        )}
      </div>
      <div className={classes.viewDialogButtonsWrapper}>
        <button
          onClick={onOnlyDialogClick}
          className={classes.viewDialogButton}
        >
          {onlyDialog ? "Все сообщения" : "Только диалоги"}
        </button>
        <button onClick={onOnlyNewClick} className={classes.viewDialogButton}>
          {onlyNew ? "Вместе со старыми" : "Только новые"}
        </button>
      </div>
      <div className={classes.viewDialogButtonsWrapper}>
        <button
          onClick={onPrevButtonClick}
          className={classes.viewDialogButton}
        >
          Назад
        </button>
        <button
          onClick={onNextButtonClick}
          className={classes.viewDialogButton}
        >
          Вперед
        </button>
      </div>
    </div>
  );
};
