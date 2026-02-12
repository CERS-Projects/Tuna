import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { type Notice } from "@/features/notice/types/notice";

export const useNotices = () => {
  const api = useApiWithRefresh(); // 認証付きfetch関数を取得
  const queryClient = useQueryClient();

  // 1. データの取得 (READ)
  const noticesQuery = useQuery({
    queryKey: ["notices"], // キャッシュのキー
    queryFn: async () => {
      // api関数経由でバックエンドを叩く
      return await api<Notice[]>({ url: "/notice", options: {} });
    },
  });

  // 2. データの削除 (DELETE)
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api<void>({
        url: `/notices/${id}`,
        options: { method: "DELETE" },
      });
    },
    // 成功したらリストを再取得（リフェッチ）する
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });

  return {
    notices: noticesQuery.data ?? [], // データがない場合は空配列
    isLoading: noticesQuery.isLoading,
    isError: noticesQuery.isError,
    error: noticesQuery.error,
    deleteNotice: deleteMutation.mutate, // 削除実行関数
  };
};
