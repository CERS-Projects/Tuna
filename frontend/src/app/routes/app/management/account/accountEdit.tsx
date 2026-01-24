import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAccount } from "@/features/management/hooks/useAccount";
import { BackPage } from "@/features/management/components/backPage/backPage";
import {
  StudentAccountEditForm,
  TeacherAccountEditForm,
} from "@/features/management/components/accountEditForm/accountEditForm";
import {
  type StudentAccountEditType,
  type TeacherAccountEditType,
} from "@/features/management/types/account";
import styles from "@/features/management/style/accountEdit.module.css";
import { paths } from "@/config/paths";

const isTeacherAccount = (
  account: StudentAccountEditType | TeacherAccountEditType,
): account is TeacherAccountEditType => {
  return "authority" in account;
};

const AccountEdit = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const parsedUserId = Number(userId) || 0;

  useEffect(() => {
    if (!userId || Number.isFinite(parsedUserId) || parsedUserId <= 0) {
      navigate(paths.app.management.account.list.path, { replace: true });
    }
  }, [userId, navigate, parsedUserId]);

  const { data: account, isFetching, isError } = useAccount(parsedUserId);

  const handleDelete = async () => {
    if (!userId) {
      console.log("userIdがありません");
      return;
    }

    console.log(`ユーザID：${userId}のアカウントを削除しました`);
    navigate(paths.app.management.account.list.path, { replace: true });
  };

  return (
    <div className={styles.contents}>
      <BackPage
        to={paths.app.management.account.list.path}
        label={"アカウント一覧に戻る"}
      />

      <h3 className={styles.sectionName}>アカウント編集</h3>
      <hr />

      {isError ? (
        <div>読み込みに失敗しました</div>
      ) : isFetching || !account ? (
        <div>読み込み中...</div>
      ) : isTeacherAccount(account) ? (
        <TeacherAccountEditForm {...account} />
      ) : (
        <StudentAccountEditForm {...account} />
      )}

      <div className={styles.actions}>
        <button
          form="accountEditForm"
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
    </div>
  );
};

export default AccountEdit;
