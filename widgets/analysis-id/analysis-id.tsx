import { Spin, Typography } from "antd";

import classes from "./analysis-id.module.css";
import { AnalysisIdDialogue } from "./__dialogue/analysis-id__dialogue";

type analysisCreateData = {
  aiRole: string;
  companyName: string;
  companyDescription: string;
  goal: string;
  dialogs: Array<{ role: "user" | "assistant" | "system"; content: string }>[];
};

interface AnalysisIdProps {
  analysisData?: analysisCreateData | null;
  analysisLoading: boolean;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  messageLoading: boolean;

  onNewDialog: () => void;
  onSaveMessage: (message: string) => void;
  onHistoryDialogClick: (dialogName: number) => void;
}

export const AnalysisId = (props: AnalysisIdProps) => {
  const {
    analysisData,
    analysisLoading,
    messages,
    onNewDialog,
    onSaveMessage,
    onHistoryDialogClick,
    messageLoading,
  } = props;

  if (analysisLoading) {
    return (
      <div
        className={classes.analysisId}
        style={{ justifyContent: "space-around" }}
      >
        <Spin tip="Loading" size="large"></Spin>
      </div>
    );
  }

  return (
    <div className={classes.analysisId}>
      <Typography.Title
        level={1}
        style={{ margin: "1em 0", textAlign: "center" }}
      >
        Эмуляция диалогов для компании {analysisData?.companyName}
      </Typography.Title>
      <AnalysisIdDialogue
        messages={messages}
        dialogs={analysisData?.dialogs}
        messageLoading={messageLoading}
        onNewDialog={onNewDialog}
        onSaveMessage={onSaveMessage}
        onHistoryDialogClick={onHistoryDialogClick}
      />
    </div>
  );
};
