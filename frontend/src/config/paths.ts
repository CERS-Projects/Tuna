export const paths = {
  welcome: {
    path: "/",
    getHref: () => "/",
  },
<<<<<<< HEAD
  school: {
    request: {
      path: "/school/request",
      getHref: () => "/school/request",
    },
  },
  auth: {
    login: {
      path: "/login",
      getHref: () => "/login",
    },
    twoFactorAuth: {
      path: "/login/two-factor-auth",
      getHref: () => "/login/two-factor-auth",
    },
  },
=======
  accountLock: {
    path: "/account-lock",
    getHref: () => "/account-lock",
  },

>>>>>>> e2f8efa (feat : アカウント停止画面への遷移追加)
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
  help: {
    category: {
      path: "help/category",
<<<<<<< HEAD
      getHref: () => "/help/category",
    },
    contents: {
      path: "help/category/contents",
      getHref: () => "/help/category/contents",
    },
  },
  inquiry: {
    path: "/inquiry",
    getHref: () => "/inquiry",
  },
=======
      gethref: () => "/help/category",
    },
  },
>>>>>>> e2f8efa (feat : アカウント停止画面への遷移追加)
} as const;
