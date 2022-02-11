import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AppContextWrapper } from "./Contexts/AppContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppContextWrapper>
        <App />
      </AppContextWrapper>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
