export type InquiryData = {
  mailaddress: string;
  subject: string;
  content: string;
  inquiry_status: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const sendInquiry = async (newTask: InquiryData): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiry/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
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
