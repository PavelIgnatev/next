import React, { useCallback, useEffect, useRef, useState } from "react";

import classes from "./view-dialog__messages.module.css";

interface ViewDialogMessagesProps {
  messages?: Array<string>;
}

export const ViewDialogMessages: React.FC<ViewDialogMessagesProps> = ({
  messages,
}) => {
  const [mainName, setMainName] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const getNameByMessage = useCallback(
    (message: string) => {
      const [name] = message.split(":");

      if (!mainName) {
        setMainName(name);
      }

      return name;
    },
    [mainName]
  );

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.scrollTop = dialogRef.current.scrollHeight;
    }
  }, [messages]);



  return (
    <div className={classes.dialogContainer} >
      <div className={classes.dialog} ref={dialogRef}>
        {messages?.map((message, index) => {
          const name = getNameByMessage(message);
          const isRightAligned = name === mainName;
          const messageStyle = isRightAligned
            ? classes.messageRight
            : classes.messageLeft;

          return (
            <div key={index} className={`${classes.message} ${messageStyle}`}>
              {message.replace(`${name}: `, "")}
            </div>
          );
        })}
      </div>
    </div>
  );
};