import React, { useCallback, useEffect, useMemo, useRef } from "react";

import classes from "./view-dialog__messages.module.css";
import { Account } from "../../../../@types/Account";

interface ViewDialogMessagesProps {
  messages?: Array<string>;
  userName?: string;
  managerMessage?: string;
  viewAccountData?: Account | null;
}

export const ViewDialogMessages: React.FC<ViewDialogMessagesProps> = ({
  messages,
  userName: varUserName,
  managerMessage,
  viewAccountData,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const userName = varUserName || messages?.[0]?.split(":")?.[0];

  const getNameByMessage = useCallback((message: string) => {
    const [name] = message.split(":");

    return name;
  }, []);

  useEffect(() => {
    if (dialogRef.current) {
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.scrollTop = dialogRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, managerMessage]);

  const renderMessages = useMemo(() => {
    if (messages) {
      if (managerMessage) {
        // это чтобы рендерить потенциальное сообщение для отправки
        return [
          ...messages,
          `${
            viewAccountData?.name || messages?.[0]?.split(":")?.[0]
          }: ${managerMessage}`,
        ];
      }

      return messages;
    }
  }, [messages, managerMessage, userName, messages]);

  return (
    <div className={classes.dialogContainer}>
      <div className={classes.dialog} ref={dialogRef}>
        {renderMessages?.map((message, index) => {
          const name = getNameByMessage(message);
          const isRightAligned = name !== userName;
          const messageStyle = isRightAligned
            ? classes.messageRight
            : classes.messageLeft;

          return (
            <div
              key={index}
              className={`${classes.message} ${messageStyle} ${
                message ===
                `${
                  viewAccountData?.name || messages?.[0]?.split(":")?.[0]
                }: ${managerMessage}`
                  ? classes.aiMessage
                  : ""
              }`}
            >
              {message.replace(`${name}: `, "").trim()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
