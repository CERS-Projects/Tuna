import {
  REPORT_LIMITS,
  REPORT_MESSAGES,
} from "@/features/userReport/reportConstants";
import styles from "./reportText.module.css";

type Props = {
  textValue: string;
  onChange: (value: string) => void;
  isError: boolean;
};

export const ReportText = ({ textValue, onChange, isError }: Props) => {
  return (
    <>
      <div className={styles.title}>通報の内容を正確に記載してください</div>
      <div className={styles.reportTextContainer}>
        <textarea
          placeholder={REPORT_MESSAGES.PLACEHOLDER}
          id="reportText"
          className={styles.reportText}
          value={textValue}
          onChange={(e) => onChange(e.target.value)}
          maxLength={REPORT_LIMITS.MAX_LENGTH}
          required
          aria-invalid={isError}
          aria-describedby={isError ? "reportTextError" : undefined}
        />
      </div>
    </>
  );
};
