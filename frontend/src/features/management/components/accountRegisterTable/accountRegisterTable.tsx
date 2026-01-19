import { type StudentAccountRegisterType } from "../../types/account";
import { MdEdit } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaRegTrashAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import styles from "./accountRegisterTable.module.css";

type ShowPassConfigsType = {
  [key: number]: boolean;
};

type StudentRegisterTableProps = {
  accounts: StudentAccountRegisterType[];
  setAccounts: (accounts: StudentAccountRegisterType[]) => void;
};

export const StudentAccountRegisterTable = ({
  accounts,
  setAccounts,
}: StudentRegisterTableProps) => {
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
    <div className={styles.accountTableContainer}>
      <h3 className={styles.sectionName}>登録プレビュー</h3>

      <div className={styles.tableScroll}>
        <table className={styles.accountTable}>
          <thead>
            <tr>
              <th>名前</th>
              <th>学年</th>
              <th>メールアドレス</th>
              <th>パスワード</th>
              <th>入学時期</th>
              <th>卒業見込み</th>
              <th className={styles.actionsHead}>操作</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              return (
                <tr key={index} tabIndex={0}>
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
                  <td className={styles.actionsCell}>
                    <div className={styles.actionsInner}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        title="編集"
                      >
                        <MdEdit color="rgb(56, 94, 164)" />
                      </button>
                      <button
                        type="button"
                        className={styles.actionButton}
                        title="削除"
                      >
                        <FaRegTrashAlt color="#fa5959" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
