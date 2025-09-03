import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { loadProfile, updateToken } from "@/store/authSlice";
import { BrowserRouter } from "react-router-dom";

const token = localStorage.getItem("accessToken");

if (token) {
  store.dispatch(updateToken({ accessToken: token }));
  store.dispatch(loadProfile());
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
