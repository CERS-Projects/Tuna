import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { type SchoolRequestType } from "../types/schoolRequest";

export const useSchoolRequest = () => {
  return useMutation({
    mutationFn: (requestData: SchoolRequestType) =>
      api<void>({
        url: "/school/create",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        },
      }),
  });
};
