import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { FaChevronLeft } from "react-icons/fa";
import styles from "@/features/management/style/accountEdit.module.css";
import { paths } from "@/config/paths";

type LocationState = {
  userId?: string;
};

const AccountEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as LocationState | null) ?? null;
  const userId = state?.userId;

  useEffect(() => {
    if (!userId)
      navigate(paths.app.management.account.list.path, { replace: true });
  }, [userId, navigate]);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: 更新API呼び出し
    // 例: await updateAccount(...)
  };

  const handleDelete = async () => {
    const ok = window.confirm("このアカウントを削除します。よろしいですか？");
    if (!ok) return;

    // TODO: 削除API呼び出し
    // 例: await deleteAccount(...)
    // 成功後に一覧へ戻すなど
    // navigate(-1);
  };

  return (
    <div className={styles.contents}>
      <button className={styles.backList} onClick={() => navigate(-1)}>
        <FaChevronLeft />
        アカウント一覧に戻る
      </button>

      <h3 className={styles.sectionName}>アカウント編集</h3>
      <hr />

      <form className={styles.editForm} onSubmit={handleUpdate}>
        <div className={styles.row}>
          <div className={`${styles.input} ${styles.rowGrow}`}>
            <label htmlFor="accountName">名前</label>
            <input
              id="accountName"
              type="text"
              placeholder="名前を入力..."
              defaultValue={userId ?? "aaa"}
            />
          </div>

          <div className={`${styles.input} ${styles.rowNarrow}`}>
            <label htmlFor="grade">学年</label>
            <input id="grade" type="text" placeholder="数字で入力..." />
          </div>
        </div>

        <div className={`${styles.input} ${styles.emailField}`}>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            placeholder="メールアドレスを入力..."
          />
        </div>

        <div className={styles.toggle}>
          <label htmlFor="isStop">停止 / 停止解除</label>
          <input id="isStop" type="checkbox" />
        </div>

        <div className={`${styles.input} ${styles.dateField}`}>
          <label htmlFor="expectedGraduation">卒業見込み</label>
          <input id="expectedGraduation" type="date" />
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.primary}`}
            type="submit"
          >
            更新
          </button>
          <button
            className={`${styles.button} ${styles.danger}`}
            type="button"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountEdit;
