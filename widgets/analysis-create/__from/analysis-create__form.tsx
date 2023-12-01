
// import { Input } from "antd";
import classes from "./analysis-create__form.module.css";

export const AnalysisCreateForm = () => {
  return (
    <div className={classes.analysisCreateForm}>
      <input
        placeholder="Min. 8 characters"
        type="text"
        required
      />
    </div>
  );
};
