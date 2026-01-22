import { useState } from "react";
import { BackPage } from "@/features/management/components/backPage/backPage";
import { CsvUploadField } from "@/features/management/components/csvUploadField/csvUploadField";
import { AccountImportTable } from "@/features/management/components/accountImportTable/accountImportTable";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountImport.module.css";

const AccountImport = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className={styles.contentsContainer}>
      <BackPage
        to={paths.app.management.account.new.path}
        label="アカウント登録メニューに戻る"
      />

      <h3 className={styles.sectionName}>外部ファイルアカウント登録</h3>

      <hr />

      <div className={styles.contents}>
        <CsvUploadField file={file} setFile={setFile} />

        <AccountImportTable />
      </div>
    </div>
  );
};

export default AccountImport;
