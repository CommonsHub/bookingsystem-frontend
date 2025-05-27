
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/i18n.ts";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Wrap the app in Suspense to handle i18next loading
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<div className="p-4"><Skeleton className="h-[100vh] w-full" /></div>}>
    <App />
  </Suspense>
);
