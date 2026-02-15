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
      getHref: (groupId?: number) =>
        groupId != null ? `/app/timeline?groupId=${groupId}` : "/app/timeline",
      post: {
        path: "/app/timeline/post",
        getHref: () => "/app/timeline/post",
      },
      detail: {
        path: "/app/timeline/:id",
        getHref: (id: string, groupId?: number) =>
          groupId != null
            ? `/app/timeline/${id}?groupId=${groupId}`
            : `/app/timeline/${id}`,
      },
    },
    searchPost: {
      path: "/app/search",
      getHref: () => "/app/search",
    },
    classroom: {
      path: "/app/classroom",
      getHref: () => "/app/classroom",
      contents: {
        path: "/app/classroom/:id",
        getHref: (id: string) => `/app/classroom/${id}`,
      },
    },
    profile: {
      root: {
        path: "/app/profile/:userId",
        getHref: (userId: string) =>
          userId ? `/app/profile/${userId}` : "/app/profile",
      },
      posts: {
        path: "/app/profile/:userId/posts",
        getHref: (userId: string) => `/app/profile/${userId}/posts`,
      },
      responses: {
        path: "/app/profile/:userId/responses",
        getHref: (userId: string) => `/app/profile/${userId}/responses`,
      },
      goods: {
        path: "/app/profile/:userId/goods",
        getHref: (userId: string) => `/app/profile/${userId}/goods`,
      },
      bookmarks: {
        path: "/app/profile/:userId/bookmarks",
        getHref: (userId: string) => `/app/profile/${userId}/bookmarks`,
      },
      follow: {
        path: "/app/profile/:userId/follow",
        getHref: (userId: string) => `/app/profile/${userId}/follow`,
      },
      follower: {
        path: "/app/profile/:userId/follower",
        getHref: (userId: string) => `/app/profile/${userId}/follower`,
      },
      setting: {
        path: "/app/profile/setting",
        getHref: () => "/app/profile/setting",
        editPassword: {
          path: "/app/profile/setting/editPassword",
          getHref: () => "/app/profile/setting/editPassword",
        },
        editFilter: {
          path: "/app/profile/setting/editFilter",
          getHref: () => "/app/profile/setting/editFilter",
        },
      },
      edit: {
        path: "/app/profile/edit/:userId",
        getHref: (userId: string) => `/app/profile/edit/${userId}`,
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
        root: {
          path: "/manager/classroom",
          getHref: () => "/manager/classroom",
        },
        list: {
          path: "/manager/classroom/list",
          getHref: () => "/manager/classroom/list",
        },
        edit: {
          path: "/manager/classroom/edit/:roomId",
          getHref: (roomId: number | string) =>
            `/manager/classroom/edit/${roomId}`,
        },
        new: {
          path: "/manager/classroom/new",
          getHref: () => "/manager/classroom/new",
        },
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
          path: "/manager/account/edit/:userId",
          getHref: (userId: number | string) =>
            `/manager/account/edit/${userId}`,
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
