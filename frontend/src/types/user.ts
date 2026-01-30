export type Role = "STUDENT" | "TEACHER" | "ADMIN_SCHOOL";

export type User = {
  showUserId: string;
  userName: string;
  iconUrl?: string;
  follow: number;
  follower: number;
  introduction?: string;
  role: Role;
};
