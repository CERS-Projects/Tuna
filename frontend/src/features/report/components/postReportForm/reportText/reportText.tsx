import {
  REPORT_LIMITS,
  REPORT_MESSAGES,
} from "@/features/report/reportConstants";
import styles from "./reportText.module.css";
import { type UseFormRegisterReturn, type FieldError } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
  error?: FieldError;
};

export const ReportText = ({ register, error }: Props) => {
  const isError = !!error;
  return (
    <>
      <div className={styles.title}>通報の内容を正確に記載してください</div>
      <div className={styles.reportTextContainer}>
        <textarea
          placeholder={REPORT_MESSAGES.PLACEHOLDER}
          id="reportText"
          className={styles.reportText}
          {...register}
          maxLength={REPORT_LIMITS.MAX_LENGTH}
          aria-invalid={isError}
          aria-describedby={isError ? "reportTextError" : undefined}
        />
      </div>
    </>
  );
};
