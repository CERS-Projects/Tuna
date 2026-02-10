import { type ReportOption } from "./types/report";

export const REPORT_LIMITS = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 1000,
} as const;

export const REPORT_MESSAGES = {
  REQUIRED: "※内容を入力してください",
  TOO_SHORT: `※${REPORT_LIMITS.MIN_LENGTH}文字以上入力してください`,
  PLACEHOLDER: "内容を記載してください",
} as const;

export const REPORT_OPTIONS: ReportOption[] = [
  { id: "violence", label: "暴力的な発言", value: 1 },
  { id: "spam", label: "スパム・悪質な宣伝", value: 2 },
  { id: "privacy", label: "個人情報の拡散", value: 3 },
  { id: "impersonation", label: "なりすまし", value: 4 },
  {
    id: "misinformation",
    label: "悪質な誤情報の拡散",
    value: 5,
  },
];

export const DEFAULT_REPORT_VALUE = REPORT_OPTIONS[0].value;
