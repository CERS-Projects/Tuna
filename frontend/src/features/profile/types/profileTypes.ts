import { type ReactNode } from "react";

export type ProfileData = {
  userId: number;
  showUserId: string;
  nickname: string;
  iconUrl?: string;
  followCount: number;
  isFollowed: boolean;
  followerCount: number;
  isFollowing: boolean;
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

export type EditProfileForm = {
  nickname: string;
  showUserId: string;
  introduction: string;
  iconFile?: File;
};
