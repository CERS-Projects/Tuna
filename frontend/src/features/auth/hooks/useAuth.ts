import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("AuthProviderの中で宣言してください。");
  }
  return context;
};
