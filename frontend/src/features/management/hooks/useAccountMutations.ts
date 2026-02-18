import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiWithRefresh } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  StudentAccountRegisterType,
  TeacherAccountRegisterType,
  ModifyStudentAccountRequestType,
  ModifyTeacherAccountRequestType,
} from "../types/account";

type UseMutationOptions = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreateStudents = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (students: StudentAccountRegisterType[]) => {
      const body = students.map((s) => ({
        showUserId: s.showUserId,
        password: s.password,
        mailAddress: s.email,
        name: s.name,
        grade: s.grade,
        admissionDate: s.entryDate,
        graduateDate: s.graduateDate || null,
      }));

      return await apiWithRefresh<void>({
        url: "/accounts/student",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useCreateStudentsByCsv = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return await apiWithRefresh<void>({
        url: "/accounts/student/csv-file",
        options: {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useCreateTeacher = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (teacher: TeacherAccountRegisterType) => {
      const body = {
        showUserId: teacher.showUserId,
        name: teacher.name,
        mailAddress: teacher.email,
        password: teacher.password,
      };

      return await apiWithRefresh<void>({
        url: "/accounts/teacher",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(body),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useModifyStudent = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (data: ModifyStudentAccountRequestType) => {
      return await apiWithRefresh<void>({
        url: "/accounts/student/modify",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useModifyTeacher = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (data: ModifyTeacherAccountRequestType) => {
      return await apiWithRefresh<void>({
        url: "/accounts/teacher/modify",
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(data),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useCreateTeachers = (options?: UseMutationOptions) => {
  const queryClient = useQueryClient();
  const apiWithRefresh = useApiWithRefresh();
  const { authToken } = useAuth();

  return useMutation({
    mutationFn: async (teachers: TeacherAccountRegisterType[]) => {
      for (const teacher of teachers) {
        const body = {
          showUserId: teacher.showUserId,
          name: teacher.name,
          mailAddress: teacher.email,
          password: teacher.password,
        };

        await apiWithRefresh<void>({
          url: "/accounts/teacher",
          options: {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
