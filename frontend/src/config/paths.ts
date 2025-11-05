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
  help:{
    category:{
      path:"help/category",
      gethref: () => "/help/category"
    }
  }
} as const;
