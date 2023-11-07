import { Header } from "../header/header";
import { ViewDialogMessages } from "../view-dialog/components/__messages/view-dialog__messages";
import { ParsingOptimazerScreen } from "./__screen/parsing-optimazer__screen";

import classes from "./parsing-optimazer.module.css";

interface ParsingOptimazerProps {
  generateLoading: boolean;
  aiRoleBot: string;
  companyDescription: string;

  dataGenerateLLM?: { data: string } | null;

  onChangeAiRoleBot: (value: string) => void;
  onChangeCompanyDescription: (value: string) => void;
  onGenerateClick: () => void;
}

export const ParsingOptimazer = (props: ParsingOptimazerProps) => {
  const {
    generateLoading,
    aiRoleBot,
    dataGenerateLLM,
    companyDescription,
    onChangeAiRoleBot,
    onChangeCompanyDescription,
    onGenerateClick,
  } = props;

  return (
    <div className={classes.parsingOptimazer}>
      <Header />
      <ParsingOptimazerScreen
        aiRoleBot={aiRoleBot}
        companyDescription={companyDescription}
        onChangeAiRoleBot={onChangeAiRoleBot}
        onChangeCompanyDescription={onChangeCompanyDescription}
        onGenerateClick={onGenerateClick}
        generateLoading={generateLoading}
      />

      {dataGenerateLLM && (
        <div className={classes.parsingOptimazerLLM}>
          <ViewDialogMessages
            messages={dataGenerateLLM.data.split("\n").filter(Boolean)}
          />
        </div>
      )}
    </div>
  );
};
