import { useState, useEffect, useCallback } from "react";
import { useBeforeUnload, useNavigate } from "react-router";
import { useBlockNavigation } from "@/hooks/useBlockNavigation";
import { BackPage } from "@/features/management/components/backPage/backPage";
import { CsvUploadField } from "@/features/management/components/csvUploadField/csvUploadField";
import { AccountImportTable } from "@/features/management/components/accountImportTable/accountImportTable";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountImport.module.css";
import type { StudentAccountImportType } from "@/features/management/types/account";

const isAccount = (
  v: StudentAccountImportType | null,
): v is StudentAccountImportType => v !== null;

const mapCsvToArray = (
  csv: string | ArrayBuffer | null | undefined,
): StudentAccountImportType[] => {
  if (typeof csv === "string")
    return csv
      .split(/\r?\n/)
      .map((row, index) => {
        if (index === 0) return null;

        if (!row.trim()) return null;
        const rowArray = row.split(",").map((v) => v.trim());

        if (rowArray.length < 7) return null;

        const account: StudentAccountImportType = {
          showUserId: rowArray[0],
          name: rowArray[3],
          grade: Number(rowArray[4]),
          email: rowArray[2],
          password: rowArray[1],
          entryDate: rowArray[5],
          graduateDate: rowArray[6],
        };

        return account;
      })
      .filter(isAccount);
  else return [];
};

const AccountImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [accounts, setAccounts] = useState<StudentAccountImportType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvString = event.target?.result;
        setAccounts(mapCsvToArray(csvString));
      };
      reader.onerror = () => {
        console.error("failed to read file");
      };
      reader.readAsText(file);
    }
  }, [file]);

  useBlockNavigation(accounts.length > 0 && !isSubmitting);

  useBeforeUnload(
    useCallback(
      (e) => {
        if (!isSubmitting && accounts.length > 0) {
          e.preventDefault();
        }
      },
      [accounts, isSubmitting],
    ),
  );

  useEffect(() => {
    if (!shouldNavigate) return;
    navigate(paths.app.management.account.list.path);
  }, [shouldNavigate, navigate]);

  const handleSubmit = async () => {
    const ok = confirm("この内容で登録しますか？");
    if (!ok) return;

    if (accounts.length === 0) {
      alert("データが追加されていません");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(accounts);
      setShouldNavigate(true);
    } catch (e) {
      setIsSubmitting(false);
      throw e;
    }
  };

  return (
    <div className={styles.contentsContainer}>
      <BackPage
        to={paths.app.management.account.new.path}
        label="アカウント登録メニューに戻る"
      />

      <h3 className={styles.sectionName}>外部ファイルアカウント登録</h3>

      <hr />

      <div className={styles.contents}>
        <CsvUploadField
          file={file}
          setFile={setFile}
          setAccounts={setAccounts}
        />

        <AccountImportTable accounts={accounts} />
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        作成完了
      </button>
    </div>
  );
};

export default AccountImport;
