import { useMemo } from "react";
import { MagnifyingGlass, TailSpin } from "react-loader-spinner";

import { Dialogue } from "../../../../@types/Dialogue";

import { ViewDialogMessages } from "../__messages/view-dialog__messages";
import { ViewDialogButtons } from "../__buttons/view-dialog__buttons";

import classes from "./view-dialog__screen.module.css";

export interface ViewDialogScreenProps {
  dialogIndex: number;
  managerMessageValue?: string;
  messagesDialogCount: number;

  dialogIds?: Array<string> | null;
  dialog?: Dialogue | null;

  visibleSendMessage: boolean;

  dialogIdsLoading: boolean;
  dialogLoading: boolean;
  viewAccountDataLoading: boolean;
  postDialogueInfoLoading: boolean;
  accountStatus: "Не определен" | "Ожидание..." | "Активен" | "Заблокирован";

  postDialogueInfo: (data: {
    blocked?: boolean;
    viewed?: boolean;
    stopped?: boolean;
  }) => void;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  onManagerMessageChange: (value: string) => void;
  onManagerMessageSend: () => void;
}

export const ViewDialogScreen = (props: ViewDialogScreenProps) => {
  const {
    postDialogueInfo,
    dialogIndex,
    managerMessageValue,
    messagesDialogCount,
    visibleSendMessage,
    accountStatus,
    dialog,
    dialogIds,
    dialogIdsLoading,
    postDialogueInfoLoading,
    viewAccountDataLoading,
    dialogLoading,
    onNextButtonClick,
    onPrevButtonClick,
    onManagerMessageChange,
    onManagerMessageSend,
  } = props;

  const renderDefaultContent = useMemo(() => {
    return (
      <div className={classes.viewDialogScreenDefaultMessage}>
        <div className={classes.viewDialogScreenDefaultMessageTitle}>
          Введите ваш уникальный идентификатор, чтобы получить статистику по
          рассылке.
        </div>
        <div className={classes.viewDialogScreenDefaultMessageSubTitle}>
          Уникальный идентификатор - это специальный код, который позволяет
          системе отслеживать и анализировать конкретную рассылку.
        </div>
      </div>
    );
  }, []);

  const renderNothingFoundContent = useMemo(() => {
    return (
      <div className={classes.viewDialogScreenNothingFoundMessage}>
        <div className={classes.viewDialogScreenNothingFoundMessageTitle}>
          По вашему запросу ничего не найдено.
        </div>
        <div className={classes.viewDialogScreenNothingFoundMessageSubTitle}>
          К сожалению, не удалось найти результаты, соответствующие вашему
          запросу. Попробуйте изменить параметры поиска или обратитесь за
          помощью.
        </div>
      </div>
    );
  }, []);

  const renderLoadingContent = useMemo(() => {
    return (
      <div className={classes.viewDialogScreenLoading}>
        <TailSpin height={66} width={66} color="black" />
      </div>
    );
  }, []);

  const mainTitleMessage = useMemo(() => {
    if (messagesDialogCount > 1) {
      return "Диалог";
    }

    return "Сообщение";
  }, [messagesDialogCount]);

  const renderMainContent = useMemo(() => {
    return (
      <div className={classes.viewDialogScreenMain}>
        <div className={classes.viewDialogScreenMainCount}>
          <strong>{mainTitleMessage}</strong> {dialogIndex + 1}/
          {dialogIds?.length || 0}
        </div>
        <div className={classes.viewDialogScreenMainCount}>
          <strong>Статус: </strong>
          {dialog?.viewed ? (
            <span style={{ color: "green" }}>Прочитано</span>
          ) : (
            <span style={{ color: "red" }}>Не прочитано</span>
          )}
        </div>
        <div className={classes.viewDialogScreenMainHref}>
          <strong>Ссылка на аккаунт: </strong>
          {dialog?.username ? (
            <a
              href={`https://t.me/${dialog?.username}`}
              target="_blank"
              className={classes.viewDialogScreenMainA}
            >
              {dialog?.title}
            </a>
          ) : (
            "Отсутствует"
          )}
        </div>
        {dialog?.varUsername && dialog?.varUsername !== dialog?.username && (
          <div className={classes.viewDialogScreenMainHref}>
            <strong>Ссылка на аккаунт (альтернативная): </strong>
            <a
              href={`https://t.me/${dialog.varUsername}`}
              target="_blank"
              className={classes.viewDialogScreenMainA}
            >
              {dialog?.title}
            </a>
          </div>
        )}
        <div className={classes.viewDialogScreenMainPhone}>
          <strong>Телефон: </strong>
          {dialog?.phone ? dialog.phone : "Отсутствует"}
        </div>
        <div className={classes.viewDialogScreenMainSubTitle}>
          <strong>Описание: </strong>
          {dialog?.bio ? dialog.bio : "Отсутствует"}
        </div>
        <div className={classes.viewDialogAccountStatus}>
          Статус бота: &nbsp;
          <span
            style={{
              color:
                accountStatus === "Активен" || accountStatus === "Ожидание..."
                  ? "green"
                  : "red",
            }}
          >
            {accountStatus}
          </span>
        </div>
        <ViewDialogMessages
          messages={dialog?.messages}
          managerMessage={dialog?.managerMessage}
        />
        <ViewDialogButtons
          visibleSendMessage={visibleSendMessage}
          dialog={dialog}
          postDialogueInfo={postDialogueInfo}
          managerMessageValue={managerMessageValue}
          onManagerMessageChange={onManagerMessageChange}
          onManagerMessageSend={onManagerMessageSend}
          onNextButtonClick={onNextButtonClick}
          onPrevButtonClick={onPrevButtonClick}
          accountStatus={accountStatus}
        />
      </div>
    );
  }, [
    dialog,
    postDialogueInfo,
    mainTitleMessage,
    dialogIndex,
    dialogIds?.length,
    onNextButtonClick,
    onPrevButtonClick,
    accountStatus,
    managerMessageValue,
    visibleSendMessage,
  ]);

  const renderContent = useMemo(() => {
    if (!dialogIds && !dialogIdsLoading) {
      return renderDefaultContent;
    }

    if (
      dialogIdsLoading ||
      dialogLoading ||
      postDialogueInfoLoading ||
      viewAccountDataLoading
    ) {
      return renderLoadingContent;
    }

    if ((dialogIds && dialogIds.length === 0) || !dialog) {
      return renderNothingFoundContent;
    }

    return renderMainContent;
  }, [
    dialogIds,
    dialog,
    dialogIdsLoading,
    postDialogueInfoLoading,
    dialogLoading,
    renderDefaultContent,
    renderNothingFoundContent,
    viewAccountDataLoading,
    renderLoadingContent,
    renderMainContent,
  ]);

  return <div className={classes.viewDialogScreen}>{renderContent}</div>;
};
