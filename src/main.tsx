import { init } from 'https://esm.sh/@bworlds/launchkit@1';
init({ buildSlug: 'dex-pal-database-07b8' });
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
