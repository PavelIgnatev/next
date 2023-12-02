import { dehydrate } from "react-query/hydration";
import { QueryClient, useQuery } from "react-query";
import { useRouter } from "next/router";

import { AnalysisLast } from "./analysis-last";
import FrontendAnalysisApi from "../../api/frontend/analysis";

export const AnalysisLastContainer = () => {
  const router = useRouter();

  const { data: analysisData, isLoading: analysisLoading } = useQuery(
    "analysis",
    () => FrontendAnalysisApi.getAnalysis(),
    {
      staleTime: Infinity,
    }
  );

  const handleAnalysisClick = (id: string) => {
    router.push(`/analysis/${id}`);
  };

  return (
    <AnalysisLast
      analysisData={analysisData}
      analysisLoading={analysisLoading}
      onAnalysisClick={handleAnalysisClick}
    />
  );
};

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery("analysis", () =>
    FrontendAnalysisApi.getAnalysis()
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
