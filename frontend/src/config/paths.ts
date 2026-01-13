import { get } from "react-hook-form";

export const paths = {
  // ログイン不要ルート
  welcome: {
    path: "/",
    getHref: () => "/",
  },
  help: {
    category: {
      path: "/help",
      getHref: () => "/help",
    },
    contents: {
      path: "/help/:id",
      getHref: (id: number | string) => `/help/${id}`,
    },
  },
  inquiry: {
    inquiry: {
      path: "/inquiry",
      getHref: () => "/inquiry",
    },
    complete: {
      path: "/inquiry/complete",
      getHref: () => "/inquiry/complete",
    },
  },
  school: {
    request: {
      path: "/school/request",
      getHref: () => "/school/request",
    },
    confirm: {
      path: "/school/request/confirm",
      getHref: () => "/school/request/confirm",
    },
  },

  // 認証関連ルート
  auth: {
    login: {
      path: "/login",
      getHref: () => "/login",
    },
    passReset: {
      passReset: {
        path: "/password/reset",
        getHref: () => "/password/reset",
      },
      confirm: {
        path: "/password/reset/confirm",
        getHref: () => "/password/reset/confirm",
      },
    },
    passChange: {
      passChange: {
        path: "/password/change",
        getHref: () => "/password/change",
      },
      confirm: {
        path: "/password/change/confirm",
        getHref: () => "/password/change/confirm",
      },
    },
    twoFactorAuth: {
      path: "/login/two-factor-auth",
      getHref: () => "/login/two-factor-auth",
    },
    accountLock: {
      path: "/account-lock",
      getHref: () => "/account-lock",
    },
  },

  // アプリ内ルート (ログイン必要)
  app: {
    // 共通ルート
    root: {
      path: "/app",
      getHref: () => "/app",
    },
    timeline: {
      path: "/app/timeline",
      getHref: () => "/app/timeline",
    },
    searchPost: {
      path: "/app/search",
      getHref: () => "/app/search",
    },
    searchClassroom: {
      path: "/app/searchClassroom",
      getHref: () => "/app/searchClassroom",
      contents: {
        path: "/searchClassroom/:id",
        getHref: (id: number | string) => `/app/searchClassroom/${id}`,
      },
    },
    test: {
      path: "/app/test",
      getHref: () => "/app/test",
    },

    // 教師ルート
    management: {
      root: {
        path: "/manager",
        getHref: () => "/manager",
      },
      group: {
        root: {
          path: "/manager/teacher/group",
          getHref: () => "/manager/teacher/group",
        },
        new: {
          path: "/manager/teacher/group/new",
          getHref: () => "/manager/teacher/group/new",
        },
        edit: {
          path: "/manager/teacher/group/edit",
          getHref: () => "/manager/teacher/group/edit",
        },
      },
      post: {
        path: "/manager/teacher/post",
        getHref: () => "/manager/teacher/post",
      },
      classroom: {
        path: "/manager/teacher/room",
        getHref: () => "/manager/teacher/room",
      },
      notification: {
        path: "/manager/teacher/notification",
        getHref: () => "/manager/teacher/notification",
      },
      account: {
        path: "/manager/teacher/account",
        getHref: () => "/manager/teacher/account",
      },
      report: {
        path: "/manager/teacher/report",
        getHref: () => "/manager/teacher/report",
      },
      schoolInfo: {
        path: "/manager/teacher/school-info",
        getHref: () => "/manager/teacher/school-info",
      },
    },
  },
} as const;
