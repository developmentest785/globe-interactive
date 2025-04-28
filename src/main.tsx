import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import "./index.css";

import { routeTree } from "./routeTree.gen.ts";

const router = createRouter({ routeTree });

import { CountryPickerProvider } from "@/hooks/use-country-picker.tsx";

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    routeTree: typeof routeTree;
  }
}

createRoot(document.getElementById("root")!).render(
  <CountryPickerProvider>
    <RouterProvider router={router} />
  </CountryPickerProvider>
);
