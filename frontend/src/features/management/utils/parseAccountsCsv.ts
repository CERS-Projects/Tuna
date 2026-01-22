import { type StudentAccountImportType } from "../types/account";

type CsvParseResult = {
  accounts: StudentAccountImportType[];
  errors: string[];
};

export const parseAccountsCsv = (
  csv: string | ArrayBuffer | null | undefined,
): CsvParseResult => {
  if (typeof csv !== "string") return { accounts: [], errors: [] };

  const lines = csv.split(/\r?\n/);

  const errors: string[] = [];
  const accounts: StudentAccountImportType[] = [];

  lines.forEach((row, index) => {
    if (index === 0) return;

    if (!row.trim()) return;

    if (row.trim().startsWith("//")) return;

    const rowArray = row.split(",").map((v) => v.trim());
    if (rowArray.length < 7) {
      errors.push(`${index + 1}行目: 列数が不足しています（7列必要）`);
      return;
    }

    const admission = new Date(rowArray[5]);
    const graduate = new Date(rowArray[6]);

    if (admission > graduate) {
      errors.push(
        `${index + 1}行目: admissionDate が graduateDate より後です（${rowArray[5]} > ${rowArray[6]}）`,
      );
      return;
    }

    const email = rowArray[2].match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    if (email === null) {
      errors.push(
        `${index + 1}行目: 有効なメールアドレスを入力してください（例: school@example.com）`,
      );
    }

    const account: StudentAccountImportType = {
      showUserId: rowArray[0],
      name: rowArray[3],
      grade: Number(rowArray[4]),
      email: rowArray[2],
      password: rowArray[1],
      entryDate: rowArray[5],
      graduateDate: rowArray[6],
    };

    accounts.push(account);
  });

  return { accounts, errors };
};
