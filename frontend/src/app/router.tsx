import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { paths } from "@/config/paths";

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from "./routes/app/root";

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.welcome.path,
      lazy: () => import("./routes/welcome").then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.test.path,
          lazy: () => import("./routes/app/test").then(convert(queryClient)),
        },
      ],
    },
    {
      path: paths.help.category.path,
      lazy: () => import("./routes/helpCategory").then(convert(queryClient)),
    },
    {
      path: paths.inquiry.path,
      lazy: () => import("./routes/inquiry").then(convert(queryClient)),
    },
    {
      path: "*",
      lazy: () => import("./routes/not-found").then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
