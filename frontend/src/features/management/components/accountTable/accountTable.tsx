import { type AccountType } from "../../types/account";
import styles from "./accountTable.module.css";

type Props = {
  accounts: AccountType[];
};

export const AccountTable = ({ accounts }: Props) => {
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
          {accounts ? (
            accounts.map((account) => {
              return (
                <tr key={account.userId}>
                  <td>{account.showUserId}</td>
                  <td>{account.name}</td>
                  <td>
                    {account.authority === 0 ? (
                      <span className={`${styles.badge} ${styles.student}`}>
                        {"生徒"}
                      </span>
                    ) : account.authority === 1 ? (
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
                      <span className={styles.isStoped}>{"停止中"}</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </div>
  );
};
