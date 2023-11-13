import classes from "./view-dialog__buttons.module.css";
import { Tooltip } from "react-tooltip";

export interface ViewDialogTopButtonsProps {
  activeTab: "Все" | "Диалоги" | "Лиды" | "Ручное управление";
  viewDialogCounts?: { [key: string]: number } | null;

  onChangeActiveTab: (
    activeTab: "Все" | "Диалоги" | "Лиды" | "Ручное управление"
  ) => void;
}

export const ViewDialogTopButtons = (props: ViewDialogTopButtonsProps) => {
  const { activeTab, viewDialogCounts, onChangeActiveTab } = props;

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
          Диалоги&nbsp;
          {viewDialogCounts?.["condition2"] ? (
            <span id={viewDialogCounts?.["condition2"] ? "id1" : ""}>
              ({viewDialogCounts?.["condition2"] || 0}🔔)
            </span>
          ) : (
            ""
          )}
          <Tooltip variant="info" anchorSelect="#id1">
            Количество непросмотренных диалогов
          </Tooltip>
        </button>
        <button
          onClick={() => onChangeActiveTab("Лиды")}
          className={`${classes.viewDialogButton} ${
            activeTab === "Лиды" && classes.lead
          }`}
        >
          Лиды&nbsp;
          {viewDialogCounts?.["condition3"] ? (
            <span id={viewDialogCounts?.["condition3"] ? "id2" : ""}>
              ({viewDialogCounts?.["condition3"] || 0}🔔)
            </span>
          ) : (
            ""
          )}
          <Tooltip variant="info" anchorSelect="#id2">
            Количество непросмотренных диалогов
          </Tooltip>
        </button>
        <button
          onClick={() => onChangeActiveTab("Ручное управление")}
          className={`${classes.viewDialogButton} ${
            activeTab === "Ручное управление" && classes.managment
          }`}
        >
          Ручное управление&nbsp;
          {viewDialogCounts?.["condition4"] ? (
            <span id={viewDialogCounts?.["condition4"] ? "id3" : ""}>
              ({viewDialogCounts?.["condition4"] || 0}🔔)
            </span>
          ) : (
            ""
          )}
          <Tooltip variant="info" anchorSelect="#id3">
            Количество непросмотренных диалогов
          </Tooltip>
        </button>
      </div>
    </div>
  );
};
