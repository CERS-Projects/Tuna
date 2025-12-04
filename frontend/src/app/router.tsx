import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter, type RouteObject } from "react-router"; // type追加
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

const createAppRouter = (queryClient: QueryClient) => {
  const route = (path: string, importer: () => Promise<any>): RouteObject => ({
    path,
    lazy: () => importer().then(convert(queryClient)),
  });

  return createBrowserRouter([
    // ログイン不要ルート
    route(paths.welcome.path, () => import("./routes/welcome")),
    route(paths.help.category.path, () => import("./routes/helpCategory")),
    route(paths.help.contents.path, () => import("./routes/helpContents")),
    route(paths.inquiry.inquiry.path, () => import("./routes/inquiry")),
    route(
      paths.inquiry.complete.path,
      () => import("./routes/completeInquiry")
    ),
    route(paths.school.request.path, () => import("./routes/schoolRequest")),
    route(
      paths.school.confirm.path,
      () => import("./routes/confirmSchoolRequest")
    ),

    // 認証関連ルート
    route(paths.auth.login.path, () => import("./routes/auth/login")),
    route(
      paths.auth.passReset.passReset.path,
      () => import("./routes/auth/passwordReset")
    ),
    route(
      paths.auth.passChange.passChange.path,
      () => import("./routes/auth/passwordChange")
    ),
    route(
      paths.auth.twoFactorAuth.path,
      () => import("./routes/auth/twoFactorAuth")
    ),
    route(
      paths.auth.passReset.confirm.path,
      () => import("./routes/auth/emailSentConfirm")
    ),
    route(
      paths.auth.passChange.confirm.path,
      () => import("./routes/auth/completePasswordChange")
    ),
    route(
      paths.auth.accountLock.path,
      () => import("./routes/auth/accountLock")
    ),

    // アプリ内ルート (ログイン必要)
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [route(paths.app.test.path, () => import("./routes/app/test"))],
    },

    // 404
    route("*", () => import("./routes/not-found")),
  ]);
};

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};
