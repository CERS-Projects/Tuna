import { useQuery } from "@tanstack/react-query";
import { type Classroom } from "../types/SelectClassroom";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useClassrooms = () => {
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();

	const { data, isFetching, isError, refetch } = useQuery<Classroom[]>({
		queryKey: ["classrooms"],
		enabled: !!authToken,
		queryFn: async (): Promise<Classroom[]> => {
			const classrooms = await apiWithRefresh<Classroom[]>({
				url: `/classroom/list`,
				options: {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authToken}`,
					},
				},
			});
			classrooms.map((classroom) => {
				classroom.latestUpdate = new Date(
					classroom.latestUpdate,
				).toLocaleDateString("ja-JP", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				});
			});
			return classrooms;
		},
		refetchOnMount: true,
	});

	return {
		data,
		isFetching,
		isError,
		refetch,
	};
};
