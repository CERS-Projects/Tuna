import React, { useRef } from "react";
import { type UseFormRegister, type FieldError } from "react-hook-form";
import { type ClassroomCreateInput } from "@/features/management/types/classroom";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./classroomCategoryUploader.module.css";

type Props = {
  index: number;
  value: { category: string; files: File[] };
  error?: FieldError;
  register: UseFormRegister<ClassroomCreateInput>;
  onFilesChange: (files: File[]) => void;
  onRemove: () => void;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
];

export const ClassroomCategoryUploader = ({
  index,
  value,
  error,
  register,
  onFilesChange,
  onRemove,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const invalidFile = files.find(
        (file) =>
          file.size > MAX_FILE_SIZE ||
          !ALLOWED_EXTENSIONS.some((ext) =>
            file.name.toLowerCase().endsWith(ext),
          ),
      );

      if (invalidFile) {
        alert(
          "ファイルサイズが20MB以下、かつ指定された拡張子のみアップロードしてください",
        );
        return;
      }

      const duplicate = files.find((file) =>
        value.files.some((f) => f.name === file.name),
      );
      if (duplicate) {
        alert("同じファイル名のファイルが既に追加されています");
        return;
      }

      onFilesChange([...value.files, ...files]);
    } else {
      alert("ファイルサイズが20MB以下のファイルをアップロードしてください");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const invalidFile = files.find(
        (file) =>
          file.size > MAX_FILE_SIZE ||
          !ALLOWED_EXTENSIONS.some((ext) =>
            file.name.toLowerCase().endsWith(ext),
          ),
      );

      if (invalidFile) {
        alert(
          "ファイルサイズが20MB以下、かつ指定された拡張子のみアップロードしてください",
        );
        return;
      }

      const duplicate = files.find((file) =>
        value.files.some((f) => f.name === file.name),
      );
      if (duplicate) {
        alert("同じファイル名のファイルが既に追加されています");
        return;
      }

      onFilesChange([...value.files, ...files]);
    } else {
      alert("ファイルサイズが20MB以下のファイルをアップロードしてください");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = (idx: number) => {
    const newFiles = value.files.filter((_, i) => i !== idx);
    onFilesChange(newFiles);
  };

  return (
    <div className={styles.categoryBox}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <input
            className={
              error
                ? `${styles.categoryInput} ${styles.inputError}`
                : styles.categoryInput
            }
            type="text"
            placeholder="カテゴリ名"
            {...register(`categories.${index}.category` as const, {
              required: "必須項目です",
            })}
          />
          {error && <span className={styles.isError}>{error.message}</span>}
        </div>
        <button type="button" className={styles.trashButton} onClick={onRemove}>
          <FaRegTrashAlt />
        </button>
      </div>
      <div
        className={styles.dropzone}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className={styles.fileListArea}>
          {value.files.length === 0 && (
            <div className={styles.dropzoneHint}>
              ファイルをドラッグ＆ドロップ、またはクリックして選択
            </div>
          )}
          {value.files.map((file, i) => (
            <div className={styles.fileIconBox} key={i}>
              <div className={styles.fileIcon} />
              <span className={styles.fileName}>{file.name}</span>
              <button
                type="button"
                className={styles.fileTrash}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(i);
                }}
                aria-label="ファイルを削除"
              >
                <FaRegTrashAlt />
              </button>
            </div>
          ))}
          <div
            className={styles.addFileBox}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            ＋
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
