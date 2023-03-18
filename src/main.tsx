import React from "react";
import ReactDOM from "react-dom/client";
import Container from "./container";
import "./main.css";

window.onload = () => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Container />
    </React.StrictMode>
  );
};
