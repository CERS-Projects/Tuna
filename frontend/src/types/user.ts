export type Role = "STUDENT" | "TEACHER" | "ADMIN_SCHOOL";

export type User = {
  userId: number;
  showUserId: string;
  userName: string;
  iconUrl?: string;
  followCount: number;
  followerCount: number;
  introduction?: string;
  role: Role;
};
