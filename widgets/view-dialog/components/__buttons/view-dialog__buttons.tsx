import { Dialogue } from "../../../../@types/Dialogue";

import classes from "./view-dialog__buttons.module.css";

export interface ViewDialogButtonsProps {
  dialog?: Dialogue | null;
  managerMessageValue: string;
  accountStatus: "Не определен" | "Ожидание..." | "Активен" | "Заблокирован";

  onlyDialog: boolean;
  onlyNew: boolean;

  postDialogueInfo: (data: {
    blocked?: boolean;
    viewed?: boolean;
    stopped?: boolean;
  }) => void;
  onOnlyNewClick: () => void;
  onOnlyDialogClick: () => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  onManagerMessageChange: (value: string) => void;
}

export const ViewDialogButtons = (props: ViewDialogButtonsProps) => {
  const {
    dialog,
    onlyDialog,
    onlyNew,
    accountStatus,
    managerMessageValue,
    postDialogueInfo,
    onOnlyNewClick,
    onOnlyDialogClick,
    onNextButtonClick,
    onPrevButtonClick,
    onManagerMessageChange,
  } = props;

  return (
    <div className={classes.viewDialogButtons}>
      {dialog?.stopped && !dialog?.blocked && accountStatus === "Активен" && (
        <div className={classes.viewDialogButtonsWrapper2}>
          <label htmlFor="viewDialogButtons" className={classes.labelField}>
            Ответное сообщение для пользователя (до 1000 символов)
          </label>
          <textarea
            onChange={(e) => {
              onManagerMessageChange(e.currentTarget.value);
            }}
            className={classes.textareaField}
            value={managerMessageValue}
            id="viewDialogButtons"
            maxLength={1000}
          />
        </div>
      )}
      <div
        className={classes.viewDialogButtonsWrapper}
        style={dialog?.blocked ? { margin: "0" } : {}}
      >
        {!dialog?.blocked && (
          <button
            onClick={() => {
              postDialogueInfo({ viewed: true, blocked: true, stopped: true });
            }}
            className={classes.viewDialogButton}
          >
            Заблокировать
          </button>
        )}
        {!dialog?.blocked && accountStatus === "Активен" && (
          <button
            onClick={() =>
              postDialogueInfo({ viewed: true, stopped: !dialog?.stopped })
            }
            className={classes.viewDialogButton}
          >
            {!dialog?.stopped ? "Отключить ИИ" : "Включить ИИ"}
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
