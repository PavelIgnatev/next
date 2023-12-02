import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { config as dotenvConfig } from "dotenv";

import "react-toastify/dist/ReactToastify.css";
import "../styles/normalize.css";

dotenvConfig();

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default MyApp;
