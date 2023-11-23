import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Tooltip } from "react-tooltip";

import classes from "./view-dialog__search.module.css";
import { ViewDialogSvg } from "../__svg/view-dialog__svg";
import { ViewDialogStatisticsSvg } from "../__statistics-svg/view-dialog__svg";
import { Dialogue } from "../../../../@types/Dialogue";
import { ViewDialogIncognitoSvg } from "../__incognito-svg/view-dialog__incognito-svg";

export interface ViewDialogSearchProps {
  loading: boolean;
  visibleStatistics: boolean;
  visibleStatisticsInfo: boolean;
  incognito: boolean;
  dialog?: Dialogue | null;
  dialogIds?: Array<string> | null;

  onSearch: (groupId: string) => void;
  onStatistics: () => void;
  onChangeIncognito: () => void;
}

export const ViewDialogSearch = (props: ViewDialogSearchProps) => {
  const {
    loading,
    incognito,
    visibleStatistics,
    visibleStatisticsInfo,
    dialog,
    dialogIds,
    onStatistics,
    onSearch,
    onChangeIncognito,
  } = props;
  const [currentGroupId, setCurrentGroupId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!isNaN(Number(input))) {
      setCurrentGroupId(input);
    }
  };

  const handleSearch = () => {
    if (currentGroupId) {
      onSearch(currentGroupId);
    }
  };

  return (
    <form
      className={classes.viewDialogSearch}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        value={currentGroupId}
        disabled={loading}
        onChange={handleInputChange}
        className={classes.viewDialogInput}
        type="text"
        id="search"
        placeholder="Ваш идентификатор"
      />
      {dialog && dialogIds && dialogIds.length > 0 && (
        <>
          <button
            type="button"
            onClick={onChangeIncognito}
            className={`${classes.viewDialogIncognitoButton} ${
              incognito && classes.viewDialogIncognitoButtonInc
            }`}
            id="incognito"
          >
            <ViewDialogIncognitoSvg
              className={classes.viewDialogIncognitoSvg}
            />
          </button>
          <Tooltip variant="info" anchorSelect="#incognito">
            Режим просмотра диалогов в режиме "инкогнито" <br /> Состояние:{" "}
            {incognito ? "включено" : "выключено"}
          </Tooltip>
        </>
      )}
      {dialog && dialogIds && dialogIds.length > 0 && (
        <>
          <button
            type="button"
            disabled={!visibleStatistics || loading}
            onClick={onStatistics}
            className={`${classes.viewDialogStatisticsButton} ${
              visibleStatisticsInfo && classes.viewDialogStatisticsButtonVisible
            }`}
            id="statistics"
          >
            {visibleStatistics ? (
              <ViewDialogStatisticsSvg
                className={classes.viewDialogSearchStatisticsSvg}
              />
            ) : (
              <TailSpin height={30} width={30} radius={0.5} color="black" />
            )}
          </button>
          <Tooltip variant="info" anchorSelect="#statistics">
            Просмотреть статистику эффективности
          </Tooltip>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        onClick={handleSearch}
        className={classes.viewDialogButton}
        onDragEnter={handleSearch}
        id="searchS"
      >
        {loading ? (
          <TailSpin height={30} width={30} radius={0.5} color="black" />
        ) : (
          <ViewDialogSvg className={classes.viewDialogSearchSvg} />
        )}
      </button>
      <Tooltip variant="info" anchorSelect="#searchS">
        Поиск турниров по идентификатору
      </Tooltip>
    </form>
  );
};
