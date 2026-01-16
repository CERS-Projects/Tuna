import { BackPage } from "@/features/management/components/backPage/backPage";
import {
  StudentAccountRegisterForm,
  TeacherAccountRegisterForm,
} from "@/features/management/components/accountRegisterForm/accountRegisterForm";
import { useState } from "react";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountRegister.module.css";

const AccountRegister = () => {
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");

  return (
    <div className={styles.contents}>
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

      {activeTab === "student" ? (
        <StudentAccountRegisterForm />
      ) : (
        <TeacherAccountRegisterForm />
      )}
    </div>
  );
};

export default AccountRegister;
