export const paths = {
  // ログイン不要ルート
  welcome: {
    path: "/",
    getHref: () => "/",
  },
  help: {
    category: {
      path: "/help/category",
      getHref: () => "/help/category",
    },
    contents: {
      path: "/help/category/contents",
      getHref: () => "/help/category/contents",
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
    root: {
      path: "/app",
      getHref: () => "/app",
    },
    test: {
      path: "/app/test",
      getHref: () => "/app/test",
    },
  },
} as const;
