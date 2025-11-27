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
  passwordreset: {
    confirm: {
      path: "password-reset/confirm",
      getHref: () => "/password-reset/confirm",
    },
  },
  newPassword: {
    complete: {
      paths: "new-password/complete",
      getHref: () => "/new-password/complete",
    },
  },
} as const;
