import { BarChart, Bar, XAxis, YAxis, Tooltip, Line } from "recharts";
import { useMemo } from "react";
import useResizeObserver from "use-resize-observer";

import { Dialogue } from "../../../../@types/dialogue";
import classes from "./view-dialog__statistics.module.css";

export interface ViewDialogStatisticsProps {
  averageDialogDuration: number;
  averageDialogDurationIfResponse: number;
  messagesToDialog: number;
  statisticsByDay: { [key: string]: Dialogue[] };
}

export const ViewDialogStatistics = (props: ViewDialogStatisticsProps) => {
  const {
    averageDialogDuration,
    averageDialogDurationIfResponse,
    messagesToDialog,
    statisticsByDay,
  } = props;
  const { ref, width = 1 } = useResizeObserver();

  const getChartData = useMemo(() => {
    const data = [];

    for (const [date, dialogues] of Object.entries(statisticsByDay)) {
      const messagesLength = dialogues.length;
      const dialoguesLength = dialogues.filter(
        (dialogue) => dialogue.messages?.length && dialogue.messages.length > 1
      ).length;

      data.push({
        name: new Date(Number(date)).toLocaleDateString(),
        "Количество сообщений": messagesLength,
        "Количество диалогов": dialoguesLength,
        "Процент диалогов в сообщениях (по дню)": Number(
          (dialoguesLength / messagesLength) * 100
        ).toFixed(2),
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
        <div>
          Процент диалогов в сообщениях (глобально):&nbsp;
          {messagesToDialog.toFixed(2)}
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
          <Bar
            dataKey="Процент диалогов в сообщениях (по дню)"
            fill="#ed2929"
          />
        </BarChart>
      </div>
    </div>
  );
};
