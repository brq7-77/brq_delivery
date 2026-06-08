import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { LanguageProvider } from "./i18n/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />

      <Toaster
        position="top-right"
        gutter={14}
        toastOptions={{
          duration: 3500,

          style: {
            background: "rgba(10,10,18,0.96)",
            color: "#fff",
            border: "1px solid rgba(112,0,255,0.35)",
            borderRadius: "22px",
            padding: "18px 20px",
            boxShadow: "0 20px 70px rgba(0,0,0,0.45)",
            backdropFilter: "none",
            minWidth: "320px",
            fontWeight: "700",
          },

          prime: {
            iconTheme: {
              primary: "#8b5cf6",
              secondary: "#fff",
            },

            style: {
              border: "1px solid rgba(139,92,246,0.35)",
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.16), rgba(10,10,18,0.96))",

              boxShadow:
                "0 18px 60px rgba(139,92,246,0.22)",
            },
          },

          success: {
            iconTheme: {
              primary: "#7b2cff",
              secondary: "#fff",
            },

            style: {
              border: "1px solid rgba(0,210,106,0.28)",
              background:
                "linear-gradient(135deg, rgba(0,210,106,0.12), rgba(10,10,18,0.96))",
            },
          },

          error: {
            iconTheme: {
              primary: "#ff375f",
              secondary: "#fff",
            },

            style: {
              border: "1px solid rgba(255,55,95,0.28)",
              background:
                "linear-gradient(135deg, rgba(255,55,95,0.12), rgba(10,10,18,0.96))",
            },
          },
        }}
      />
    </LanguageProvider>
  </React.StrictMode>
);