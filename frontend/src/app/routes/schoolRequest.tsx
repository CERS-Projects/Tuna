import styles from "@/features/school/styles/schoolRequest.module.css";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Header } from "@/components/ui/header/header";
import { Checkbox } from "@/components/ui/checkbox/checkbox";

type SchoolRequestForm = {
  学校の名前: string;
  学校コード: string;
  学校住所: string;
  学校メールアドレス: string;
  表示用管理者ID: string;
  管理者の名前: string;
  管理者メールアドレス: string;
  パスワード: string;
  利用規約: boolean;
};

export default function SchoolRequest() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolRequestForm>();

  const onSubmit = (data: SchoolRequestForm) => {
    console.log("申請しました", data);
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form}>
          <h1 className={styles.title}>学校情報</h1>
          <div className={styles.info}>
            <Input
              width="100%"
              label="学校名"
              type="text"
              placeholder="学校の名前"
              error={errors["学校の名前"]?.message ?? ""}
              {...register("学校の名前", {
                required: "学校の名前は必須です",
                maxLength: {
                  value: 256,
                  message: "学校の名前は256文字以内で入力してください",
                },
              })}
            />
            <Input
              width="100%"
              label="学校コード"
              type="text"
              placeholder="学校コード"
              error={errors["学校コード"]?.message ?? ""}
              {...register("学校コード", {
                required: "学校コードは必須です",
                maxLength: {
                  value: 12,
                  message: "学校コードは12文字以内で入力してください",
                },
              })}
            />
            <Input
              width="100%"
              label="学校住所"
              type="text"
              placeholder="学校住所"
              error={errors["学校住所"]?.message ?? ""}
              {...register("学校住所", {
                required: "学校住所は必須です",
                maxLength: {
                  value: 161,
                  message: "学校住所は161文字以内で入力してください",
                },
              })}
            />
            <Input
              width="100%"
              label="学校メールアドレス"
              type="text"
              placeholder="学校メールアドレス"
              error={errors["学校メールアドレス"]?.message ?? ""}
              {...register("学校メールアドレス", {
                required: "学校メールアドレスは必須です",
                maxLength: {
                  value: 254,
                  message: "学校メールアドレスは254文字以内で入力してください",
                },
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message:
                    "有効なメールアドレスを入力してください（例: school@example.com）",
                },
              })}
            />
          </div>
          <h1 className={styles.title}>管理者情報</h1>
          <div className={styles.info}>
            <Input
              width="100%"
              label="表示用管理者ID"
              type="text"
              placeholder="表示用管理者ID"
              error={errors["表示用管理者ID"]?.message ?? ""}
              {...register("表示用管理者ID", {
                required: "表示用管理者IDは必須です",
                maxLength: {
                  value: 20,
                  message: "表示用管理者IDは20文字以内で入力してください",
                },
              })}
            />
            <Input
              width="100%"
              label="管理者名"
              type="text"
              placeholder="管理者の名前"
              error={errors["管理者の名前"]?.message ?? ""}
              {...register("管理者の名前", {
                required: "管理者の名前は必須です",
                maxLength: {
                  value: 50,
                  message: "管理者の名前は50文字以内で入力してください",
                },
              })}
            />
            <Input
              width="100%"
              label="管理者メールアドレス"
              type="text"
              placeholder="管理者メールアドレス"
              error={errors["管理者メールアドレス"]?.message ?? ""}
              {...register("管理者メールアドレス", {
                required: "管理者メールアドレスは必須です",
                maxLength: {
                  value: 254,
                  message:
                    "管理者メールアドレスは254文字以内で入力してください",
                },
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message:
                    "有効なメールアドレスを入力してください（例: user@example.com）",
                },
              })}
            />
            <Input
              width="100%"
              label="パスワード"
              type="password"
              autoComplete="new-password"
              placeholder="パスワード"
              error={errors["パスワード"]?.message ?? ""}
              {...register("パスワード", {
                required: "パスワードは必須です",
                maxLength: {
                  value: 32,
                  message: "パスワードは32文字以内で入力してください",
                },
              })}
            />
            <small className={styles.attention}>
              ⚠登録された連絡先に連絡させていただく場合がございます
            </small>
          </div>
          <Checkbox
            linkText="利用規約"
            linkUrl="https://example.com"
            labelTextAfterLink={<>に同意する</>}
            error={errors["利用規約"]?.message}
            {...register("利用規約", {
              required: "利用規約に同意してください",
            })}
          />
          <Button type="submit">申請</Button>
        </div>
      </form>
    </div>
  );
}
