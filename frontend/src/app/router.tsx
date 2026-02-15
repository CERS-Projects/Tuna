import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  type RouteObject,
} from "react-router";

import { paths } from "@/config/paths";

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from "./routes/app/root";

import {
  default as ManagementRoot,
  ErrorBoundary as ManagementErrorBoundary,
} from "./routes/app/management/root";
import ProtectedRoute from "@/features/auth/components/protectedRoute";
import TeacherProtectedRoute from "@/features/auth/components/teacherProtectedRoute";
import { AuthWrapper } from "@/features/auth/context/authWrapper";

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
      () => import("./routes/completeInquiry"),
    ),
    route(paths.school.request.path, () => import("./routes/schoolRequest")),
    route(
      paths.school.confirm.path,
      () => import("./routes/confirmSchoolRequest"),
    ),

    // 認証関連ルート
    route(
      paths.auth.passReset.passReset.path,
      () => import("./routes/auth/passwordReset"),
    ),
    route(
      paths.auth.passChange.passChange.path,
      () => import("./routes/auth/passwordChange"),
    ),
    route(
      paths.auth.passReset.confirm.path,
      () => import("./routes/auth/emailSentConfirm"),
    ),
    route(
      paths.auth.passChange.confirm.path,
      () => import("./routes/auth/completePasswordChange"),
    ),

    {
      element: <AuthWrapper />,
      children: [
        route(paths.auth.login.path, () => import("./routes/auth/login")),
        route(
          paths.auth.twoFactorAuth.path,
          () => import("./routes/auth/twoFactorAuth"),
        ),
        route(
          paths.auth.accountLock.path,
          () => import("./routes/auth/accountLock"),
        ),

        // アプリ内ルート (ログイン必要)
        {
          path: paths.app.root.path,
          element: <ProtectedRoute />,
          children: [
            {
              element: <AppRoot />,
              ErrorBoundary: AppRootErrorBoundary,
              children: [
                {
                  index: true,
                  element: <Navigate to={paths.app.timeline.path} replace />,
                },
                route(paths.app.test.path, () => import("./routes/app/test")),
                {
                  path: paths.app.timeline.path,
                  lazy: () =>
                    import("./routes/app/timeline").then(convert(queryClient)),
                  children: [
                    route(
                      paths.app.timeline.post.path,
                      () => import("./routes/app/post"),
                    ),
                  ],
                },
                route(
                  paths.app.timeline.detail.path,
                  () => import("./routes/app/detailPost"),
                ),
                route(
                  paths.app.searchPost.path,
                  () => import("./routes/app/searchPost"),
                ),
                route(
                  paths.app.classroom.path,
                  () => import("./routes/app/searchClassroom"),
                ),
                route(
                  paths.app.profile.follow.path,
                  () => import("./routes/app/profile/follow"),
                ),
                route(
                  paths.app.profile.follower.path,
                  () => import("./routes/app/profile/follower"),
                ),
                route(
                  paths.app.classroom.contents.path,
                  () => import("./routes/app/classroom/material"),
                ),
                {
                  path: paths.app.profile.root.path,
                  lazy: () =>
                    import("../features/profile/layout/profileLayout").then(
                      convert(queryClient),
                    ),
                  children: [
                    route(
                      paths.app.profile.posts.path,
                      () => import("./routes/app/profile/posts"),
                    ),
                    route(
                      paths.app.profile.responses.path,
                      () => import("./routes/app/profile/responses"),
                    ),
                    route(
                      paths.app.profile.goods.path,
                      () => import("./routes/app/profile/goods"),
                    ),
                    route(
                      paths.app.profile.bookmarks.path,
                      () => import("./routes/app/profile/bookmarks"),
                    ),
                  ],
                },
                route(
                  paths.app.profile.edit.path,
                  () => import("./routes/app/profile/edit/editProfile"),
                ),
                route(
                  paths.app.profile.setting.path,
                  () => import("./routes/app/profile/setting/settingMenu"),
                ),
                route(
                  paths.app.profile.setting.editPassword.path,
                  () => import("./routes/app/profile/edit/editPassword"),
                ),
                route(
                  paths.app.profile.setting.editFilter.path,
                  () => import("./routes/app/profile/edit/editFilter"),
                ),
              ],
            },
          ],
        },

        // アプリ内教師ルート (ログイン必要)
        {
          path: paths.app.management.root.path,
          element: <TeacherProtectedRoute />,
          children: [
            {
              element: <ManagementRoot />,
              ErrorBoundary: ManagementErrorBoundary,
              children: [
                {
                  index: true,
                  element: (
                    <Navigate
                      to={paths.app.management.group.root.path}
                      replace
                    />
                  ),
                },
                {
                  path: paths.app.management.group.root.path,
                  lazy: () =>
                    import("../features/management/layouts/groupShell/groupShell").then(
                      convert(queryClient),
                    ),
                  children: [
                    route(
                      paths.app.management.group.root.path,
                      () => import("./routes/app/management/group/groupList"),
                    ),
                    route(
                      paths.app.management.group.new.path,
                      () => import("./routes/app/management/group/groupNew"),
                    ),
                    route(
                      paths.app.management.group.edit.path,
                      () => import("./routes/app/management/group/groupEdit"),
                    ),
                  ],
                },
                {
                  path: paths.app.management.account.root.path,
                  lazy: () =>
                    import("../features/management/layouts/accountShell/accountShell").then(
                      convert(queryClient),
                    ),
                  children: [
                    {
                      index: true,
                      element: (
                        <Navigate
                          to={paths.app.management.account.list.path}
                          replace
                        />
                      ),
                    },
                    route(
                      paths.app.management.account.list.path,
                      () =>
                        import("./routes/app/management/account/accountList"),
                    ),
                    route(
                      paths.app.management.account.edit.path,
                      () =>
                        import("./routes/app/management/account/accountEdit"),
                    ),
                    route(
                      paths.app.management.account.new.path,
                      () =>
                        import("./routes/app/management/account/accountNew"),
                    ),
                    route(
                      paths.app.management.account.register.path,
                      () =>
                        import("./routes/app/management/account/accountRegister"),
                    ),
                    route(
                      paths.app.management.account.import.path,
                      () =>
                        import("./routes/app/management/account/accountImport"),
                    ),
                  ],
                },
                {
                  path: paths.app.management.classroom.root.path,
                  children: [
                    {
                      index: true,
                      element: (
                        <Navigate
                          to={paths.app.management.classroom.list.path}
                          replace
                        />
                      ),
                    },
                    route(
                      paths.app.management.classroom.list.path,
                      () =>
                        import("./routes/app/management/classroom/classroomList"),
                    ),
                    route(
                      paths.app.management.classroom.edit.path,
                      () =>
                        import("./routes/app/management/classroom/classroomEdit"),
                    ),
                    route(
                      paths.app.management.classroom.new.path,
                      () =>
                        import("./routes/app/management/classroom/classroomNew"),
                    ),
                  ],
                },
                route(
                  paths.app.management.schoolInfo.path,
                  () => import("./routes/app/management/school/schoolEdit"),
                ),
              ],
            },
          ],
        },
      ],
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
