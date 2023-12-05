import type { NextPage } from "next";
import { useEffect, useState } from "react";

import { AnalysisCreateContainer } from "../../../widgets/analysis-create/analysis-create.container";
import { AnalysisLastContainer } from "../../../widgets/analysis-last/analysis-last.containter";
import { Header } from "../../../components/header/header";

import classes from "./index.module.css";

const AnalysisCreatePage: NextPage = () => {
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const storedPassword = localStorage.getItem("password");

    if (storedPassword !== "Y41N3tk2tqmNhG@") {
      const enteredPassword = prompt(
        "Please enter the password to access the page:"
      );

      if (enteredPassword === "Y41N3tk2tqmNhG@") {
        localStorage.setItem("password", enteredPassword);
        setPassword(enteredPassword);
      } else {
        alert("Incorrect password. Access denied.");
      }
    } else {
      setPassword(storedPassword);
    }
  }, []);

  if (!password) {
    return null;
  }

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
