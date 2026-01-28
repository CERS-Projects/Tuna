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
      onFilesChange([...value.files, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      onFilesChange([...value.files, ...Array.from(e.dataTransfer.files)]);
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
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
