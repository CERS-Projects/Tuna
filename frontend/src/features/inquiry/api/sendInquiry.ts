import { type InquirySendData } from "@/features/inquiry/type/inquiry";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendInquiry = async (
  inquiryData: InquirySendData
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/support/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inquiryData),
    });

    if (response.ok) {
      console.log("登録完了");
      return true;
    } else {
      console.log("登録失敗");
      return false;
    }
  } catch (error) {
    console.log("登録失敗", error);
    return false;
  }
};
