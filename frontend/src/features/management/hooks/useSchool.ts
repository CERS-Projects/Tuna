import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type SchoolInformationType } from "../types/school";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useSchool = () => {
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();
	const { data, isFetching, isError, refetch } = useQuery<SchoolInformationType>(
		{
			queryKey: ["school", "information"],
			enabled: !!authToken,
			queryFn: async (): Promise<SchoolInformationType> => {
				const result = await apiWithRefresh<SchoolInformationType>({
					url: "/school/information",
					options: {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${authToken}`,
						},
					},
				});
				return result;
			},
		},
	);

	return { data, isFetching, isError, refetch };
};

export const useUpdateSchool = () => {
	const queryClient = useQueryClient();
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();

	return useMutation({
		mutationFn: async (
			data: SchoolInformationType,
		): Promise<SchoolInformationType> => {
			const result = await apiWithRefresh<SchoolInformationType>({
				url: "/school/modify",
				options: {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authToken}`,
					},
					body: JSON.stringify(data),
				},
			});
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["school", "information"] });
		},
	});
};
