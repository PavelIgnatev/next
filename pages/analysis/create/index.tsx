import type { NextPage } from "next";

import { AnalysisCreateContainer } from "../../../widgets/analysis-create/analysis-create.container";
import { AnalysisLastContainer } from "../../../widgets/analysis-last/analysis-last.containter";
import { Header } from "../../../components/header/header";

import classes from "./index.module.css";

const AnalysisCreatePage: NextPage = () => {
  return (
    <main className={classes.main}>
      <Header />
      <div className={classes.content}>
        <AnalysisCreateContainer />
        <AnalysisLastContainer />
      </div>
    </main>
  );
};

export default AnalysisCreatePage;
