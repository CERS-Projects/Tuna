import { useQuery } from "@tanstack/react-query";
import {
  type StudentAccountEditType,
  type TeacherAccountEditType,
} from "../types/account";

const DUMMY_STUDENT_ACCOUNT: StudentAccountEditType = {
  userId: 1,
  showUserId: "550e8400-e29b-41d4-a716-446655440000",
  name: "田中 太郎",
  email: "tanaka@tarou.jp",
  accountStopFlag: 1,
  grade: 3,
  graduateDate: "2027-03-31",
};

const DUMMY_TEACHER_ACCOUNT: TeacherAccountEditType = {
  userId: 2,
  showUserId: "6fa459ea-ee8a-3ca4-894e-db77e160355e",
  name: "鈴木 花子",
  email: "suzuki@hanako.jp",
  accountStopFlag: 0,
  authority: 1, // 管理者
};

export const useAccount = (userId: number) => {
  const dummy: StudentAccountEditType | TeacherAccountEditType =
    userId % 2 === 0 ? DUMMY_TEACHER_ACCOUNT : DUMMY_STUDENT_ACCOUNT;

  const { data, isFetching, isError } = useQuery<
    StudentAccountEditType | TeacherAccountEditType
  >({
    queryKey: ["account", userId],
    enabled: userId > 0,
    queryFn: async (): Promise<
      StudentAccountEditType | TeacherAccountEditType
    > => {
      // のちにAPIを実装
      return dummy;
    },
    placeholderData: dummy,
  });

  return { data, isFetching, isError };
};
