import { ColorRing } from "react-loader-spinner";

import classes from "./parsing-optimazer__screen.module.css";

interface ParsingOptimazerScreenProps {
  generateLoading: boolean;
  aiRoleBot: string;
  companyDescription: string;

  onChangeAiRoleBot: (value: string) => void;
  onChangeCompanyDescription: (value: string) => void;
  onGenerateClick: () => void;
}

export const ParsingOptimazerScreen = (props: ParsingOptimazerScreenProps) => {
  const {
    aiRoleBot,
    companyDescription,
    onChangeAiRoleBot,
    onChangeCompanyDescription,
    onGenerateClick,
    generateLoading,
  } = props;

  return (
    <div className={classes.parsingOptimazerScreen}>
      <label htmlFor="parsingOptimazerAiRole" className={classes.labelField}>
        Роль AI бота (до 1500 символов)
      </label>
      <textarea
        value={aiRoleBot}
        onChange={(e) => onChangeAiRoleBot(e.currentTarget.value)}
        className={classes.textareaField}
        id="parsingOptimazerAiRole"
        maxLength={1500}
      />
      <label
        htmlFor="parsingOptimazerCompanyDescription"
        className={classes.labelField}
        style={{ marginTop: "10px" }}
      >
        Описание оффера (до 1500 символов)
      </label>
      <textarea
        value={companyDescription}
        onChange={(e) => onChangeCompanyDescription(e.currentTarget.value)}
        className={classes.textareaField}
        id="parsingOptimazerCompanyDescription"
        maxLength={1500}
      />
      <button
        disabled={generateLoading}
        className={classes.button}
        onClick={onGenerateClick}
      >
        {!generateLoading ? (
          "Cгенерировать"
        ) : (
          <ColorRing
            height={50}
            width={50}
            colors={["orange", "orange", "orange", "orange", "orange"]}
          />
        )}
      </button>
    </div>
  );
};
