import { createRoot } from "react-dom/client";
import "./style.css"
import App from "./App"

const node = document.getElementById("root");
const root = createRoot(node);

root.render(<App />);