import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  type StudentAccountRegisterType,
  type TeacherAccountRegisterType,
} from "../../types/account";
import styles from "./accountRegisterForm.module.css";

type ShowPassConfigsType = {
  [key: number]: boolean;
};

type StudentFormProps = {
  accounts: StudentAccountRegisterType[];
  setAccounts: (accounts: StudentAccountRegisterType[]) => void;
};

export const StudentAccountRegisterForm = ({
  accounts,
  setAccounts,
}: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<StudentAccountRegisterType>();

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

  const onSubmit = (formDate: StudentAccountRegisterType) => {
    console.log(formDate);
    setAccounts([...accounts, formDate]);
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
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
        <div className={`${styles.input} ${styles.colGrade}`}>
          <label htmlFor="grade">学年</label>
          <input
            id="grade"
            type="number"
            placeholder="数字で入力..."
            {...register("grade", {
              required: "学年は必須です",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "1以上の数値を入力してください",
              },
            })}
          />
          {errors.grade?.message && (
            <p className={styles.isError}>{errors.grade.message}</p>
          )}
        </div>
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

      <div className={styles.row}>
        <div className={styles.input}>
          <label htmlFor="password">パスワード</label>

          <div className={styles.inputWithIconInner}>
            <input
              id="password"
              type={!show[1] ? "password" : "text"}
              autoComplete="new-password"
              placeholder="パスワードを入力..."
              {...register("password", { required: "パスワードは必須です" })}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => toggleConfig(1)}
              aria-label={!show[1] ? "パスワードを表示" : "パスワードを非表示"}
            >
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
                },
                required: "確認は必須です",
              })}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => toggleConfig(2)}
              aria-label={!show[2] ? "パスワードを表示" : "パスワードを非表示"}
            >
              {!show[2] ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {errors.passwordConfirm?.message && (
            <p className={styles.isError}>{errors.passwordConfirm.message}</p>
          )}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.input}>
          <label htmlFor="entryDate">入学時期</label>
          <input
            id="entryDate"
            type="date"
            {...register("entryDate", { required: "この項目は必須です" })}
          />
          {errors.entryDate?.message && (
            <p className={styles.isError}>{errors.entryDate.message}</p>
          )}
        </div>
        <div className={styles.input}>
          <label htmlFor="graduateDate">卒業見込み</label>
          <input
            id="graduateDate"
            type="date"
            {...register("graduateDate", { required: "この項目は必須です" })}
          />
          {errors.graduateDate?.message && (
            <p className={styles.isError}>{errors.graduateDate.message}</p>
          )}
        </div>
      </div>

      <button className={styles.button} type="submit">
        追加
      </button>
    </form>
  );
};

type TeacherFormProps = {
  accounts: TeacherAccountRegisterType[];
  setAccounts: (accounts: TeacherAccountRegisterType[]) => void;
};

export const TeacherAccountRegisterForm = ({
  accounts,
  setAccounts,
}: TeacherFormProps) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<TeacherAccountRegisterType>();

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

  const onSubmit = (formDate: TeacherAccountRegisterType) => {
    console.log(formDate);
    setAccounts([...accounts, formDate]);
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)}>
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
              {...register("password", { required: "パスワードは必須です" })}
            />

            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => toggleConfig(1)}
              aria-label={!show[1] ? "パスワードを表示" : "パスワードを非表示"}
            >
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
                },
                required: "確認は必須です",
              })}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => toggleConfig(2)}
              aria-label={!show[2] ? "パスワードを表示" : "パスワードを非表示"}
            >
              {!show[2] ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {errors.passwordConfirm?.message && (
            <p className={styles.isError}>{errors.passwordConfirm.message}</p>
          )}
        </div>
      </div>

      <button className={styles.button} type="submit">
        追加
      </button>
    </form>
  );
};
