import { type HelpContentsType } from "../types/helpContents";
import { api } from "@/lib/api-client";

export const getHelpContents = async (
  categoryId: number
): Promise<HelpContentsType[]> => {
  const result = await api<HelpContentsType[]>({
    url: `/support/help/category/${categoryId}`,
    options: { method: "GET" },
  });

  return result;
};
