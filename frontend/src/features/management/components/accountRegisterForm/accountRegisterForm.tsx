import { useForm } from "react-hook-form";
import styles from "./accountRegisterForm.module.css";

export const StudentAccountRegisterForm = () => {
  return (
    <form className={styles.registerForm}>
      <div className={styles.row}>
        <div className={`${styles.input} ${styles.colName}`}>
          <label htmlFor="accountName">名前</label>
          <input
            id="accountName"
            type="text"
            placeholder="名前を入力..."
            //   {...register("name", { required: "ユーザー名は必須です" })}
          />
          {/* {errors.name?.message && (
          <p className={styles.isError}>{errors.name.message}</p>
        )} */}
        </div>
        <div className={`${styles.input} ${styles.colGrade}`}>
          <label htmlFor="grade">学年</label>
          <input
            id="grade"
            type="number"
            placeholder="数字で入力..."
            //   {...register("grade", {
            //     required: "学年は必須です",
            //     valueAsNumber: true,
            //     min: {
            //       value: 1,
            //       message: "1以上の数値を入力してください",
            //     },
            //   })}
          />
          {/* {errors.grade?.message && (
          <p className={styles.isError}>{errors.grade.message}</p>
        )} */}
        </div>
      </div>

      <div className={styles.input}>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          placeholder="メールアドレスを入力..."
          //   {...register("email", {
          //     required: "メールアドレスは必須です",
          //     pattern: {
          //       value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
          //       message:
          //         "有効なメールアドレスを入力してください（例: school@example.com）",
          //     },
          //   })}
        />
        {/* {errors.email?.message && (
          <p className={styles.isError}>{errors.email.message}</p>
        )} */}
      </div>

      <div className={styles.row}>
        <div className={styles.input}>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            placeholder="パスワードを入力..."
            //   {...register("password", { required: "パスワードは必須です" })}
          />
          {/* {errors.password?.message && (
          <p className={styles.isError}>{errors.password.message}</p>
        )} */}
        </div>
        <button className={styles.button} type="button">
          パスワード生成
        </button>
        <div className={styles.input}>
          <label htmlFor="passwordConfirm">パスワード（確認用）</label>
          <input
            id="passwordConfirm"
            type="password"
            placeholder="パスワード（確認用）を入力..."
            //   {...register("passwordConfirm", { required: "確認は必須です" })}
          />
          {/* {errors.passwordConfirm?.message && (
          <p className={styles.isError}>{errors.passwordConfirm.message}</p>
        )} */}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.input}>
          <label htmlFor="entryDate">入学時期</label>
          <input
            id="entryDate"
            type="date"
            //{...register("entryDate", { required: "この項目は必須です" })}
          />
          {/* {errors.entryDate?.message && (
          <p className={styles.isError}>{errors.entryDate.message}</p>
        )} */}
        </div>
        <div className={styles.input}>
          <label htmlFor="expectedGraduation">卒業見込み</label>
          <input
            id="expectedGraduation"
            type="date"
            //{...register("graduateDate", { required: "この項目は必須です" })}
          />
          {/* {errors.graduateDate?.message && (
          <p className={styles.isError}>{errors.graduateDate.message}</p>
        )} */}
        </div>
      </div>

      <button className={styles.button} type="submit">
        追加
      </button>
    </form>
  );
};

export const TeacherAccountRegisterForm = () => {
  return <form className={styles.registerForm}>Teacher</form>;
};
