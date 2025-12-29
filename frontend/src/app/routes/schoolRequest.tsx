import styles from "@/features/school/styles/schoolRequest.module.css";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Header } from "@/components/ui/header/header";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { TermsOfService } from "@/features/termsOfService/components/termsOfContentModal/termsOfService";
import type { ModalHandle } from "@/components/ui/modal/modal";
import type { SchoolRequestType } from "@/features/school/types/schoolRequest";
import { useSchoolRequest } from "@/features/school/hooks/useSchoolRequest";
import { ConfirmModal } from "@/features/school/components/confirmModal/confirmModal";
import { paths } from "@/config/paths";

type SchoolRequestForm = SchoolRequestType & {
  termsAgreed: boolean;
};

export default function SchoolRequest() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedData = location.state?.formData as SchoolRequestForm | undefined;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SchoolRequestForm>({
    defaultValues: savedData || {
      schoolDto: {},
      createTeacherDto: {},
    },
  });

  const { mutate, isPending, error, reset } = useSchoolRequest();

  const termsModalRef = useRef<ModalHandle>(null);
  const confirmModalRef = useRef<ModalHandle>(null);

  const handleOpenTermsModal = () => {
    if (termsModalRef.current) {
      termsModalRef.current.show();
    }
  };

  const handleOpenConfirmModal = () => {
    if (confirmModalRef.current) {
      confirmModalRef.current.show();
    }
  };

  const handleCloseConfirmModal = () => {
    if (confirmModalRef.current) {
      confirmModalRef.current.close();
      reset();
    }
  };

  const onSubmit = (data: SchoolRequestForm) => {
    const { termsAgreed, ...requestData } = data;

    mutate(requestData, {
      onSuccess: () => {
        console.log("申請しました", requestData);
        navigate(paths.school.confirm.path, {
          state: { success: true, formData: data },
        });
      },
      onError(error) {
        console.error("申請エラー: ", error);
      },
    });
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit(handleOpenConfirmModal)}>
        <div className={styles.form}>
          <h1 className={styles.title}>学校情報</h1>
          <div className={styles.info}>
            <Input
              width="100%"
              label="学校名"
              type="text"
              placeholder="学校の名前"
              error={errors.schoolDto?.schoolName?.message ?? ""}
              {...register("schoolDto.schoolName", {
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
              error={errors.schoolDto?.schoolCode?.message ?? ""}
              {...register("schoolDto.schoolCode", {
                required: "学校コードは必須です",
                maxLength: {
                  value: 13,
                  message: "学校コードは13文字で入力してください",
                },
                minLength: {
                  value: 13,
                  message: "学校コードは13文字で入力してください",
                },
              })}
            />
            <Input
              width="100%"
              label="学校住所"
              type="text"
              placeholder="学校住所"
              error={errors.schoolDto?.schoolAddress?.message ?? ""}
              {...register("schoolDto.schoolAddress", {
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
              error={errors.schoolDto?.schoolMailAddress?.message ?? ""}
              {...register("schoolDto.schoolMailAddress", {
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
              error={errors.createTeacherDto?.showUserId?.message ?? ""}
              {...register("createTeacherDto.showUserId", {
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
              error={errors.createTeacherDto?.name?.message ?? ""}
              {...register("createTeacherDto.name", {
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
              error={errors.createTeacherDto?.mailAddress?.message ?? ""}
              {...register("createTeacherDto.mailAddress", {
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
              error={errors.createTeacherDto?.password?.message ?? ""}
              {...register("createTeacherDto.password", {
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
            onLinkClick={handleOpenTermsModal}
            labelTextAfterLink={<>に同意する</>}
            error={errors.termsAgreed?.message}
            {...register("termsAgreed", {
              required: "利用規約に同意してください",
            })}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "送信中..." : "申請"}
          </Button>
        </div>
      </form>
      <TermsOfService ref={termsModalRef} />
      <ConfirmModal
        ref={confirmModalRef}
        request={getValues()}
        isPending={isPending}
        error={error}
        handleSubmit={() => onSubmit(getValues())}
        handleClose={handleCloseConfirmModal}
      />
    </div>
  );
}
