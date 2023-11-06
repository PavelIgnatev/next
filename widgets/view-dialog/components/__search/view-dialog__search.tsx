import { useState } from "react";
import { MagnifyingGlass } from "react-loader-spinner";

import classes from "./view-dialog__search.module.css";
import { ViewDialogSvg } from "../__svg/view-dialog__svg";
import { ViewDialogStatisticsSvg } from "../__statistics-svg/view-dialog__svg";

export interface ViewDialogSearchProps {
  loading: boolean;
  visibleStatistics: boolean;

  onSearch: (groupId: string) => void;
  onStatistics: () => void;
}

export const ViewDialogSearch = (props: ViewDialogSearchProps) => {
  const { loading, visibleStatistics, onStatistics, onSearch } = props;

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
      {visibleStatistics && (
        <button
          onClick={onStatistics}
          className={classes.viewDialogStatisticsButton}
        >
          <ViewDialogStatisticsSvg
            className={classes.viewDialogSearchStatisticsSvg}
          />
        </button>
      )}
      <button
        type="submit"
        disabled={loading}
        onClick={handleSearch}
        className={classes.viewDialogButton}
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
