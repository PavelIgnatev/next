import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { List, Skeleton, Typography } from "antd";

import classes from "./analysis-last.module.css";

interface AnalysisLastProps {
  analysisData?:
    | {
        companyDescription: string;
        companyName: string;
        companyId: string;
      }[]
    | null;
  analysisLoading: boolean;

  onAnalysisClick: (id: string) => void;
}

export const AnalysisLast = (props: AnalysisLastProps) => {
  const { analysisData, analysisLoading, onAnalysisClick } = props;
  const data = analysisData || [];

  return (
    <div
      id="scrollableDiv"
      style={{
        maxHeight: "600px",
        height: "100%",
        overflow: "auto",
        padding: "0 16px",
        marginRight: "10px",
        maxWidth: "400px",
        width: "100%",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <Typography.Title
        level={4}
        style={{ margin: "1em 0", textAlign: "center" }}
      >
        Ранее добавленные разборы
      </Typography.Title>
      <InfiniteScroll
        dataLength={data.length}
        next={() => {}}
        hasMore={analysisLoading}
        loader={
          <>
            <Skeleton paragraph={{ rows: 1 }} active />
            <Skeleton paragraph={{ rows: 1 }} active />
            <Skeleton paragraph={{ rows: 1 }} active />
            <Skeleton paragraph={{ rows: 1 }} active />
          </>
        }
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={String(item.companyId)}
              onClick={() => onAnalysisClick(item.companyId)}
            >
              <List.Item.Meta
                title={item.companyName}
                description={item.companyDescription}
                className={classes.meta}
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};
