import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	useSchool,
	useUpdateSchool,
} from "@/features/management/hooks/useSchool";
import { type SchoolEditFormInput } from "@/features/management/types/school";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { BackPage } from "@/features/management/components/backPage/backPage";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/schoolEdit.module.css";

const SchoolEdit = () => {
	const { data: school, isFetching, isError } = useSchool();
	const updateSchool = useUpdateSchool();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<SchoolEditFormInput>({
		defaultValues: {
			schoolName: "",
			schoolAddress: "",
			schoolMailAddress: "",
		},
	});

	useEffect(() => {
		if (school) {
			reset({
				schoolName: school.schoolName,
				schoolAddress: school.schoolAddress,
				schoolMailAddress: school.schoolMailAddress,
			});
		}
	}, [school, reset]);

	const onSubmit = (data: SchoolEditFormInput) => {
		if (!isDirty) {
			alert("変更内容がありません。");
			return;
		}

		if (confirm("この内容で学校情報を更新しますか？")) {
			updateSchool.mutate(data, {
				onSuccess: () => {
					alert("学校情報を更新しました。");
				},
				onError: () => {
					alert("学校情報の更新に失敗しました。");
				},
			});
		}
	};

	return (
		<div className={styles.contentsContainer}>
			<h2 className={styles.sectionName}>学校情報編集</h2>

			<main className={styles.contents}>
				{isError ? (
					<div className={styles.errorMessage}>
						学校情報の読み込みに失敗しました。
					</div>
				) : isFetching ? (
					<div>読み込み中...</div>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
						<Input
							label="学校名"
							{...register("schoolName", {
								required: "学校名は必須です",
								maxLength: {
									value: 256,
									message: "学校名は256文字以内で入力してください",
								},
								validate: (value) =>
									value.trim() !== "" || "学校名は空白のみで入力できません",
								pattern: {
									value: /^[^\s]+(\s[^\s]+)*$/,
									message:
										"学校名は空白で始まったり、連続する空白を含むことはできません",
								},
							})}
							error={errors.schoolName?.message}
							placeholder="例：〇〇学校"
						/>

						<Input
							label="学校住所"
							{...register("schoolAddress", {
								required: "学校住所は必須です",
								maxLength: {
									value: 161,
									message: "学校住所は161文字以内で入力してください",
								},
								validate: (value) =>
									value.trim() !== "" || "学校住所は空白のみで入力できません",
							})}
							error={errors.schoolAddress?.message}
							placeholder="例：東京都千代田区丸の内1-1-1"
						/>

						<Input
							label="メールアドレス"
							type="email"
							{...register("schoolMailAddress", {
								required: "メールアドレスは必須です",
								maxLength: {
									value: 254,
									message: "メールアドレスは254文字以内で入力してください",
								},
								pattern: {
									value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
									message:
										"有効なメールアドレスを入力してください（例: school@example.com）",
								},
								validate: (value) =>
									value.trim() !== "" || "メールアドレスは空白のみで入力できません",
							})}
							error={errors.schoolMailAddress?.message}
							placeholder="例：info@example-school.ac.jp"
						/>

						<div className={styles.actions}>
							<Button type="submit">更新</Button>
						</div>
					</form>
				)}
			</main>
		</div>
	);
};

export default SchoolEdit;
