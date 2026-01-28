import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input/input";
import { type ClassroomCreateInput } from "@/features/management/types/classroom";
import { ClassroomCategoryUploader } from "@/features/management/components/classroomCategoryUploader/classroomCategoryUploader";
import commonStyles from "@/features/management/style/classroom.module.css";
import styles from "@/features/management/style/classroomNew.module.css";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

const ClassroomNew = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState, getValues } =
    useForm<ClassroomCreateInput>({
      defaultValues: {
        roomName: "",
        description: "",
        categories: [{ category: "", files: [] }],
      },
    });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "categories",
  });

  const onSubmit = (data: ClassroomCreateInput) => {
    if (confirm("この内容で授業ルームを作成しますか？")) {
      // API処理
      console.log(data);
      navigate(paths.app.management.classroom.list.path);
    }
  };

  return (
    <div className={commonStyles.contentsContainer}>
      <h2 className={commonStyles.sectionName}>授業ルーム作成</h2>
      <main className={commonStyles.contents}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            label="授業ルーム名"
            {...register("roomName", { required: "必須項目です" })}
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
                value={field}
                error={formState.errors.categories?.[idx]?.category}
                register={register}
                onFilesChange={(files) => {
                  const currentCategory = getValues(
                    `categories.${idx}.category`,
                  );

                  update(idx, {
                    category: currentCategory,
                    files: files,
                  });
                }}
                onRemove={() => remove(idx)}
              />
            ))}
            <button
              type="button"
              className={styles.addCategoryButton}
              onClick={() => append({ category: "", files: [] })}
            >
              ＋ 新しいカテゴリを追加
            </button>
          </div>
          <button type="submit" className={styles.submitButton}>
            作成
          </button>
        </form>
      </main>
    </div>
  );
};

export default ClassroomNew;
