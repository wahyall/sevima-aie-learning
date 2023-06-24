import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ThemeProvider } from "@material-tailwind/react";

const appName =
  window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

window.asset = function (path) {
  return (
    import.meta.env.VITE_URL + "/" + path?.split("/").filter(Boolean).join("/")
  );
};

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      retry: false,
      staleTime: 1000 * 60 * 60 * 1,
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
});

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.jsx`,
      import.meta.glob("./pages/**/*.jsx")
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App {...props} />
          </ThemeProvider>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.StrictMode>
    );
  },
  progress: {
    color: "#2563eb",
  },
});
