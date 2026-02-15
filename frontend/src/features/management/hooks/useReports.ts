import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReportType } from "../types/report";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
export const useReports = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  const {
    data: reportList,
    isFetching,
    isError,
    refetch,
  } = useQuery<ReportType[]>({
    queryKey: ["reports"],
    enabled: false,
    initialData: [],
    queryFn: async (): Promise<ReportType[]> => {
      return await apiWithRefresh<ReportType[]>({
        url: "/report/list",
        options: {
          method: "GET",
          headers: { Authorization: `Bearer ${authToken}` },
        },
      });
    },
  });
  reportList?.forEach((report) => {
    report.reportDate = new Date(report.reportDate).toLocaleDateString(
      "ja-JP",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    );
    report.reportedPostDate = new Date(
      report.reportedPostDate,
    ).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });
  return { reportList, isFetching, isError, refetch };
};

export const useDeleteReport = () => {
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: string): Promise<void> => {
      await apiWithRefresh<void>({
        url: `/report/delete?reportId=${reportId}`,
        options: {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
