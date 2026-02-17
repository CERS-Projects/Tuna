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
import { useBeforeUnload, useNavigate } from "react-router";
import { useBlockNavigation } from "@/hooks/useBlockNavigation";
import { paths } from "@/config/paths";
import styles from "@/features/management/style/accountRegister.module.css";
import {
  StudentAccountRegisterTable,
  TeacherAccountRegisterTable,
} from "@/features/management/components/accountRegisterTable/accountRegisterTable";
import {
  useCreateStudents,
  useCreateTeachers,
} from "@/features/management/hooks/useAccountMutations";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { decodeUserParams } from "@/features/auth/utils/jwt";

const initialStudent: StudentAccountRegisterType = {
  showUserId: "",
  name: "",
  grade: 1,
  email: "",
  password: "",
  passwordConfirm: "",
  entryDate: "",
  graduateDate: "",
};

const initialTeacher: TeacherAccountRegisterType = {
  showUserId: "",
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const AccountRegister = () => {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const userInfo = decodeUserParams(authToken);
  const role = userInfo?.role ?? "STUDENT";
  const isAdmin = role === "ADMIN_SCHOOL";

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

  const createStudents = useCreateStudents({
    onSuccess: () => {
      alert("生徒アカウントを登録しました");
      navigate(paths.app.management.account.list.path);
    },
    onError: () => {
      alert("登録に失敗しました");
    },
  });

  const createTeachers = useCreateTeachers({
    onSuccess: () => {
      alert("教師アカウントを登録しました");
      navigate(paths.app.management.account.list.path);
    },
    onError: () => {
      alert("登録に失敗しました");
    },
  });

  const isPending = createStudents.isPending || createTeachers.isPending;

  useBlockNavigation(
    (teacherAccounts.length > 0 || studentAccounts.length > 0) && !isPending,
  );

  useBeforeUnload(
    useCallback(
      (e) => {
        if (
          (teacherAccounts.length > 0 || studentAccounts.length > 0) &&
          !isPending
        ) {
          e.preventDefault();
        }
      },
      [studentAccounts, teacherAccounts, isPending],
    ),
  );

  const handleSubmit = () => {
    const ok = confirm("この内容で登録しますか？");
    if (!ok) return;

    if (activeTab === "student") {
      if (studentAccounts.length === 0) {
        alert("データが追加されていません");
        return;
      }
      createStudents.mutate(studentAccounts);
    } else {
      if (teacherAccounts.length === 0) {
        alert("データが追加されていません");
        return;
      }
      createTeachers.mutate(teacherAccounts);
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

        {isAdmin ? (
          <div className={styles.toggleTab} data-active={activeTab}>
            <button
              type="button"
              className={activeTab === "student" ? styles.tabActive : ""}
              onClick={() => setActiveTab("student")}
              disabled={isPending}>
              生徒
            </button>
            <button
              type="button"
              className={activeTab === "teacher" ? styles.tabActive : ""}
              onClick={() => setActiveTab("teacher")}
              disabled={isPending}>
              教師
            </button>
          </div>
        ) : null}
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
          ) : isAdmin ? (
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
          ) : null}
        </div>

        {activeTab === "student" ? (
          <StudentAccountRegisterTable
            setCurrent={setCurrentStudent}
            setEditingIndex={setEditingStudentIndex}
            accounts={studentAccounts}
            setAccounts={setStudentAccounts}
            onEditDone={scrollToForm}
            tableRef={studentTableRef}
          />
        ) : isAdmin ? (
          <TeacherAccountRegisterTable
            setCurrent={setCurrentTeacher}
            setEditingIndex={setEditingTeacherIndex}
            accounts={teacherAccounts}
            setAccounts={setTeacherAccounts}
            onEditDone={scrollToForm}
            tableRef={teacherTableRef}
          />
        ) : null}

        <button
          type="button"
          className={styles.button}
          onClick={handleSubmit}
          disabled={isPending}>
          {isPending ? "登録中..." : "作成完了"}
        </button>
      </div>
    </div>
  );
};

export default AccountRegister;
