import { BackPage } from "@/features/management/components/backPage/backPage";
import {
  StudentAccountRegisterForm,
  TeacherAccountRegisterForm,
} from "@/features/management/components/accountRegisterForm/accountRegisterForm";
import {
  type StudentAccountRegisterType,
  type TeacherAccountRegisterType,
} from "@/features/management/types/account";
import { useState } from "react";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountRegister.module.css";
import { StudentAccountRegisterTable } from "@/features/management/components/accountRegisterTable/accountRegisterTable";

const AccountRegister = () => {
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");

  const [studentAccounts, setStudentAccounts] = useState<
    StudentAccountRegisterType[]
  >([]);
  const [teacherAccounts, setTeacherAccounts] = useState<
    TeacherAccountRegisterType[]
  >([]);

  return (
    <div className={styles.contentsContainer}>
      <BackPage
        to={paths.app.management.account.new.path}
        label="アカウント登録メニューに戻る"
      />
      <header className={styles.header}>
        <h3 className={styles.sectionName}>手入力アカウント登録</h3>

        <div className={styles.toggleTab} data-active={activeTab}>
          <button
            className={activeTab === "student" ? styles.tabActive : ""}
            onClick={() => setActiveTab("student")}
          >
            生徒
          </button>
          <button
            className={activeTab === "teacher" ? styles.tabActive : ""}
            onClick={() => setActiveTab("teacher")}
          >
            教師
          </button>
        </div>
      </header>

      <hr />

      <div className={styles.contents}>
        <div className={styles.formContainer}>
          {activeTab === "student" ? (
            <StudentAccountRegisterForm
              accounts={studentAccounts}
              setAccounts={setStudentAccounts}
            />
          ) : (
            <TeacherAccountRegisterForm
              accounts={teacherAccounts}
              setAccounts={setTeacherAccounts}
            />
          )}
        </div>

        <div></div>

        {activeTab === "student" ? (
          <StudentAccountRegisterTable
            accounts={studentAccounts}
            setAccounts={setStudentAccounts}
          />
        ) : (
          <div>abcdefghijklmn</div>
        )}
      </div>
    </div>
  );
};

export default AccountRegister;
