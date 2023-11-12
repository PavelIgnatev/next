import { Dialogue } from "../../../../@types/Dialogue";
import { ViewDialogSendSvg } from "../__send-svg/view-dialog__send-svg";

import classes from "./view-dialog__buttons.module.css";

export interface ViewDialogTopButtonsProps {
  activeTab: "Все" | "Диалоги"  | 'Лиды'| "Ручное управление";
  onChangeActiveTab: (
    activeTab: "Все" | "Диалоги" | 'Лиды' | "Ручное управление"
  ) => void;
}

export const ViewDialogTopButtons = (props: ViewDialogTopButtonsProps) => {
  const { activeTab, onChangeActiveTab } = props;

  return (
    <div className={classes.viewDialogTopButtons}>
      <div className={classes.viewDialogTopButtonsWrapper}>
        <button
          onClick={() => onChangeActiveTab("Все")}
          className={`${classes.viewDialogButton} ${
            activeTab === "Все" && classes.all
          }`}
        >
          Все
        </button>
        <button
          onClick={() => onChangeActiveTab("Диалоги")}
          className={`${classes.viewDialogButton} ${
            activeTab === "Диалоги" && classes.dialog
          }`}
        >
          Диалоги
        </button>
        <button
          onClick={() => onChangeActiveTab("Лиды")}
          className={`${classes.viewDialogButton} ${
            activeTab === "Лиды" && classes.lead
          }`}
        >
          Лиды
        </button>
        <button
          onClick={() => onChangeActiveTab("Ручное управление")}
          className={`${classes.viewDialogButton} ${
            activeTab === "Ручное управление" && classes.managment
          }`}
        >
          Ручное управление
        </button>
      </div>
    </div>
  );
};
