import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/app.css";
import ManifestProvider from "./Contexts/ManifestContext/index.jsx";
import PreferencesProvider from "./Contexts/PreferencesContext/index.jsx";
import { TTSProvider } from "./components/TTSPlayer.jsx";
import { BrowserRouter as Router } from "react-router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <PreferencesProvider>
      <ManifestProvider>
        <TTSProvider>
          <App />
        </TTSProvider>
      </ManifestProvider>
    </PreferencesProvider>
  </Router>,
);
