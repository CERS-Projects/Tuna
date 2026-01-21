import { BackPage } from "@/features/management/components/backPage/backPage";
import {
  StudentAccountRegisterForm,
  TeacherAccountRegisterForm,
} from "@/features/management/components/accountRegisterForm/accountRegisterForm";
import {
  type StudentAccountRegisterType,
  type TeacherAccountRegisterType,
} from "@/features/management/types/account";
import { useState, useRef, useCallback } from "react";
import { useBeforeUnload } from "react-router";
import { useBlockNavigation } from "@/hooks/useBlockNavigation";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountRegister.module.css";
import {
  StudentAccountRegisterTable,
  TeacherAccountRegisterTable,
} from "@/features/management/components/accountRegisterTable/accountRegisterTable";

const initialStudent: StudentAccountRegisterType = {
  name: "",
  grade: 1,
  email: "",
  password: "",
  passwordConfirm: "",
  entryDate: "",
  graduateDate: "",
};

const initialTeacher: TeacherAccountRegisterType = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const AccountRegister = () => {
  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  const formRef = useRef<HTMLDivElement | null>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const studentTableRef = useRef<(HTMLTableRowElement | null)[]>([]);
  const scrollToStudentTable = (index: number | null) => {
    if (index !== null) {
      studentTableRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const teacherTableRef = useRef<(HTMLTableRowElement | null)[]>([]);
  const scrollToTeacherTable = (index: number | null) => {
    if (index !== null) {
      teacherTableRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const [currentStudent, setCurrentStudent] =
    useState<StudentAccountRegisterType>(initialStudent);

  const [currentTeacher, setCurrentTeacher] =
    useState<TeacherAccountRegisterType>(initialTeacher);

  const [studentAccounts, setStudentAccounts] = useState<
    StudentAccountRegisterType[]
  >([]);

  const [editingStudentIndex, setEditingStudentIndex] = useState<number | null>(
    null,
  );

  const [teacherAccounts, setTeacherAccounts] = useState<
    TeacherAccountRegisterType[]
  >([]);

  const [editingTeacherIndex, setEditingTeacherIndex] = useState<number | null>(
    null,
  );

  useBlockNavigation(
    teacherAccounts.length > 0 || studentAccounts.length > 0 ? true : false,
  );

  useBeforeUnload(
    useCallback(
      (e) => {
        if (teacherAccounts.length > 0 || studentAccounts.length > 0) {
          e.preventDefault();
        }
      },
      [studentAccounts, teacherAccounts],
    ),
  );

  const handleSubmit = () => {
    const cancel = confirm("この内容で登録しますか？");

    if (cancel === false) return;

    if (activeTab === "student") {
      if (studentAccounts.length === 0) {
        alert("データが追加されていません");
        return;
      }

      console.log(studentAccounts);
      setStudentAccounts([]);
    } else {
      if (teacherAccounts.length === 0) {
        alert("データが追加されていません");
        return;
      }

      console.log(teacherAccounts);
      setTeacherAccounts([]);
    }
  };

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
        <div className={styles.formContainer} ref={formRef}>
          {activeTab === "student" ? (
            <StudentAccountRegisterForm
              current={currentStudent}
              setCurrent={setCurrentStudent}
              accounts={studentAccounts}
              setAccounts={setStudentAccounts}
              editingIndex={editingStudentIndex}
              setEditingIndex={setEditingStudentIndex}
              initialStudent={initialStudent}
              onFormDone={scrollToStudentTable}
            />
          ) : (
            <TeacherAccountRegisterForm
              current={currentTeacher}
              setCurrent={setCurrentTeacher}
              accounts={teacherAccounts}
              setAccounts={setTeacherAccounts}
              editingIndex={editingTeacherIndex}
              setEditingIndex={setEditingTeacherIndex}
              initialTeacher={initialTeacher}
              onFormDone={scrollToTeacherTable}
            />
          )}
        </div>

        <div></div>

        {activeTab === "student" ? (
          <StudentAccountRegisterTable
            setCurrent={setCurrentStudent}
            setEditingIndex={setEditingStudentIndex}
            accounts={studentAccounts}
            setAccounts={setStudentAccounts}
            onEditDone={scrollToForm}
            tableRef={studentTableRef}
          />
        ) : (
          <TeacherAccountRegisterTable
            setCurrent={setCurrentTeacher}
            setEditingIndex={setEditingTeacherIndex}
            accounts={teacherAccounts}
            setAccounts={setTeacherAccounts}
            onEditDone={scrollToForm}
            tableRef={teacherTableRef}
          />
        )}

        <button className={styles.button} onClick={handleSubmit}>
          作成完了
        </button>
      </div>
    </div>
  );
};

export default AccountRegister;
