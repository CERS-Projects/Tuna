import {
  type ApiRequestType,
  type ApiErrorType,
  ApiRequestError,
} from "@/types/apiRequestError";
import { useRefreshToken } from "@/features/auth/hooks/useRefreshToken";
import { paths } from "@/config/paths";
import { useNavigate } from "react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const api = async <T>({ url, options }: ApiRequestType): Promise<T> => {
  const api_url = `${import.meta.env.VITE_API_BASE_URL}${url}`;

  const response: T = await fetch(api_url, options)
    .catch((e) => {
      throw Error(e.message);
    })
    .then(handleErrors)
    .then(async (res) => {
      if (!res) return null;

      const text = await res.text();
      return text ? JSON.parse(text) : null;
    });

  return response;
};

const handleErrors = async (res: void | Response) => {
  if (!res) return;
  if (res.ok) return res;

  let body: ApiErrorType | undefined = undefined;
  try {
    body = await res.json();
  } catch {
    // Non json response
  }

  switch (res.status) {
    case 400:
      throw new ApiRequestError("INVALID_TOKEN", body);
    case 401:
      throw new ApiRequestError("UNAUTHORIZED", body);
    case 403:
      throw new ApiRequestError("FORBIDDEN", body);
    case 500:
      throw new ApiRequestError("INTERNAL_SERVER_ERROR", body);
    case 502:
      throw new ApiRequestError("BAD_GATEWAY", body);
    case 404:
      throw new ApiRequestError("NOT_FOUND", body);
    default:
      throw new ApiRequestError("UNHANDLED_ERROR", body);
  }
};

let sharedRefreshPromise: Promise<string> | null = null;

export const useApiWithRefresh = () => {
  const { setAuthToken } = useAuth();
  const { mutateAsync } = useRefreshToken();
  const navigate = useNavigate();

  const apiWithRefresh = async <T>(params: ApiRequestType): Promise<T> => {
    try {
      return await api<T>(params);
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        error.statusMessage === "UNAUTHORIZED"
      ) {
        try {
          if (!sharedRefreshPromise) {
            sharedRefreshPromise = mutateAsync()
              .then((res) => {
                setAuthToken(res.token);
                return res.token;
              })
              .finally(() => {
                sharedRefreshPromise = null;
              });
          }

          const newToken = await sharedRefreshPromise;

          const newParams: ApiRequestType = {
            url: params.url,
            options: {
              ...(params.options ?? {}),
              headers: {
                ...(params.options?.headers ?? {}),
                Authorization: `Bearer ${newToken}`,
              },
            },
          };
          return await api<T>(newParams);
        } catch {
          setAuthToken("");
          navigate(paths.auth.login.path);
          throw error;
        }
      }
      throw error;
    }
  };

  return apiWithRefresh;
};
