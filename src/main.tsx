
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

const rootEl = document.getElementById("root") as HTMLElement | null;
if (rootEl) {
  createRoot(rootEl).render(<App />);
} else {
  console.error("Root element not found");
}
  