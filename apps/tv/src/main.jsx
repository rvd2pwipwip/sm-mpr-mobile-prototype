import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/roboto/wght.css";
import "./index.css";
import App from "./App.jsx";

// StrictMode disabled — TV focus sync may double-mount in Phase 1+ (see docs/tv/Plans/plan.md).
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
