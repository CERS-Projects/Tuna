import { type HelpContentsType } from "../types/helpContents";

export const getHelpContents = async (
  categoryId: number
): Promise<HelpContentsType[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/support/help/category/${categoryId}`,
    { method: "GET" }
  );

  const result: HelpContentsType[] = await response.json();

  return result;
};
