export class ApiRequestError extends Error {
  statusMessage: string;
  body: ApiErrorType | undefined;

  constructor(statusMessage: string, body: ApiErrorType | undefined) {
    super();
    this.statusMessage = statusMessage;
    this.body = body;
  }
}

export type ApiRequestType = {
  url: string;
  options: RequestInit;
};

export type ApiErrorType = {
  statusCode: number;
  errorMessage: string;
};
