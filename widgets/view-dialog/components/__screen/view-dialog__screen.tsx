import { useMemo } from "react";
import { MagnifyingGlass } from "react-loader-spinner";

import { Dialogue } from "../../../../@types/Dialogue";

import { ViewDialogMessages } from "../__messages/view-dialog__messages";
import { ViewDialogButtons } from "../__buttons/view-dialog__buttons";

import classes from "./view-dialog__screen.module.css";

export interface ViewDialogScreenProps {
  dialogIndex: number;
  managerMessageValue: string;

  dialogIds?: Array<string> | null;
  dialog?: Dialogue | null;

  onlyDialog: boolean;
  onlyNew: boolean;
  dialogIdsLoading: boolean;
  dialogLoading: boolean;
  accountStatus: "Не определен" | "Ожидание..." | "Активен" | "Заблокирован";

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

export const ViewDialogScreen = (props: ViewDialogScreenProps) => {
  const {
    postDialogueInfo,
    dialogIndex,
    managerMessageValue,
    onlyDialog,
    onlyNew,
    accountStatus,
    dialog,
    dialogIds,
    dialogIdsLoading,
    dialogLoading,
    onOnlyNewClick,
    onOnlyDialogClick,
    onNextButtonClick,
    onPrevButtonClick,
    onManagerMessageChange,
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
        <MagnifyingGlass
          height={66}
          width={66}
          color="black"
          glassColor="white"
        />
      </div>
    );
  }, []);

  const mainTitleMessage = useMemo(() => {
    if (onlyDialog) {
      if (onlyNew) {
        return "Новый диалог";
      }
      return "Диалог";
    }

    if (onlyNew) {
      return "Новое сообщение";
    }
    return "Сообщение";
  }, [onlyDialog, onlyNew]);

  const renderMainContent = useMemo(() => {
    return (
      <div className={classes.viewDialogScreenMain}>
        <div className={classes.viewDialogScreenMainCount}>
          <strong>{mainTitleMessage}</strong> {dialogIndex + 1}/
          {dialogIds?.length || 0}
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
        <ViewDialogMessages messages={dialog?.messages} />
        <ViewDialogButtons
          dialog={dialog}
          postDialogueInfo={postDialogueInfo}
          onlyDialog={onlyDialog}
          onlyNew={onlyNew}
          managerMessageValue={managerMessageValue}
          onManagerMessageChange={onManagerMessageChange}
          onOnlyNewClick={onOnlyNewClick}
          onOnlyDialogClick={onOnlyDialogClick}
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
    onlyDialog,
    onlyNew,
    onOnlyNewClick,
    onOnlyDialogClick,
    onNextButtonClick,
    onPrevButtonClick,
    accountStatus,
    managerMessageValue,
  ]);

  const renderContent = useMemo(() => {
    if (!dialogIds && !dialogIdsLoading) {
      return renderDefaultContent;
    }

    if (dialogIdsLoading || dialogLoading) {
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
    dialogLoading,
    renderDefaultContent,
    renderNothingFoundContent,
    renderLoadingContent,
    renderMainContent,
  ]);

  return <div className={classes.viewDialogScreen}>{renderContent}</div>;
};
