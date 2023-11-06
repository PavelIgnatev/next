import classes from "./view-dialog__statistics.module.css";

export interface ViewDialogStatisticsProps {
  averageDialogDuration: number;
  averageDialogDurationIfResponse: number;
}

export const ViewDialogStatistics = (props: ViewDialogStatisticsProps) => {
  const { averageDialogDuration, averageDialogDurationIfResponse } = props;

  return (
    <div className={classes.viewDialogStatistics}>
      <div className={classes.viewDialogScreenMain}>
        <div>
          Средняя продолжительность диалога (глобально):&nbsp;
          {averageDialogDuration.toFixed(2)}
        </div>
        <div>
          Средняя продолжительность диалога (в случае ответа):&nbsp;
          {averageDialogDurationIfResponse.toFixed(2)}
        </div>
      </div>
    </div>
  );
};
