import { createRoot } from "react-dom/client";
import { init } from "@bworlds/launchkit";
import App from "./App.tsx";
import "./index.css";

export const launchkit = init({ buildSlug: "dex-pal-database-lovable-5df2" });

createRoot(document.getElementById("root")!).render(<App />);
