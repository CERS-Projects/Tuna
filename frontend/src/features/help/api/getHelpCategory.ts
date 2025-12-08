import { type HelpCategoryType } from "../types/helpCategory";

export const getHelpCategory = async (): Promise<HelpCategoryType[]> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/support/help/category`,
    {
      method: "GET",
    }
  );

  const result: HelpCategoryType[] = await response.json();

  return result;
};
