import { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styles from "./accountImportTable.module.css";
import { type StudentAccountImportType } from "../../types/account";

type ShowPassConfigsType = {
  [key: number]: boolean;
};

type Props = {
  accounts: StudentAccountImportType[];
};

export const AccountImportTable = ({ accounts }: Props) => {
  const [show, setShow] = useState<ShowPassConfigsType>({});

  useEffect(() => {
    setShow(() => {
      const next: ShowPassConfigsType = {};
      accounts.forEach((_, index) => {
        next[index] = false;
      });
      return next;
    });
  }, [accounts]);

  const toggleConfig = (targetId: number) => {
    setShow((prev) => ({
      ...prev,
      [targetId]: !prev[targetId],
    }));
  };

  return (
    <div className={`${styles.accountTableContainer} ${styles.student}`}>
      <h3 className={styles.sectionName}>登録プレビュー</h3>

      <div className={styles.tableScroll}>
        <table className={styles.accountTable}>
          <thead>
            <tr>
              <th>表示用ユーザID</th>
              <th>名前</th>
              <th>学年</th>
              <th>メールアドレス</th>
              <th>パスワード</th>
              <th>入学時期</th>
              <th>卒業見込み</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              return (
                <tr key={index}>
                  <td>{account.showUserId}</td>
                  <td>{account.name}</td>
                  <td>{account.grade}</td>
                  <td>{account.email}</td>
                  <td>
                    <div className={styles.passwordCol}>
                      {show[index] ? (
                        <>
                          <span>{account.password}</span>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => toggleConfig(index)}
                          >
                            <FaRegEye />
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{"********"}</span>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => toggleConfig(index)}
                          >
                            <FaRegEyeSlash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td>{account.entryDate}</td>
                  <td>{account.graduateDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
