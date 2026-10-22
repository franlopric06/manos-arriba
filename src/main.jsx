import { createRoot } from "react-dom/client";
import "@fontsource/lilita-one";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/800.css";
import "./index.css";
import App from "./App";

// Sin StrictMode: en desarrollo repite los efectos y los sonidos se escucharían dos veces
createRoot(document.getElementById("root")).render(<App />);
