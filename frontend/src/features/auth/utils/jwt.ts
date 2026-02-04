import { jwtDecode } from "jwt-decode";
import { type JWTPayload } from "../types/auth";

export const decodeUserParams = (authToken: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(authToken);
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};
