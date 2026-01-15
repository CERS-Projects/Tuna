import { useNavigate } from "react-router";
import { type AccountType } from "../../types/account";
import { paths } from "@/config/paths";
import styles from "./accountTable.module.css";

type Props = {
  accounts: AccountType[];
};

export const AccountTable = ({ accounts }: Props) => {
  const navigate = useNavigate();

  const handleUserNavigate = (userId: number, showUserId: string) => {
    navigate(paths.app.management.account.edit.getHref(showUserId), {
      relative: "route",
      state: { userId: userId },
    });
  };

  return (
    <div className={styles.accountTableContainer}>
      <table className={styles.accountTable}>
        <thead>
          <tr>
            <th>ユーザID</th>
            <th>名前</th>
            <th>権限</th>
            <th>学年</th>
            <th>アカウント状態</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((account) => {
              return (
                <tr
                  key={account.userId}
                  tabIndex={0}
                  onClick={() =>
                    handleUserNavigate(account.userId, account.showUserId)
                  }
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    handleUserNavigate(account.userId, account.showUserId);
                  }}
                >
                  <td>{account.showUserId}</td>
                  <td>{account.name}</td>
                  <td>
                    {account.authority === -1 ? (
                      <span className={`${styles.badge} ${styles.student}`}>
                        {"生徒"}
                      </span>
                    ) : account.authority === 0 ? (
                      <span className={`${styles.badge} ${styles.teacher}`}>
                        {"教師"}
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.admin}`}>
                        {"学校管理者"}
                      </span>
                    )}
                  </td>
                  <td>{account.grade ? `${account.grade}年` : "-"}</td>
                  <td>
                    {account.accountStopFlag === 0 ? (
                      <span className={styles.isAvailable}>{"利用可"}</span>
                    ) : (
                      <span className={styles.isStopped}>{"停止中"}</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5}>該当データがありませんでした</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
