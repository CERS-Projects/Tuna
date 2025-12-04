import { type HelpContentsType } from "../types/helpContents";

export const getHelpContents = async (categoryId: number) => {
  const response = await fetch(
    `http://localhost:8080/api/support/help/category/${categoryId}`,
    { method: "GET" }
  );

  const result: HelpContentsType[] = await response.json();

  return result;
};
