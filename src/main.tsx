import { createRoot } from "react-dom/client";
import { init } from "@bworlds/launchkit";
import App from "./App.tsx";
import "./index.css";

init({ buildSlug: "v0-pokedex-with-database-4a78" });

createRoot(document.getElementById("root")!).render(<App />);
