import { useQuery } from "@tanstack/react-query";
import { type ClassroomType } from "../types/classroom";

const DUMMY_CLASSROOM: ClassroomType = {
  roomId: 1,
  roomName: "2026年度前期 数学A",
  description: "数学Aの授業ルームです。",
  categories: [
    {
      category: "資料",
      documents: [
        {
          name: "教科書.pdf",
          path: "/files/textbook.pdf",
          uploadDate: "2026-01-28",
        },
        {
          name: "課題.docx",
          path: "/files/homework.docx",
          uploadDate: "2026-01-27",
        },
      ],
    },
    {
      category: "連絡",
      documents: [],
    },
  ],
};

export const useClassroom = (roomId: number) => {
  const { data, isFetching, isError, refetch } = useQuery<ClassroomType>({
    queryKey: ["classroom", "edit", roomId],
    queryFn: async (): Promise<ClassroomType> => {
      // のちにAPIを実装
      return DUMMY_CLASSROOM;
    },
    initialData: DUMMY_CLASSROOM,
  });

  return { data, isFetching, isError, refetch };
};
