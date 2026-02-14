import React, { useRef } from "react";
import {
	type UseFormRegister,
	type FieldError,
	type FieldValues,
	type Path,
} from "react-hook-form";
import {
	type ClassroomCategoryEdit,
	type ClassroomCategoryDocument,
} from "@/features/management/types/classroom";
import { FaRegTrashAlt } from "react-icons/fa";
import styles from "./classroomCategoryUploader.module.css";

type CreateModeValue = {
	categoryName: string;
	files: File[];
};
type EditModeValue =
	ClassroomCategoryEdit;

type Props<T extends FieldValues> = {
	index: number;
	value: CreateModeValue | EditModeValue;
	error?: FieldError;
	register: UseFormRegister<T>;
	onFilesChange?: (
		files: File[],
	) => void;
	onUpdate?: (
		value: EditModeValue,
	) => void;
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

export const ClassroomCategoryUploader =
	<T extends FieldValues>({
		index,
		value,
		error,
		register,
		onFilesChange,
		onUpdate,
		onRemove,
	}: Props<T>) => {
		const inputRef =
			useRef<HTMLInputElement | null>(
				null,
			);

		const isEditMode =
			"categoryId" in value;

		const currentNewFiles = isEditMode
			? (value as EditModeValue).newFiles
			: (value as CreateModeValue).files;

		const existingDocs = isEditMode
			? (value as EditModeValue)
					.existingDocuments
			: [];

		const handleFileChange = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			if (e.target.files) {
				const files = Array.from(
					e.target.files,
				);
				const invalidFile = files.find(
					(file) =>
						file.size > MAX_FILE_SIZE ||
						!ALLOWED_EXTENSIONS.some((ext) =>
							file.name
								.toLowerCase()
								.endsWith(ext),
						),
				);

				if (invalidFile) {
					alert(
						"ファイルサイズが20MB以下、かつ指定された拡張子のみアップロードしてください",
					);
					return;
				}

				const duplicate = files.find(
					(file) =>
						currentNewFiles.some(
							(f) => f.name === file.name,
						) ||
						existingDocs.some(
							(doc) =>
								doc.documentName === file.name,
						),
				);
				if (duplicate) {
					alert(
						"同じファイル名のファイルが既に追加されています",
					);
					return;
				}

				if (isEditMode && onUpdate) {
					onUpdate({
						...(value as EditModeValue),
						newFiles: [
							...currentNewFiles,
							...files,
						],
					});
				} else if (onFilesChange) {
					onFilesChange([
						...currentNewFiles,
						...files,
					]);
				}
				e.target.value = "";
			} else {
				alert(
					"ファイルサイズが20MB以下のファイルをアップロードしてください",
				);
			}
		};

		const handleDrop = (
			e: React.DragEvent<HTMLDivElement>,
		) => {
			e.preventDefault();
			if (e.dataTransfer.files) {
				const files = Array.from(
					e.dataTransfer.files,
				);
				const invalidFile = files.find(
					(file) =>
						file.size > MAX_FILE_SIZE ||
						!ALLOWED_EXTENSIONS.some((ext) =>
							file.name
								.toLowerCase()
								.endsWith(ext),
						),
				);

				if (invalidFile) {
					alert(
						"ファイルサイズが20MB以下、かつ指定された拡張子のみアップロードしてください",
					);
					return;
				}

				const duplicate = files.find(
					(file) =>
						currentNewFiles.some(
							(f) => f.name === file.name,
						) ||
						existingDocs.some(
							(doc) =>
								doc.documentName === file.name,
						),
				);
				if (duplicate) {
					alert(
						"同じファイル名のファイルが既に追加されています",
					);
					return;
				}

				if (isEditMode && onUpdate) {
					onUpdate({
						...(value as EditModeValue),
						newFiles: [
							...currentNewFiles,
							...files,
						],
					});
				} else if (onFilesChange) {
					onFilesChange([
						...currentNewFiles,
						...files,
					]);
				}
			} else {
				alert(
					"ファイルサイズが20MB以下のファイルをアップロードしてください",
				);
			}
		};

		const handleDragOver = (
			e: React.DragEvent<HTMLDivElement>,
		) => {
			e.preventDefault();
		};

		const handleRemoveExisting = (
			doc: ClassroomCategoryDocument,
		) => {
			if (isEditMode && onUpdate) {
				const v = value as EditModeValue;
				onUpdate({
					...v,
					existingDocuments:
						v.existingDocuments.filter(
							(d) =>
								d.documentName !==
								doc.documentName,
						),
					deleteDocuments: [
						...v.deleteDocuments,
						doc,
					],
				});
			}
		};

		const handleRemoveNew = (
			fileIdx: number,
		) => {
			const newFiltered =
				currentNewFiles.filter(
					(_, i) => i !== fileIdx,
				);

			if (isEditMode && onUpdate) {
				onUpdate({
					...(value as EditModeValue),
					newFiles: newFiltered,
				});
			} else if (onFilesChange) {
				onFilesChange(newFiltered);
			}
		};

		return (
			<div className={styles.categoryBox}>
				<div className={styles.header}>
					<div
						className={styles.headerContent}>
						<input
							className={
								error
									? `${styles.categoryInput} ${styles.inputError}`
									: styles.categoryInput
							}
							type="text"
							placeholder="カテゴリ名"
							{...register(
								`categories.${index}.categoryName` as Path<T>,
								{
									required: "必須項目です",
								},
							)}
						/>
						{error && (
							<span className={styles.isError}>
								{error.message}
							</span>
						)}
					</div>
					<button
						type="button"
						className={styles.trashButton}
						onClick={onRemove}>
						<FaRegTrashAlt />
					</button>
				</div>
				<div
					className={styles.dropzone}
					onClick={() =>
						inputRef.current?.click()
					}
					onDrop={handleDrop}
					onDragOver={handleDragOver}>
					<div
						className={styles.fileListArea}>
						{currentNewFiles.length === 0 &&
							existingDocs.length === 0 && (
								<div
									className={
										styles.dropzoneHint
									}>
									ファイルをドラッグ＆ドロップ、またはクリックして選択
								</div>
							)}

						{existingDocs.map((doc, i) => (
							<div
								className={styles.fileIconBox}
								key={`exist-${i}`}>
								<div
									className={styles.fileIcon}
								/>
								<span
									className={styles.fileName}>
									{doc.documentName}{" "}
								</span>
								<button
									type="button"
									className={styles.fileTrash}
									onClick={(e) => {
										e.stopPropagation();
										handleRemoveExisting(doc);
									}}>
									<FaRegTrashAlt />
								</button>
							</div>
						))}

						{currentNewFiles.map(
							(file, i) => (
								<div
									className={styles.fileIconBox}
									key={`new-${i}`}>
									<div
										className={styles.fileIcon}
									/>
									<span
										className={styles.fileName}>
										{file.name}{" "}
										{isEditMode && "(新規)"}
									</span>
									<button
										type="button"
										className={styles.fileTrash}
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveNew(i);
										}}>
										<FaRegTrashAlt />
									</button>
								</div>
							),
						)}

						<div
							className={styles.addFileBox}
							onClick={(e) => {
								e.stopPropagation();
								inputRef.current?.click();
							}}>
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
