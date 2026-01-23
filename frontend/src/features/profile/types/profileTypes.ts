import { type ReactNode } from "react";

export type ProfileData = {
  showUserId: string;
  userName: string;
  iconUrl?: string;
  follow: number;
  follower: number;
  introduction?: string;
};

export type FollowData = {
  userId: number;
  userName: string;
  showUserId: string;
  isFollowed: boolean;
  isFollowing: boolean;
  iconUrl: string;
};

export type MenuItemType = {
  menuName: string;
  menuPath: string;
  menuIcon: ReactNode;
  menuLabel: string;
};
