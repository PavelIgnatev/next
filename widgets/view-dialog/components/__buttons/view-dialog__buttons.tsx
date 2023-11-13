import { useState } from "react";
import { Button, Modal } from "semantic-ui-react";

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

  const [visible, setVisible] = useState<"blocked" | "lead" | "AI" | null>(
    null
  );

  return (
    <div className={classes.viewDialogButtons}>
      <Modal
        dimmer="blurring"
        open={Boolean(visible)}
        onClose={() => setVisible(null)}
      >
        <Modal.Header>
          {visible === "blocked"
            ? "Заблокировать отправку сообщений в данном диалоге"
            : visible === "lead"
            ? 'Перевести диалог в папку "Лиды"'
            : 'Отключить ИИ и перевести диалог в папку "Ручное управление"'}
          ?
        </Modal.Header>
        <Modal.Content>
          {visible === "AI" && (
            <strong>
              После перевода ИИ перестанет формировать свои автоответы, но Вы
              сможете формировать и отправлять пользователю свои сообщения
              вручную.
              <br />
            </strong>
          )}
          {visible === "blocked" && (
            <strong>
              Данное действие приведет к прекращению автоответов от ИИ и отсутвию возможности
              написания пользователю вручную. Рекомендуем использовать только в случае с неадекватными пользователями.
              <br />
            </strong>
          )}
          Данное действие нельзя отменить. Пожалуйста, будьте внимательны при
          выполнении операции. <br />
        </Modal.Content>

        <Modal.Actions>
          <Button negative onClick={() => setVisible(null)}>
            Отмена
          </Button>
          <Button
            positive
            onClick={() => {
              if (visible === "blocked") {
                postDialogueInfo({
                  viewed: true,
                  blocked: true,
                  stopped: true,
                });
              } else if (visible === "lead") {
                postDialogueInfo({ viewed: true, lead: true });
              } else if (visible === "AI") {
                postDialogueInfo({ viewed: true, stopped: !dialog?.stopped });
              }
            }}
          >
            Да
          </Button>
        </Modal.Actions>
      </Modal>
      {dialog?.stopped &&
        !dialog?.blocked &&
        visibleSendMessage &&
        accountStatus === "Активен" && (
          <div className={classes.viewDialogButtonsWrapper2}>
            <label htmlFor="viewDialogButtons" className={classes.labelField}>
              {dialog.managerMessage ? (
                <div>
                  <span className={classes.edit2}>
                    Ручное управление. Режим редактирования.
                  </span>
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
      <div className={classes.viewDialogButtonsWrapper}>
        {!dialog?.blocked && (
          <button
            onClick={() => {
              setVisible("blocked");
            }}
            className={classes.viewDialogButton}
          >
            Заблокировать
          </button>
        )}
        {!dialog?.lead && (
          <button
            onClick={() => {
              setVisible("lead");
            }}
            className={classes.viewDialogButton}
          >
            Перевести в Лиды
          </button>
        )}
        {!dialog?.blocked &&
          accountStatus === "Активен" &&
          !dialog?.stopped && (
            <button
              onClick={() => setVisible("AI")}
              className={classes.viewDialogButton}
            >
              Ручное управление
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
