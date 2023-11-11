import { useState } from "react";
import { MagnifyingGlass, ColorRing } from "react-loader-spinner";

import classes from "./view-dialog__search.module.css";
import { ViewDialogSvg } from "../__svg/view-dialog__svg";
import { ViewDialogStatisticsSvg } from "../__statistics-svg/view-dialog__svg";
import { Dialogue } from "../../../../@types/Dialogue";

export interface ViewDialogSearchProps {
  loading: boolean;
  visibleStatistics: boolean;
  dialog?: Dialogue | null;
  dialogIds?: Array<string> | null;

  onSearch: (groupId: string) => void;
  onStatistics: () => void;
}

export const ViewDialogSearch = (props: ViewDialogSearchProps) => {
  const {
    loading,
    visibleStatistics,
    dialog,
    dialogIds,
    onStatistics,
    onSearch,
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
        <button
          type='button'
          disabled={!visibleStatistics}
          onClick={onStatistics}
          className={classes.viewDialogStatisticsButton}
        >
          {visibleStatistics ? (
            <ViewDialogStatisticsSvg
              className={classes.viewDialogSearchStatisticsSvg}
            />
          ) : (
            <ColorRing
              height={66}
              width={66}
              colors={["orange", "orange", "orange", "orange", "orange"]}
            />
          )}
        </button>
      )}

      <button
        type="submit"
        disabled={loading}
        onClick={handleSearch}
        className={classes.viewDialogButton}
        onDragEnter={handleSearch}
      >
        {loading ? (
          <MagnifyingGlass
            height={66}
            width={66}
            color="black"
            glassColor="white"
          />
        ) : (
          <ViewDialogSvg className={classes.viewDialogSearchSvg} />
        )}
      </button>
    </form>
  );
};
