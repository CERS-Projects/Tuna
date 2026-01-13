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
          path: "/manager/group",
          getHref: () => "/manager/group",
        },
        new: {
          path: "/manager/group/new",
          getHref: () => "/manager/group/new",
        },
        edit: {
          path: "/manager/group/edit",
          getHref: () => "/manager/group/edit",
        },
      },
      post: {
        path: "/manager/post",
        getHref: () => "/manager/post",
      },
      classroom: {
        path: "/manager/room",
        getHref: () => "/manager/room",
      },
      notification: {
        path: "/manager/notification",
        getHref: () => "/manager/notification",
      },
      account: {
        root: {
          path: "/manager/account",
          getHref: () => "/manager/account",
        },
        list: {
          path: "/manager/account/list",
          getHref: () => "/manager/account/list",
        },
        edit: {
          path: "/manager/account/edit/:showUserId",
          getHref: (showUserId: string) =>
            `/manager/account/edit/${showUserId}`,
        },
        new: {
          path: "/manager/account/new",
          getHref: () => "/manager/account/new",
        },
        register: {
          path: "/manager/account/register",
          getHref: () => "/manager/account/register",
        },
        import: {
          path: "/manager/account/import",
          getHref: () => "/manager/account/import",
        },
      },
      report: {
        path: "/manager/report",
        getHref: () => "/manager/report",
      },
      schoolInfo: {
        path: "/manager/school-info",
        getHref: () => "/manager/school-info",
      },
    },
  },
} as const;
