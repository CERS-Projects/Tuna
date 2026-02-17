import {
  type StudentAccountRegisterType,
  type TeacherAccountRegisterType,
} from "../../types/account";
import { MdEdit } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash, FaRegTrashAlt } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import styles from "./accountRegisterTable.module.css";

type ShowPassConfigsType = {
  [key: number]: boolean;
};

type StudentRegisterTableProps = {
  setCurrent: (current: StudentAccountRegisterType) => void;
  setEditingIndex: (index: number | null) => void;
  accounts: StudentAccountRegisterType[];
  setAccounts: (accounts: StudentAccountRegisterType[]) => void;
  onEditDone?: () => void;
  tableRef: React.RefObject<(HTMLTableRowElement | null)[]>;
};

export const StudentAccountRegisterTable = ({
  setCurrent,
  setEditingIndex,
  accounts,
  setAccounts,
  onEditDone,
  tableRef,
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

  const handleEdit = (account: StudentAccountRegisterType, index: number) => {
    setCurrent({ ...account });
    setEditingIndex(index);

    requestAnimationFrame(() => {
      onEditDone?.();
    });
  };

  const handleDelete = (account: StudentAccountRegisterType) => {
    const newAccounts = accounts.filter((a) => a !== account);
    setAccounts(newAccounts);
    setEditingIndex(null);
  };

  return (
    <div className={`${styles.accountTableContainer} ${styles.student}`}>
      <h3 className={styles.sectionName}>登録プレビュー</h3>

      <div className={styles.tableScroll}>
        <table className={styles.accountTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>学年</th>
              <th>メールアドレス</th>
              <th>パスワード</th>
              <th className={styles.actionsHead}>操作</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              return (
                <tr
                  key={index}
                  ref={(e) => {
                    tableRef.current[index] = e;
                  }}>
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
                            onClick={() => toggleConfig(index)}>
                            <FaRegEye />
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{"********"}</span>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => toggleConfig(index)}>
                            <FaRegEyeSlash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionsInner}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        title="編集"
                        onClick={() => handleEdit(account, index)}>
                        <MdEdit color="rgb(56, 94, 164)" />
                      </button>
                      <button
                        type="button"
                        className={styles.actionButton}
                        title="削除"
                        onClick={() => handleDelete(account)}>
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

type TeacherRegisterTableProps = {
  setCurrent: (current: TeacherAccountRegisterType) => void;
  setEditingIndex: (index: number | null) => void;
  accounts: TeacherAccountRegisterType[];
  setAccounts: (accounts: TeacherAccountRegisterType[]) => void;
  onEditDone?: () => void;
  tableRef: React.RefObject<(HTMLTableRowElement | null)[]>;
};

export const TeacherAccountRegisterTable = ({
  setCurrent,
  setEditingIndex,
  accounts,
  setAccounts,
  onEditDone,
  tableRef,
}: TeacherRegisterTableProps) => {
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

  const handleEdit = (account: TeacherAccountRegisterType, index: number) => {
    setCurrent({ ...account });
    setEditingIndex(index);

    requestAnimationFrame(() => {
      onEditDone?.();
    });
  };

  const handleDelete = (account: TeacherAccountRegisterType) => {
    const newAccounts = accounts.filter((a) => a !== account);
    setAccounts(newAccounts);
    setEditingIndex(null);
  };

  return (
    <div className={`${styles.accountTableContainer} ${styles.teacher}`}>
      <h3 className={styles.sectionName}>登録プレビュー</h3>

      <div className={styles.tableScroll}>
        <table className={styles.accountTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>メールアドレス</th>
              <th>パスワード</th>
              <th className={styles.actionsHead}>操作</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              return (
                <tr
                  key={index}
                  ref={(e) => {
                    tableRef.current[index] = e;
                  }}>
                  <td>{account.showUserId}</td>
                  <td>{account.name}</td>
                  <td>{account.email}</td>
                  <td>
                    <div className={styles.passwordCol}>
                      {show[index] ? (
                        <>
                          <span>{account.password}</span>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => toggleConfig(index)}>
                            <FaRegEye />
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{"********"}</span>
                          <button
                            type="button"
                            className={styles.actionButton}
                            onClick={() => toggleConfig(index)}>
                            <FaRegEyeSlash />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionsInner}>
                      <button
                        type="button"
                        className={styles.actionButton}
                        title="編集"
                        onClick={() => handleEdit(account, index)}>
                        <MdEdit color="rgb(56, 94, 164)" />
                      </button>
                      <button
                        type="button"
                        className={styles.actionButton}
                        title="削除"
                        onClick={() => handleDelete(account)}>
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
