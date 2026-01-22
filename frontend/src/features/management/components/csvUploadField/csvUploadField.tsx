import { useRef } from "react";
import { FaFileUpload, FaFileCsv, FaRegTrashAlt } from "react-icons/fa";
import styles from "./csvUploadField.module.css";
import { type StudentAccountImportType } from "../../types/account";

type Props = {
  file: File | null;
  setFile: (file: File | null) => void;
  setAccounts: (accounts: StudentAccountImportType[]) => void;
};

export const CsvUploadField = ({ file, setFile, setAccounts }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selected = e.currentTarget.files?.[0] ?? null;
    setFile(selected);
  };

  const clear = () => {
    setFile(null);
    setAccounts([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isUploaded = file !== null;

  return (
    <div className={styles.uploadContainer}>
      <div
        className={styles.dropzone}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {isUploaded ? (
          <div className={styles.dropzoneDetails}>
            <FaFileCsv className={styles.dropzoneIcon} />
            <div className={styles.fileDetails}>
              <span className={styles.dropzoneTitle}>{file.name}</span>
              <span
                className={styles.dropzoneHint}
              >{`${file.size / 1000} KB`}</span>
            </div>
            <button
              className={styles.trashFile}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                clear();
              }}
            >
              <FaRegTrashAlt />
            </button>
          </div>
        ) : (
          <div className={styles.dropzoneDetails}>
            <FaFileUpload className={styles.dropzoneIcon} />
            <div className={styles.dropzoneText}>
              <span className={styles.dropzoneTitle}>
                CSVファイルをドロップ
              </span>
              <small className={styles.dropzoneHint}>
                またはクリックしてファイルを選択
              </small>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onChange}
        />
      </div>

      <div className={styles.templateField}>
        <label htmlFor="template">フォーマット</label>
        <a
          id="template"
          href="/templates/account_import_template.csv"
          download={"一括登録テンプレート.csv"}
        >
          csvテンプレートをダウンロード
        </a>
      </div>
    </div>
  );
};
