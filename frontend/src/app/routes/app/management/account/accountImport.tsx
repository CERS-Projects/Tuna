import { useState, useEffect, useCallback } from "react";
import { useBeforeUnload, useNavigate } from "react-router";
import { useBlockNavigation } from "@/hooks/useBlockNavigation";
import { BackPage } from "@/features/management/components/backPage/backPage";
import { CsvUploadField } from "@/features/management/components/csvUploadField/csvUploadField";
import { AccountImportTable } from "@/features/management/components/accountImportTable/accountImportTable";
import { type StudentAccountImportType } from "@/features/management/types/account";
import { parseAccountsCsv } from "@/features/management/utils/parseAccountsCsv";
import { useCreateStudentsByCsv } from "@/features/management/hooks/useAccountMutations";
import { ApiRequestError } from "@/types/apiRequestError";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountImport.module.css";
import { FaInfoCircle } from "react-icons/fa";

const AccountImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [accounts, setAccounts] = useState<StudentAccountImportType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const createStudentsByCsv = useCreateStudentsByCsv({
    onSuccess: () => {
      setShouldNavigate(true);
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiRequestError && error.body?.errorMessage
          ? error.body.errorMessage
          : "登録処理中にエラーが発生しました";
      alert("登録に失敗しました: " + message);
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (file && file.type === "text/csv") {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5,242,880 bytes

      if (file.size > MAX_FILE_SIZE) {
        alert("ファイルサイズが大きすぎます（上限5MB）");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const csvString = event.target?.result;
        const { accounts: nextAccounts, errors } = parseAccountsCsv(csvString);

        setAccounts(nextAccounts);

        if (errors.length > 0) {
          alert(
            `CSVに不正な行があります:\n\n${errors.slice(0, 20).join("\n")}`,
          );
          setFile(null);
          setAccounts([]);
        }
      };
      reader.onerror = () => {
        alert(
          "ファイルの読み込みに失敗しました。別のファイルを選択するか、再度お試しください。",
        );
      };
      reader.readAsText(file, "utf-8");
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

  const handleSubmit = () => {
    const ok = confirm("この内容で登録しますか？");
    if (!ok) return;

    if (accounts.length === 0) {
      alert("データが追加されていません");
      return;
    }

    if (!file) {
      alert("ファイルが選択されていません");
      return;
    }

    setIsSubmitting(true);
    createStudentsByCsv.mutate(file);
  };

  return (
    <div className={styles.contentsContainer}>
      <BackPage
        to={paths.app.management.account.new.path}
        label="アカウント登録メニューに戻る"
      />

      <h3 className={styles.sectionName}>外部ファイルアカウント登録</h3>

      <div className={styles.infoNote}>
        <FaInfoCircle />
        <span>外部ファイルでの登録は生徒アカウントのみ対応しています</span>
      </div>

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
        disabled={isSubmitting || createStudentsByCsv.isPending}>
        {createStudentsByCsv.isPending ? "登録中..." : "作成完了"}
      </button>
    </div>
  );
};

export default AccountImport;
