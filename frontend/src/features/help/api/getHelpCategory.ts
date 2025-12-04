import { type HelpCategoryType } from "../types/helpCategory";

export const getHelpCategory = async (): Promise<HelpCategoryType[]> => {
  const response = await fetch(`http://localhost:8080/api/support/help/category`, {
    method: "GET",
  });

  const result: HelpCategoryType[] = await response.json();

  return result;
};
