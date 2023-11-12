import { Dialogue } from "../../../../@types/Dialogue";
import { ViewDialogSendSvg } from "../__send-svg/view-dialog__send-svg";

import classes from "./view-dialog__buttons.module.css";

export interface ViewDialogButtonsProps {
  dialog?: Dialogue | null;
  managerMessageValue?: string;
  accountStatus: "Не определен" | "Ожидание..." | "Активен" | "Заблокирован";

  visibleSendMessage: boolean;

  postDialogueInfo: (data: {
    blocked?: boolean;
    viewed?: boolean;
    stopped?: boolean;
    lead?: boolean;
  }) => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  onManagerMessageChange: (value: string) => void;
  onManagerMessageSend: () => void;
}

export const ViewDialogButtons = (props: ViewDialogButtonsProps) => {
  const {
    dialog,
    accountStatus,
    visibleSendMessage,
    managerMessageValue,
    postDialogueInfo,
    onNextButtonClick,
    onPrevButtonClick,
    onManagerMessageChange,
    onManagerMessageSend,
  } = props;

  return (
    <div className={classes.viewDialogButtons}>
      {dialog?.stopped &&
        !dialog?.blocked &&
        visibleSendMessage &&
        accountStatus === "Активен" && (
          <div className={classes.viewDialogButtonsWrapper2}>
            <label htmlFor="viewDialogButtons" className={classes.labelField}>
              {dialog.managerMessage ? (
                <div>
                  <span className={classes.edit2}>Ручное управление. Режим редактирования. </span>
                  <br />
                  Введите новое сообщение (до 1000 символов) и сохраните его
                </div>
              ) : (
                <div>
                  <span className={classes.edit}>Ручное управление. </span>
                  <br />
                  Введите сообщение (до 1000 символов) для отправки и сохраните
                  его
                </div>
              )}
            </label>
            <div className={classes.viewDialogButtonsWrapper3}>
              <textarea
                onChange={(e) => {
                  onManagerMessageChange(e.currentTarget.value);
                }}
                className={classes.textareaField}
                value={managerMessageValue}
                id="viewDialogButtons"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={!managerMessageValue}
                onClick={onManagerMessageSend}
                className={classes.viewDialogButton2}
              >
                <ViewDialogSendSvg className={classes.viewDialogSendSvg} />
              </button>
            </div>
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
        {!dialog?.lead && (
          <button
            onClick={() => {
              postDialogueInfo({ viewed: true, lead: true });
            }}
            className={classes.viewDialogButton}
          >
            Перевести в лиды
          </button>
        )}
        {!dialog?.blocked &&
          accountStatus === "Активен" &&
          !dialog?.stopped && (
            <button
              onClick={() =>
                postDialogueInfo({ viewed: true, stopped: !dialog?.stopped })
              }
              className={classes.viewDialogButton}
            >
              Отключить ИИ
            </button>
          )}
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
