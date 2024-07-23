import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Add MantineProvider to use @mantine/core */}
    <MantineProvider>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
