import {
	useForm,
	useFieldArray,
} from "react-hook-form";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { type ClassroomCreateInput } from "@/features/management/types/classroom";
import { ClassroomCategoryUploader } from "@/features/management/components/classroomCategoryUploader/classroomCategoryUploader";
import commonStyles from "@/features/management/style/classroom.module.css";
import styles from "@/features/management/style/classroomNew.module.css";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { useCreateClassroom } from "@/features/management/hooks/useClassroomEdit";

const ClassroomNew = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		control,
		formState,
		getValues,
	} = useForm<ClassroomCreateInput>({
		defaultValues: {
			roomName: "",
			description: "",
			categories: [
				{ categoryName: "", files: [] },
			],
		},
	});

	const createClassroomMutation =
		useCreateClassroom({
			onSuccess: () => {
				alert("授業ルームを作成しました");
				navigate(
					paths.app.management.classroom.list
						.path,
				);
			},
			onError: (error) => {
				alert(
					`授業ルームの作成に失敗しました: ${error.message}`,
				);
			},
		});
	const {
		fields,
		append,
		remove,
		update,
	} = useFieldArray({
		control,
		name: "categories",
	});

	const onSubmit = (
		formData: ClassroomCreateInput,
	) => {
		if (
			confirm(
				"この内容で授業ルームを作成しますか？",
			)
		) {
			// API処理
			createClassroomMutation.mutate(
				formData,
			);
		}
	};

	return (
		<div
			className={
				commonStyles.contentsContainer
			}>
			<h2
				className={
					commonStyles.sectionName
				}>
				授業ルーム作成
			</h2>
			<main
				className={commonStyles.contents}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className={styles.form}>
					<Input
						label="授業ルーム名"
						{...register("roomName", {
							required: "必須項目です",
						})}
						error={
							formState.errors.roomName
								?.message
						}
						placeholder="例：2023年度前期 数学A"
					/>
					<Input
						label="授業ルーム概要"
						{...register("description")}
						placeholder="授業の概要を入力してください"
					/>

					<div
						className={styles.categoryArea}>
						<div
							className={styles.sectionName}>
							カテゴリ・資料登録
						</div>
						{fields.map((field, idx) => (
							<ClassroomCategoryUploader
								key={field.id}
								index={idx}
								value={field}
								error={
									formState.errors.categories?.[
										idx
									]?.categoryName
								}
								register={register}
								onFilesChange={(files) => {
									const currentCategory =
										getValues(
											`categories.${idx}.categoryName`,
										);

									update(idx, {
										categoryName: currentCategory,
										files: files,
									});
								}}
								onRemove={() => remove(idx)}
							/>
						))}
						<button
							type="button"
							className={
								styles.addCategoryButton
							}
							onClick={() =>
								append({
									categoryName: "",
									files: [],
								})
							}>
							＋ 新しいカテゴリを追加
						</button>
					</div>
					<Button type="submit">作成</Button>
				</form>
			</main>
		</div>
	);
};

export default ClassroomNew;
