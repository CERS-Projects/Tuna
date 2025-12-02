export const paths = {
  welcome: {
    path: "/",
    getHref: () => "/",
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
  },
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
      getHref: () => "/help/category",
    },
    contents: {
      path: "help/category/contents",
      getHref: () => "/help/category/contents",
    },
  },
  inquiry: {
    inquiry: {
      path: "/inquiry",
      getHref: () => "/inquiry",
    },
    complete: {
      paths: "/inquiry/complete",
      getHref: () => "/inquiry/complete",
    },
  },
} as const;
