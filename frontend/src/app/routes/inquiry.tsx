import { useForm } from "react-hook-form";
import { Header } from "@/components/ui/header/header";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import styles from "@/features/inquiry/inquiry.module.css";

const Inquiry = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

  return (
    <>
      <Header />
      <main>
        <form
          className={styles.inquiryRequestContainer}
          onSubmit={handleSubmit(onSubmit)}
        >
          <p>入力された内容は管理者に送信されます</p>
          <Input
            type="email"
            label="メールアドレス"
            placeholder="メールアドレス"
            {...register("メールアドレス", {
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
          />
          <Input
            type="text"
            label="件名"
            placeholder="件名"
            {...register("件名", { required: true, max: 20, min: 1 })}
          />
          <label htmlFor="問い合わせ内容">説明</label>
          <textarea
            id="問い合わせ内容"
            {...register("説明", { required: true, max: 1000, min: 1 })}
          />

          <Button type="submit">送信</Button>
        </form>
      </main>
    </>
  );
};

export default Inquiry;
