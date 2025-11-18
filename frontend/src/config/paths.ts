export const paths = {
  welcome: {
    path: "/",
    getHref: () => "/",
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
  auth: {
    login: {
      path: "/login",
      getHref: () => "/login",
    },
  },
} as const;
