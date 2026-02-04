import { createContext } from "react";
import { type LoginInfo, type OtpInfo } from "../types/auth";

export type AuthContextType = {
  authToken: string;
  setAuthToken: (authToken: string) => void;
  login: (info: LoginInfo) => void;
  isLoggingIn: boolean;
  otpTempToken: string;
  otpLogin: (info: OtpInfo) => void;
  isOtpLoggingIn: boolean;
  logout: () => void;
  isLoggingOut: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
