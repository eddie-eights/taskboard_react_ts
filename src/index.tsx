import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { Route, BrowserRouter } from "react-router-dom";
import Auth from "./features/auth/Auth";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route path="/" Component={Auth} />
        <Route path="/tasks" Component={App} />
      </div>
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
