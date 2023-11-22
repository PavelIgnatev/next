import { useMemo } from "react";
import { TailSpin } from "react-loader-spinner";
import { Tooltip } from "react-tooltip";

import { Dialogue } from "../../../../@types/Dialogue";

import { ViewDialogMessages } from "../__messages/view-dialog__messages";
import { ViewDialogButtons } from "../__buttons/view-dialog__buttons";

import classes from "./view-dialog__screen.module.css";
import { Account } from "../../../../@types/Account";

export interface ViewDialogScreenProps {
  dialogIndex: number;
  managerMessageValue?: string;
  messagesDialogCount: number;
  secondsToRefresh: number;
  viewAccountData?: Account | null;

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
function convertSecondsToMinutes(seconds: number) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds: number | string = seconds % 60;

  // Добавляем ведущий ноль, если секунды меньше 10
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }

  return minutes + ":" + remainingSeconds;
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
    secondsToRefresh,
    dialogLoading,
    onNextButtonClick,
    onPrevButtonClick,
    viewAccountData,
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
          запросу. <br /> Попробуйте изменить параметры поиска или обратитесь за
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
        <div className={classes.wr}>
          <div className={classes.wrap}>
            <div className={classes.viewDialogScreenMainCount}>
              <strong>{mainTitleMessage}</strong> {dialogIndex + 1}/
              {dialogIds?.length || 0}
            </div>
            <div
              className={classes.viewDialogScreenMainCount}
              id={dialog?.viewed ? "prosm" : "neprosm"}
              style={{ display: "inline-block" }}
            >
              <strong>Статус: </strong>
              {dialog?.viewed ? (
                <span style={{ color: "green" }}>Просмотрено</span>
              ) : (
                <span style={{ color: "red" }}>Не просмотрено</span>
              )}
              <Tooltip anchorSelect="#prosm">
                Статус, показывающий, что ранее вы уже просмотрели актуальную
                версию диалога.
              </Tooltip>
              <Tooltip anchorSelect="#neprosm">
                Статус, показывающий, что вы еще не просматрели актуальную
                версию диалога.
              </Tooltip>
            </div>
            {dialog?.username && (
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
            )}
            {dialog?.varUsername &&
              dialog?.varUsername !== dialog?.username && (
                <div className={classes.viewDialogScreenMainHref}>
                  <strong>Ссылка на аккаунт: </strong>
                  <a
                    href={`https://t.me/${dialog.varUsername}`}
                    target="_blank"
                    className={classes.viewDialogScreenMainA}
                  >
                    {dialog?.title}
                  </a>
                </div>
              )}
            {dialog?.phone && (
              <div className={classes.viewDialogScreenMainPhone}>
                <strong>Телефон: </strong>
                {dialog?.phone ? dialog.phone : "Отсутствует"}
              </div>
            )}
            {dialog?.bio && (
              <div
                className={classes.viewDialogScreenMainSubTitle}
                id="not-clickable"
              >
                <strong>Описаниe: </strong>
                {dialog?.bio ? dialog.bio : "Отсутствует"}
              </div>
            )}
            <Tooltip anchorSelect="#not-clickable">{dialog?.bio}</Tooltip>
          </div>
          <div className={classes.wrap}>
            <div className={classes.viewDialogAccountStatus}>
              <div id={accountStatus === "Активен" ? "active" : "neactive"}>
                <strong>Статус бота: &nbsp;</strong>
                <span
                  style={{
                    color:
                      accountStatus === "Активен" ||
                      accountStatus === "Ожидание..."
                        ? "green"
                        : "red",
                  }}
                >
                  {accountStatus}
                </span>
              </div>
              <Tooltip anchorSelect="#active">
                Статус, показывающий, что аккунт, инициировавший <br /> общение
                свободен от бана и может продолжать диалог.
              </Tooltip>
              <Tooltip anchorSelect="#neactive">
                Статус, показывающий, что аккунт, инициировавший <br /> общение
                заблокирован, продолжения диалога не будет.
              </Tooltip>
              <div id="updater">
                {secondsToRefresh !== 300 &&
                  secondsToRefresh !== 299 &&
                  secondsToRefresh !== 298 &&
                  secondsToRefresh !== 297 &&
                  secondsToRefresh !== 296 && (
                    <div>
                      <strong>Обновление через: &nbsp;</strong>
                      <span
                        style={{
                          color: secondsToRefresh < 15 ? "red" : "green",
                        }}
                      >
                        {convertSecondsToMinutes(secondsToRefresh)}
                      </span>
                    </div>
                  )}
              </div>
              <Tooltip anchorSelect="#updater">
                Автоматическое обновление, актуализирующее информацию о диалоге.
                <br />
                Перед обновлением все данные сохраняются.
              </Tooltip>
            </div>
          </div>
        </div>
        <ViewDialogMessages
          userName={dialog?.title}
          messages={dialog?.messages}
          managerMessage={dialog?.managerMessage}
          viewAccountData={viewAccountData}
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
    convertSecondsToMinutes,
    dialogIndex,
    dialogIds?.length,
    onNextButtonClick,
    onPrevButtonClick,
    accountStatus,
    secondsToRefresh,
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
