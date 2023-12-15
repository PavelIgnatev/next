import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cx from "classnames";
import classes from "./view-dialog__messages.module.css";
import { Account } from "../../../../@types/Account";

interface ViewDialogMessagesProps {
  messages?: Array<string>;
  managerMessage?: string;
  viewAccountData?: Account | null;
  messageLoading?: boolean;
  className?: string;
}

export const ViewDialogMessages: React.FC<ViewDialogMessagesProps> = ({
  messages,
  managerMessage,
  viewAccountData,
  messageLoading,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(
    "Печатает сообщение"
  );

  const aiName = (
    viewAccountData?.name ||
    messages?.[0]?.split(":")?.[0]?.trim() ||
    "неизвестно"
  ).trim();

  const getNameByMessage = useCallback((message: string) => {
    const [name] = message.split(":");
    return name.trim();
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

  useEffect(() => {
    if (messageLoading) {
      const intervalId = setInterval(() => {
        setLoadingMessage((prevMessage) =>
          prevMessage === "Печатает сообщение..."
            ? "Печатает сообщение"
            : prevMessage + "."
        );
      }, 500);

      return () => clearInterval(intervalId);
    } else {
      setLoadingMessage("Печатает сообщение");
    }
  }, [messageLoading]);

  const renderMessages = useMemo(() => {
    if (messages) {
      if (managerMessage) {
        // This is to render a potential message to be sent
        return [...messages, `${aiName}: ${managerMessage}`];
      }

      return messages;
    }
  }, [messages, managerMessage, messages]);

  return (
    <div className={cx(classes.dialogContainer, className)}>
      <div className={classes.dialog} ref={dialogRef}>
        {renderMessages?.map((message, index) => {
          const name = getNameByMessage(message);
          const isRightAligned = name === aiName;

          const messageStyle = isRightAligned
            ? classes.messageRight
            : classes.messageLeft;

          return (
            <div
              key={index}
              className={`${classes.message} ${messageStyle} ${
                message === `${aiName}: ${managerMessage}`
                  ? classes.aiMessage
                  : ""
              }`}
            >
              {message.replace(`${name}: `, "").trim()}
            </div>
          );
        })}
        {messageLoading && (
          <div className={`${classes.message} ${classes.messageLeft}`}>
            {loadingMessage}
          </div>
        )}
      </div>
    </div>
  );
};
