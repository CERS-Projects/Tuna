import { type HelpCategoryType } from "../types/helpCategory";
import { api } from "@/lib/api-client";

export const getHelpCategory = async (): Promise<HelpCategoryType[]> => {
  const result = await api<HelpCategoryType[]>({
    url: "/support/help/category",
    options: { method: "GET" },
  });

  return result;
};
