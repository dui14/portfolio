import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { LanguageProvider } from "../context/LanguageContext.tsx";
import { ThemeProvider } from "../context/ThemeContext.tsx";

import { App } from "./App.tsx";

import "../styles/globals.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
