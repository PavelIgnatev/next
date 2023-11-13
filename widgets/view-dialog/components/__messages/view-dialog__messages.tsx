import React, { useCallback, useEffect, useMemo, useRef } from "react";

import classes from "./view-dialog__messages.module.css";
import { Account } from "../../../../@types/Account";

interface ViewDialogMessagesProps {
  messages?: Array<string>;
  managerMessage?: string;
  viewAccountData?: Account | null;
}

export const ViewDialogMessages: React.FC<ViewDialogMessagesProps> = ({
  messages,
  managerMessage,
  viewAccountData,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const mainName = messages?.[0]?.split(":")?.[0];

  const getNameByMessage = useCallback(
    (message: string) => {
      const [name] = message.split(":");

      return name;
    },
    [mainName]
  );

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
        return [...messages, `${viewAccountData?.name || mainName}: ${managerMessage}`];
      }

      return messages;
    }
  }, [messages, managerMessage, mainName]);

  return (
    <div className={classes.dialogContainer}>
      <div className={classes.dialog} ref={dialogRef}>
        {renderMessages?.map((message, index) => {
          const name = getNameByMessage(message);
          const isRightAligned = name === mainName;
          const messageStyle = isRightAligned
            ? classes.messageRight
            : classes.messageLeft;

          return (
            <div
              key={index}
              className={`${classes.message} ${messageStyle} ${
                message === `${viewAccountData?.name || mainName}: ${managerMessage}`
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
