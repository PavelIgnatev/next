import { NextPageContext } from "next";

const AnalysisPage = () => null;

AnalysisPage.getInitialProps = ({ res }: NextPageContext) => {
  if (res) {
    res.writeHead(302, { Location: "/" });
    res.end();
  }

  return {};
};

export default AnalysisPage;
