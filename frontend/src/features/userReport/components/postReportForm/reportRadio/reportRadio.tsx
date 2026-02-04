import { type ReportOption } from "@/features/userReport/types/report";
import styles from "./reportRadio.module.css";

type Props = {
  options: ReportOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

export const ReportRadio = ({ options, selectedValue, onChange }: Props) => (
  <fieldset
    className={styles.reportFieldSet}
    role="radiogroup"
    aria-labelledby="report-radio-legend"
  >
    <legend id="report-radio-legend" className={styles.title}>
      通報を行う項目を選択してください
    </legend>
    <div className={styles.reportRadioContainer}>
      {options.map((option) => (
        <div key={option.value} className={styles.reportRadio}>
          <input
            name="reportType"
            id={option.id}
            type="radio"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className={styles.radioButton}
          />
          <label htmlFor={option.id}>
            <span>{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  </fieldset>
);
