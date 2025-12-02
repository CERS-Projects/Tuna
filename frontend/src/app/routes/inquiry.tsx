import { useForm } from "react-hook-form";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import styles from "@/features/inquiry/styles/inquiry.module.css";

type InquiryForm = {
  mailaddress: string;
  subject: string;
  description: string;
};

const Inquiry = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryForm>();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <form
          className={styles.inquiryRequestContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>入力された内容は管理者に送信されます</p>
          <Input
            type="email"
            label="メールアドレス"
            placeholder="メールアドレス"
            width={"100%"}
            error={errors["mailaddress"]?.message ?? ""}
            {...register("mailaddress", {
              required: "メールアドレスは必須です。",
              pattern: /^\S+@\S+$/i,
            })}
          />
          <Input
            type="text"
            label="件名"
            placeholder="件名"
            width={"100%"}
            error={errors["subject"]?.message ?? ""}
            {...register("subject", {
              required: "件名は必須です。",
              maxLength: {
                value: 20,
                message: "件名は20文字以内で書いてください。",
              },
              minLength: {
                value: 2,
                message: "件名は2文字以上で書いてください。",
              },
            })}
          />
          <label htmlFor="問い合わせ内容">説明</label>
          <textarea
            id="問い合わせ内容"
            placeholder="問い合わせ内容"
            className={
              errors.description
                ? `${styles.textarea} ${styles.textareaError}`
                : styles.textarea
            }
            {...register("description", {
              required: "問い合わせ内容は必須です。",
              maxLength: {
                value: 1000,
                message: "問い合わせ内容は1000文字以内で書いてください。",
              },
              minLength: {
                value: 2,
                message: "問い合わせ内容は2文字以上で書いてください。",
              },
            })}
          />

          {errors.description?.message && (
            <span className={styles.textareaErrorLabel}>
              {errors.description.message}
            </span>
          )}

          <Button type="submit">送信</Button>
        </form>
      </main>
    </>
  );
};

export default Inquiry;
