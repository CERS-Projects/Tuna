export type passwordResetForm = {
  mailAddress: string;
};

export type ChangePasswordForm = {
  newPassword: string;
  rePassword: string;
};

export type PasswordResetRequestType = {
  token: string;
  newPassword: string;
};
