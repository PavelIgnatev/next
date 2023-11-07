import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useMemo } from "react";
import useResizeObserver from "use-resize-observer";

import { Dialogue } from "../../../../@types/dialogue";
import classes from "./view-dialog__statistics.module.css";

export interface ViewDialogStatisticsProps {
  averageDialogDuration: number;
  averageDialogDurationIfResponse: number;
  statisticsByDay: { [key: string]: Dialogue[] };
}

export const ViewDialogStatistics = (props: ViewDialogStatisticsProps) => {
  const {
    averageDialogDuration,
    averageDialogDurationIfResponse,
    statisticsByDay,
  } = props;
  const { ref, width = 1 } = useResizeObserver();

  const getChartData = useMemo(() => {
    const data = [];

    for (const [date, dialogues] of Object.entries(statisticsByDay)) {
      data.push({
        name: new Date(Number(date)).toLocaleDateString(),
        "Количество сообщений": dialogues.length,
        "Количество диалогов": dialogues.filter(
          (dialogue) =>
            dialogue.messages?.length && dialogue.messages.length > 1
        ).length,
      });
    }

    return data;
  }, [statisticsByDay]);

  return (
    <div className={classes.viewDialogStatistics} ref={ref}>
      <div className={classes.viewDialogScreenMain}>
        <div>
          Средняя продолжительность диалога (глобально):&nbsp;
          {averageDialogDuration.toFixed(2)}
        </div>
        <div>
          Средняя продолжительность диалога (в случае ответа):&nbsp;
          {averageDialogDurationIfResponse.toFixed(2)}
        </div>
        <BarChart
          width={width}
          height={300}
          style={{ marginTop: "35px", marginLeft: "-20px" }}
          data={getChartData}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Количество сообщений" fill="#7873e6" />
          <Bar dataKey="Количество диалогов" fill="#d3792c" />
        </BarChart>
      </div>
    </div>
  );
};
