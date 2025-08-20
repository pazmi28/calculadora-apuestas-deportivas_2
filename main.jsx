import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App.jsx"; // Asegúrate de que la ruta apunte a la carpeta src
import "./style.css"; // Mantenemos el CSS por ahora

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
