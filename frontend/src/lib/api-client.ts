import {
  type ApiRequestType,
  type ApiErrorType,
  ApiRequestError,
} from "@/types/apiRequestError";

export const api = async <T>({ url, options }: ApiRequestType): Promise<T> => {
  const api_url = `${import.meta.env.VITE_API_BASE_URL}${url}`;

  const response: T = await fetch(api_url, options)
    .catch((e) => {
      throw Error(e);
    })
    .then(handleErrors)
    .then((res) => res?.json());

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
