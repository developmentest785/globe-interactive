import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";

import { routeTree } from "./routeTree.gen.ts";

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
});

import { CountryPickerProvider } from "@/hooks/use-country-picker.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    routeTree: typeof routeTree;
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <CountryPickerProvider>
      <RouterProvider router={router} />
      <Toaster />
    </CountryPickerProvider>
  </QueryClientProvider>,
);
