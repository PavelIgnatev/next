import { Header } from "../../components/header/header";
import { AnalysisCreateForm } from "./__from/analysis-create__form";

import classes from "./analysis-create.module.css";

export const AnalysisCreate = () => {
  return (
    <div className={classes.analysisCreate}>
      <Header />
      <AnalysisCreateForm />
    </div>
  );
};
