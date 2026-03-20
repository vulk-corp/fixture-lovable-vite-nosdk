import { createRoot } from "react-dom/client";
import { init } from "@bworlds/launchkit";
import App from "./App.tsx";
import "./index.css";

init({ buildSlug: "my-app" });

createRoot(document.getElementById("root")!).render(<App />);
