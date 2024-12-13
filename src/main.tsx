import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import './axiosConfig';

createRoot(document.getElementById("root")!).render(<App />);
