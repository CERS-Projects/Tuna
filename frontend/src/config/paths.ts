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
  },
  auth: {
    login: {
      path: "/login",
      getHref: () => "/login",
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
    path: "/inquiry",
    getHref: () => "/inquiry",
  },
} as const;
