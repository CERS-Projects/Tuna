import { useQuery } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
	categoryType,
	materialType,
	classroomData,
} from "@/features/classroom/material/types/material";

type ClassroomDetailResponse = classroomData & {
	categories: (categoryType & {
		documents: materialType[];
	})[];
};

export const useClassroom = (roomId: string | undefined) => {
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();

	const { data, isFetching, isError, refetch } =
		useQuery<ClassroomDetailResponse>({
			queryKey: ["classroom", roomId],
			enabled: !!authToken && !!roomId,
			queryFn: async (): Promise<ClassroomDetailResponse> => {
				const classroom = await apiWithRefresh<ClassroomDetailResponse>({
					url: `/classroom/detail?roomId=${roomId}`,
					options: {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${authToken}`,
						},
					},
				});
				classroom.categories.forEach((category) => {
					category.documents.forEach((doc) => {
						doc.uploadedAt = new Date(doc.uploadedAt).toLocaleDateString("ja-JP", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
						});
					});
				});
				return classroom;
			},
			refetchOnMount: true,
		});

	return { data, isFetching, isError, refetch };
};
