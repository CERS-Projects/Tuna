import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { useClassroom } from "@/features/management/hooks/useClassroom";
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

const ClassroomEdit = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const parsedRoomId = Number(roomId) || 0;

  useEffect(() => {
    if (!roomId || !Number.isFinite(parsedRoomId) || parsedRoomId <= 0) {
      navigate(paths.app.management.classroom.list.path, { replace: true });
    }
  }, [roomId, navigate, parsedRoomId]);

  const { data: classroom, isFetching, isError } = useClassroom(parsedRoomId);

  const { register, handleSubmit, control, formState, reset, getValues } =
    useForm<ClassroomEditInput>({
      defaultValues: {
        roomName: "",
        description: "",
        categories: [],
      },
    });

  useEffect(() => {
    if (classroom) {
      reset({
        roomId: parsedRoomId,
        roomName: classroom.roomName,
        description: classroom.description,
        categories: classroom.categories.map((c) => ({
          category: c.category,
          existingDocuments: c.documents,
          deleteDocuments: [],
          newFiles: [],
        })),
      });
    }
  }, [classroom, parsedRoomId, reset]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "categories",
  });

  const onSubmit = (data: ClassroomEditInput) => {
    if (!formState.isDirty) {
      alert("変更内容がありません。");
      return;
    }

    const formData: ClassroomEditPost = {
      ...data,
      categories: data.categories.map(
        ({ category, deleteDocuments, newFiles }) => ({
          category,
          deleteDocuments,
          newFiles,
        }),
      ),
    };

    if (confirm("この内容で授業ルームを更新しますか？")) {
      // API処理
      console.log(formData);
      navigate(paths.app.management.classroom.list.path);
    }
  };

  return (
    <div className={commonStyles.contentsContainer}>
      <h2 className={commonStyles.sectionName}>授業ルーム編集</h2>
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
                onUpdate={(newValue) => {
                  const currentCategory = getValues(
                    `categories.${idx}.category`,
                  );
                  update(idx, {
                    ...newValue,
                    category: currentCategory,
                  });
                }}
                onRemove={() => remove(idx)}
              />
            ))}
            <button
              type="button"
              className={styles.addCategoryButton}
              onClick={() =>
                append({
                  category: "",
                  existingDocuments: [],
                  deleteDocuments: [],
                  newFiles: [],
                })
              }
            >
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
