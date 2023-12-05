import type { NextPage } from "next";

import { AnalysisIdContainer } from "../../../widgets/analysis-id/analysis-id.container";
import { Header } from "../../../components/header/header";

import classes from "./index.module.css";

const AnalysisIdPage: NextPage = () => {
  return (
    <main className={classes.main}>
      <Header />
      <AnalysisIdContainer />
    </main>
  );
};

export default AnalysisIdPage;
