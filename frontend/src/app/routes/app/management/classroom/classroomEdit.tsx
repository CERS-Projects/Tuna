import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { ClassroomCategoryUploader } from "@/features/management/components/classroomCategoryUploader/classroomCategoryUploader";
import {
	type ClassroomEditInput,
	type ClassroomEditPost,
} from "@/features/management/types/classroom";
import { paths } from "@/config/paths";
import commonStyles from "@/features/management/style/classroom.module.css";
import styles from "@/features/management/style/classroomEdit.module.css";
import { useUpdateClassroom } from "@/features/management/hooks/useClassroomEdit";
import { useClassroom } from "@/features/management/hooks/useClassroom";

const ClassroomEdit = () => {
	const navigate = useNavigate();
	const { roomId } = useParams();
	const parsedRoomId = roomId || "";

	const [deletedCategoryIds, setDeletedCategoryIds] = useState<string[]>([]);

	const { data: classroom, isFetching, isError } = useClassroom(parsedRoomId);

	const {
		register,
		handleSubmit,
		control,
		formState,
		reset,
		getValues,
		setValue,
	} = useForm<ClassroomEditInput>({
		defaultValues: {
			roomId: "",
			roomName: "",
			description: "",
			categories: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "categories",
	});

	// watchで最新の値を取得（File オブジェクトも保持される）
	const watchedCategories = useWatch({
		control,
		name: "categories",
	});

	const { mutate: updateClassroom } = useUpdateClassroom();

	useEffect(() => {
		if (!roomId) {
			navigate(paths.app.management.classroom.list.path, { replace: true });
		}
	}, [roomId, navigate]);

	useEffect(() => {
		if (classroom) {
			setDeletedCategoryIds([]);
			reset({
				roomId: parsedRoomId,
				roomName: classroom.roomName,
				description: classroom.description,
				categories: classroom.categories.map((c) => ({
					categoryId: c.categoryId,
					categoryName: c.categoryName,
					existingDocuments: c.documents,
					deleteDocuments: [],
					newFiles: [],
				})),
			});
		}
	}, [classroom, parsedRoomId, reset]);

	const handleRemoveCategory = (idx: number) => {
		const category = getValues(`categories.${idx}`);
		if (category.categoryId) {
			setDeletedCategoryIds((prev) => [...prev, category.categoryId]);
		}
		remove(idx);
	};

	const onSubmit = (data: ClassroomEditInput) => {
		if (
			!formState.isDirty &&
			deletedCategoryIds.length === 0 &&
			data.categories.every((c, i) => {
				const defaultCategory = classroom?.categories[i];
				return (
					c.categoryName === defaultCategory?.categoryName &&
					c.existingDocuments.length === defaultCategory?.documents.length &&
					c.existingDocuments.every((doc, j) =>
						defaultCategory?.documents.some(
							(d) =>
								d.documentId === doc.documentId && d.documentName === doc.documentName,
						),
					) &&
					c.newFiles.length === 0
				);
			})
		) {
			alert("変更内容がありません。");
			return;
		}

		const formData: ClassroomEditPost = {
			...data,
			updateCategories: data.categories
				.filter((c) => c.categoryId !== "")
				.map(({ categoryId, categoryName, deleteDocuments, newFiles }) => ({
					categoryId,
					categoryName,
					deleteDocuments,
					newFiles,
					existingDocuments: [],
				})),
			newCategories: data.categories
				.filter((c) => c.categoryId === "")
				.map(({ categoryName, newFiles }) => ({
					categoryName,
					files: newFiles,
				})),
			deletedCategoryIds,
		};

		if (confirm("この内容で授業ルームを更新しますか？")) {
			updateClassroom(formData, {
				onSuccess: () => {
					alert("授業ルームを更新しました。");
					navigate(paths.app.management.classroom.list.path);
				},
			});
		}
	};

	if (isFetching) {
		return <div className={commonStyles.contentsContainer}>読み込み中...</div>;
	}

	if (isError || !classroom) {
		return (
			<div className={commonStyles.contentsContainer}>
				授業ルームの情報を取得できませんでした。
			</div>
		);
	}

	return (
		<div className={commonStyles.contentsContainer}>
			<h2 className={commonStyles.sectionName}>授業ルーム編集</h2>
			<main className={commonStyles.contents}>
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<Input
						label="授業ルーム名"
						{...register("roomName", {
							required: "必須項目です",
						})}
						error={formState.errors.roomName?.message}
						placeholder="例：2023年度前期 数学A"
					/>
					<Input
						label="授業ルーム概要"
						{...register("description")}
						placeholder="授業の概要を入力してください"
					/>

					<div className={styles.categoryArea}>
						<div className={styles.sectionName}>カテゴリ・資料登録</div>
						{fields.map((field, idx) => (
							<ClassroomCategoryUploader
								key={field.id}
								index={idx}
								value={watchedCategories?.[idx] ?? field}
								error={formState.errors.categories?.[idx]?.categoryName}
								register={register}
								onUpdate={(newValue) => {
									const currentCategory = getValues(`categories.${idx}.categoryName`);
									setValue(
										`categories.${idx}`,
										{
											...newValue,
											categoryName: currentCategory,
										},
										{ shouldDirty: true },
									);
								}}
								onRemove={() => handleRemoveCategory(idx)}
							/>
						))}
						<button
							type="button"
							className={styles.addCategoryButton}
							onClick={() =>
								append({
									categoryId: "",
									categoryName: "",
									existingDocuments: [],
									deleteDocuments: [],
									newFiles: [],
								})
							}>
							＋ 新しいカテゴリを追加
						</button>
					</div>
					<Button type="submit">更新</Button>
				</form>
			</main>
		</div>
	);
};
export default ClassroomEdit;
