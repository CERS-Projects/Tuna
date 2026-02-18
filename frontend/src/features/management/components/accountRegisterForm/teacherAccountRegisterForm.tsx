import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { type TeacherAccountRegisterType } from "../../types/account";
import styles from "./accountRegisterForm.module.css";

type ShowPassConfigsType = {
  [key: number]: boolean;
};

type TeacherFormProps = {
  current: TeacherAccountRegisterType;
  setCurrent: (current: TeacherAccountRegisterType) => void;
  accounts: TeacherAccountRegisterType[];
  setAccounts: (accounts: TeacherAccountRegisterType[]) => void;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  initialTeacher: TeacherAccountRegisterType;
  onFormDone: (index: number | null) => void;
};

export const TeacherAccountRegisterForm = ({
  current,
  setCurrent,
  accounts,
  setAccounts,
  editingIndex,
  setEditingIndex,
  initialTeacher,
  onFormDone,
}: TeacherFormProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<TeacherAccountRegisterType>();

  useEffect(() => {
    reset(current);
  }, [current, reset]);

  const [show, setShow] = useState<ShowPassConfigsType>({
    1: false,
    2: false,
  });

  const toggleConfig = (targetId: number) => {
    setShow((prev) => ({
      ...prev,
      [targetId]: !prev[targetId],
    }));
  };

  const onSubmit = (formData: TeacherAccountRegisterType) => {
    const targetIndex = editingIndex !== null ? editingIndex : accounts.length;

    if (editingIndex !== null) {
      const next = accounts.map((a, i) => (i === editingIndex ? formData : a));
      setAccounts(next);
      setEditingIndex(null);
    } else {
      setAccounts([...accounts, formData]);
    }

    setCurrent(initialTeacher);
    reset(initialTeacher);

    requestAnimationFrame(() => {
      onFormDone(targetIndex);
    });
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.input}>
        <label htmlFor="showUserId">ユーザーID</label>
        <input
          id="showUserId"
          type="text"
          placeholder="ユーザーIDを入力..."
          {...register("showUserId", {
            required: "ユーザーIDは必須です",
            maxLength: {
              value: 20,
              message: "20文字以内で入力してください",
            },
          })}
        />
        {errors.showUserId?.message && (
          <p className={styles.isError}>{errors.showUserId.message}</p>
        )}
      </div>

      <div className={styles.row}>
        <div className={`${styles.input} ${styles.colName}`}>
          <label htmlFor="accountName">名前</label>
          <input
            id="accountName"
            type="text"
            placeholder="名前を入力..."
            {...register("name", { required: "ユーザー名は必須です" })}
          />
          {errors.name?.message && (
            <p className={styles.isError}>{errors.name.message}</p>
          )}
        </div>
        <div className={styles.input}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            placeholder="メールアドレスを入力..."
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message:
                  "有効なメールアドレスを入力してください（例: school@example.com）",
              },
            })}
          />
          {errors.email?.message && (
            <p className={styles.isError}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.input}>
          <label htmlFor="password">パスワード</label>

          <div className={styles.inputWithIconInner}>
            <input
              id="password"
              type={!show[1] ? "password" : "text"}
              autoComplete="new-password"
              placeholder="パスワードを入力..."
              {...register("password", {
                required: "パスワードは必須です",
                minLength: {
                  value: 6,
                  message: "6文字以上で入力してください",
                },
              })}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => toggleConfig(1)}
              aria-label={!show[1] ? "パスワードを表示" : "パスワードを非表示"}>
              {!show[1] ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>

          {errors.password?.message && (
            <p className={styles.isError}>{errors.password.message}</p>
          )}
        </div>

        <div className={styles.input}>
          <label htmlFor="passwordConfirm">パスワード（確認用）</label>

          <div className={styles.inputWithIconInner}>
            <input
              id="passwordConfirm"
              type={!show[2] ? "password" : "text"}
              placeholder="パスワード（確認用）を入力..."
              {...register("passwordConfirm", {
                validate: (pass) => {
                  if (pass !== getValues("password")) {
                    return "パスワードが一致しません";
                  }

                  return true;
                },
                required: "確認は必須です",
              })}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => toggleConfig(2)}
              aria-label={!show[2] ? "パスワードを表示" : "パスワードを非表示"}>
              {!show[2] ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {errors.passwordConfirm?.message && (
            <p className={styles.isError}>{errors.passwordConfirm.message}</p>
          )}
        </div>
      </div>

      <div
        className={`${styles.row} ${editingIndex !== null ? styles.buttonRowTwo : ""}`}>
        <button className={styles.button} type="submit">
          {editingIndex !== null ? "更新" : "追加"}
        </button>

        {editingIndex !== null ? (
          <button
            className={styles.button}
            type="button"
            onClick={() => {
              setEditingIndex(null);
              setCurrent(initialTeacher);
              reset(initialTeacher);
            }}>
            キャンセル
          </button>
        ) : null}
      </div>
    </form>
  );
};
