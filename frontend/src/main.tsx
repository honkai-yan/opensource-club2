import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./route/index.tsx";

const isProduction = import.meta.env.MODE === "production";

createRoot(document.getElementById("root")!).render(
  isProduction ? (
    <RouterProvider router={router} />
  ) : (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
);
