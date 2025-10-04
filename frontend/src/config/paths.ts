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
} as const;
