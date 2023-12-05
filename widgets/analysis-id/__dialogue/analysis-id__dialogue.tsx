import React, { useState } from "react";
import { Input, Button, List, Drawer, Popconfirm } from "antd";

import { ViewDialogMessages } from "../../view-dialog/components/__messages/view-dialog__messages";

import classes from "./analysis-id__dialogue.module.css";
import { Account } from "../../../@types/Account";

interface AnalysisIdDialogueProps {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  dialogs?: Array<{ role: "user" | "assistant" | "system"; content: string }>[];
  messageLoading: boolean;

  onNewDialog: () => void;
  onSaveMessage: (message: string) => void;
  onHistoryDialogClick: (dialogName: number) => void;
}

export const AnalysisIdDialogue = (props: AnalysisIdDialogueProps) => {
  const {
    messages,
    dialogs,
    messageLoading,
    onNewDialog,
    onSaveMessage,
    onHistoryDialogClick,
  } = props;
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);

  const [visibleSavedDialog, setVisibleSavedDialog] = useState(false);

  return (
    <div className={classes.analysisIdDialogue}>
      <div className={classes.viewDialog}>
        <div className={classes.viewDialogButtons}>
          <Button
            type="dashed"
            onClick={() => setVisibleSavedDialog(true)}
            className={classes.button}
            disabled={messageLoading}
          >
            История всех диалогов
          </Button>

          <Popconfirm
            title="Начать новый диалог?"
            description="История данного диалога будет сохранена."
            onConfirm={() => onNewDialog()}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              type="dashed"
              className={classes.button}
              disabled={messageLoading}
            >
              Начать новый диалог
            </Button>
          </Popconfirm>
          <Button
            type="dashed"
            className={classes.button}
            disabled={messageLoading}
            onClick={() => {
              const currentUrl = window.location.href;
              setCopied(false);
              navigator.clipboard.writeText(currentUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 5000);
              });
            }}
          >
            {copied ? "Ссылка скопирована!" : "Копировать ссылку на диалог"}
          </Button>
        </div>

        <ViewDialogMessages
          messages={messages.map((message) =>
            message.role === "user"
              ? `Клиент: ${message.content}`
              : `Менеджер: ${message.content}`
          )}
          viewAccountData={{ name: "Клиент" } as Account}
          className={classes.viewDialogMessages}
          messageLoading={messageLoading}
        />

        <div className={classes.viewDialogInputWrapper}>
          <Input
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            placeholder="Введите сообщение..."
            className={classes.viewDialogInput}
            size="large"
          />
          <Button
            type="primary"
            onClick={() => {
              onSaveMessage(value);
              setValue("");
            }}
            loading={false}
            size="large"
            disabled={messageLoading}
          >
            Отправить
          </Button>
        </div>
      </div>

      <Drawer
        title="История диалогов"
        placement="right"
        closable={true}
        onClose={() => setVisibleSavedDialog(false)}
        open={visibleSavedDialog}
      >
        <List
          dataSource={Array.from(
            { length: Object.keys(dialogs || {}).length },
            (_, index) => index
          ).reverse()}
          renderItem={(dialogueId, index) => (
            <List.Item
              key={dialogueId}
              onClick={() => {
                setVisibleSavedDialog(false);
                onHistoryDialogClick(dialogueId);
              }}
              className={classes.dialogueListItem}
            >
              <List.Item.Meta
                title={`Диалог ${dialogueId + 1}`}
                className={classes.meta}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
};
