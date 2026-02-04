import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { type OtpInfo, type OtpTokenResponse } from "../types/auth";

export const useOtp = () => {
  return useMutation({
    mutationFn: (info: OtpInfo) =>
      api<OtpTokenResponse>({
        url: "/otp",
        options: {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(info),
        },
      }),
  });
};
