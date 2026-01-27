import { useQuery } from "@tanstack/react-query";
import { type ClassroomItem } from "../types/classroom";

const DUMMY_CLASSROOMS: ClassroomItem[] = [
  {
    roomId: 1,
    roomName: "C言語",
    teacherName: "相田",
    latestUpdate: "2024/12/12",
  },
  {
    roomId: 2,
    roomName: "MySQL",
    teacherName: "秋田",
    latestUpdate: "2024/12/10",
  },
  {
    roomId: 3,
    roomName: "JAVA",
    teacherName: "上野",
    latestUpdate: "2024/12/05",
  },
  {
    roomId: 4,
    roomName: "Python",
    teacherName: "平松",
    latestUpdate: "2024/12/01",
  },
  {
    roomId: 5,
    roomName: "HTML/CSS",
    teacherName: "佐藤",
    latestUpdate: "2024/11/28",
  },
  {
    roomId: 6,
    roomName: "React",
    teacherName: "田中",
    latestUpdate: "2024/11/25",
  },
];

export const useClassrooms = () => {
  const { data, isFetching, isError, refetch } = useQuery<ClassroomItem[]>({
    queryKey: ["classrooms"],
    queryFn: async (): Promise<ClassroomItem[]> => {
      // のちにAPIを実装
      return DUMMY_CLASSROOMS;
    },
    initialData: DUMMY_CLASSROOMS,
  });

  return { data, isFetching, isError, refetch };
};
