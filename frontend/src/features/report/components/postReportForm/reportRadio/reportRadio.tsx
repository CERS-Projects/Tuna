import { type ReportOption } from "@/features/report/types/report";
import styles from "./reportRadio.module.css";
import { type UseFormRegisterReturn } from "react-hook-form";

type Props = {
  options: ReportOption[];
  register: UseFormRegisterReturn;
};

export const ReportRadio = ({ options, register }: Props) => (
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
            id={option.id}
            type="radio"
            value={String(option.value)}
            {...register}
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
