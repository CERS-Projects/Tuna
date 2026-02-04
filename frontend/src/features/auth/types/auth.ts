import { type Role } from "@/types/user";

export type LoginInfo = {
  showUserId: string;
  password: string;
};

export type LoginResponse = {
  otpToken: string;
};

export type OtpInfo = {
  otpToken: string;
  otp: string;
};

export type OtpTokenResponse = {
  token: string;
};

export type JWTPayload = {
  sub: string;
  role: Role;
  schoolId: number;
  iss: string;
  exp: number;
};
