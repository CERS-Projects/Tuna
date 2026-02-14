import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
	ClassroomCreateInput,
	ClassroomEditPost,
} from "../types/classroom";

type UseEditClassroomsOptions = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
};

/** POST /classroom/create (multipart/form-data) */
export const useCreateClassroom = (options?: UseEditClassroomsOptions) => {
	const queryClient = useQueryClient();
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();

	return useMutation({
		mutationFn: async (data: ClassroomCreateInput) => {
			const formData = new FormData();
			formData.append("roomName", data.roomName);
			formData.append("description", data.description);

			data.categories.forEach((category, i) => {
				formData.append(`categories[${i}].categoryName`, category.categoryName);
				category.files.forEach((file, j) => {
					formData.append(
						`categories[${i}].documents[${j}].documentFile`,
						file,
						file.name,
					);
				});
			});

			return await apiWithRefresh<void>({
				url: "/classroom/create",
				options: {
					method: "POST",
					body: formData,
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["classrooms"],
			});
			options?.onSuccess?.();
		},
		onError: (error: Error) => {
			options?.onError?.(error);
		},
	});
};

/** PUT /classroom/update (multipart/form-data) */
export const useUpdateClassroom = (options?: UseEditClassroomsOptions) => {
	const queryClient = useQueryClient();
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();

	return useMutation({
		mutationFn: async (data: ClassroomEditPost) => {
			const formData = new FormData();
			formData.append("roomId", data.roomId);
			formData.append("roomName", data.roomName);
			formData.append("description", data.description);

			// 既存カテゴリの更新
			data.updateCategories.forEach((category, i) => {
				formData.append(`updateCategories[${i}].categoryId`, category.categoryId);
				formData.append(
					`updateCategories[${i}].categoryName`,
					category.categoryName,
				);
				category.deleteDocuments.forEach((doc, j) => {
					formData.append(
						`updateCategories[${i}].deleteDocumentIds[${j}]`,
						doc.documentId,
					);
				});
				category.newFiles.forEach((file) => {
					formData.append(
						`updateCategories[${i}].newDocumentFiles`,
						file,
						file.name,
					);
				});
			});

			// 新規カテゴリの追加
			data.newCategories.forEach((category, i) => {
				formData.append(`newCategories[${i}].categoryName`, category.categoryName);
				category.files.forEach((file, j) => {
					formData.append(
						`newCategories[${i}].documents[${j}].documentFile`,
						file,
						file.name,
					);
				});
			});

			// カテゴリの削除
			data.deletedCategoryIds.forEach((id, i) => {
				formData.append(`deleteCategoryIds[${i}]`, id);
			});

			return await apiWithRefresh<void>({
				url: "/classroom/update",
				options: {
					method: "PUT",
					body: formData,
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["classrooms"],
			});
			queryClient.invalidateQueries({
				queryKey: ["classroom"],
			});
			options?.onSuccess?.();
		},
		onError: (error: Error) => {
			options?.onError?.(error);
		},
	});
};

/** DELETE /classroom/delete?roomId={roomId} */
export const useDeleteClassroom = (options?: UseEditClassroomsOptions) => {
	const queryClient = useQueryClient();
	const apiWithRefresh = useApiWithRefresh();
	const { authToken } = useAuth();

	return useMutation({
		mutationFn: async (roomId: string) => {
			return await apiWithRefresh<void>({
				url: `/classroom/delete?roomId=${roomId}`,
				options: {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["classrooms"],
			});
			queryClient.invalidateQueries({
				queryKey: ["classroom"],
			});
			options?.onSuccess?.();
		},
		onError: (error: Error) => {
			options?.onError?.(error);
		},
	});
};
