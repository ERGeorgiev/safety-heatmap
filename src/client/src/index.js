import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// const queryClient = new QueryClient();

// cont. https://www.youtube.com/watch?v=lNd7XlXwlho 01:30:00
ReactDOM.render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
      <App />
    {/* </QueryClientProvider> */}
  </React.StrictMode>,
  document.getElementById("root")
);
