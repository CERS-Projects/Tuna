import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAccount } from "@/features/management/hooks/useAccount";
import {
  useModifyStudent,
  useModifyTeacher,
} from "@/features/management/hooks/useAccountMutations";
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
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";

const isTeacherAccount = (
  account: StudentAccountEditType | TeacherAccountEditType,
): account is TeacherAccountEditType => {
  return "authority" in account;
};

const AccountEdit = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const parsedUserId = Number(userId) || 0;

  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);
  const role = userInfo?.role ?? "STUDENT";
  const isAdmin = role === "ADMIN_SCHOOL";

  useEffect(() => {
    if (!userId || !Number.isFinite(parsedUserId) || parsedUserId <= 0) {
      navigate(paths.app.management.account.list.path, { replace: true });
    }
  }, [userId, navigate, parsedUserId]);

  const { data: account, isFetching, isError } = useAccount(parsedUserId);

  const modifyStudent = useModifyStudent({
    onSuccess: () => {
      alert("更新しました");
      navigate(paths.app.management.account.list.path, { replace: true });
    },
    onError: () => {
      alert("更新に失敗しました");
    },
  });

  const modifyTeacher = useModifyTeacher({
    onSuccess: () => {
      alert("更新しました");
      navigate(paths.app.management.account.list.path, { replace: true });
    },
    onError: () => {
      alert("更新に失敗しました");
    },
  });

  const handleStudentSubmit = (formData: StudentAccountEditType) => {
    modifyStudent.mutate({
      userId: formData.userId,
      name: formData.name,
      mailAddress: formData.email,
      graduateDate: formData.graduateDate,
      accountStopFlag: !!formData.accountStopFlag,
    });
  };

  const handleTeacherSubmit = (formData: TeacherAccountEditType) => {
    modifyTeacher.mutate({
      userId: formData.userId,
      name: formData.name,
      mailAddress: formData.email,
      authorityFlag: !!formData.authority,
      accountStopFlag: !!formData.accountStopFlag,
    });
  };

  const isPending = modifyStudent.isPending || modifyTeacher.isPending;

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
        <TeacherAccountEditForm
          {...account}
          onSubmit={handleTeacherSubmit}
          isPending={isPending}
        />
      ) : (
        <StudentAccountEditForm
          {...account}
          onSubmit={handleStudentSubmit}
          isPending={isPending}
        />
      )}

      <div className={styles.actions}>
        <button
          form="accountEditForm"
          className={`${styles.button} ${styles.primary}`}
          type="submit"
          disabled={isPending}>
          {isPending ? "更新中..." : "更新"}
        </button>

        {isAdmin && (
          <button
            className={`${styles.button} ${styles.danger}`}
            type="button"
            onClick={handleDelete}
            disabled={isPending}>
            削除
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountEdit;
