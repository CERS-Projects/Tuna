import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import styles from "@/features/profile/styles/editProfile.module.css";
import { useEditProfile } from "@/features/profile/hooks/useEditProfile";
import { type EditProfileForm } from "@/features/profile/types/profileTypes";
import { Spinner } from "@/components/ui/spinner/spinner";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

const maxFileSize = 1024 * 1024 * 5;
const fileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
];

const EditProfile = () => {
  const { user, isLoading, mutate: editProfileMutate } = useEditProfile();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<EditProfileForm>({
    values: {
      nickname: user?.userName ?? "",
      showUserId: user?.showUserId ?? "",
      introduction: user?.introduction ?? "",
    },
  });

  const [previewUrl, setPreviewUrl] = useState<string>(user?.iconUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (file) {
      if (!fileTypes.includes(file.type)) {
        setImageError("対応していないファイル形式です");
        return;
      }
      if (file.size > maxFileSize) {
        setImageError("画像ファイルのサイズは5MB以下にしてください");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EditProfileForm) => {
    const formData = new FormData();
    formData.append("nickname", data.nickname);
    formData.append("showUserId", data.showUserId);
    formData.append("introduction", data.introduction);

    if (imageFile) {
      formData.append("iconFile", imageFile);
    }

    editProfileMutate(formData, {
      onSuccess: () => {
        alert("プロフィールを更新しました！");
        navigate(paths.app.profile.posts.getHref(data.showUserId));
      },
      onError: () => {
        alert(
          "プロフィールの更新に失敗しました。通信環境や入力内容をご確認ください。",
        );
      },
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.formContainer}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
      >
        <div className={styles.header}>
          <h2>プロフィール編集</h2>
        </div>

        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            <img src={previewUrl} alt="プロフィール画像" />
          </div>
          <div className={styles.avatarControls}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageEdit}
              className={styles.hiddenInput}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.imageSelectButton}
            >
              画像を選択
            </button>
            {imageFile && (
              <p className={styles.fileName}>変更中: {imageFile.name}</p>
            )}
            {imageError && <p className={styles.imageError}>{imageError}</p>}
          </div>
        </div>

        <div className={styles.fieldsContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="nickname">名前</label>
            <input
              id="nickname"
              maxLength={50}
              className={styles.textInput}
              {...register("nickname")}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="showUserId">ユーザーID</label>
            <input
              id="showUserId"
              maxLength={20}
              className={styles.textInput}
              {...register("showUserId")}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="introduction">自己紹介</label>
            <textarea
              id="introduction"
              maxLength={200}
              className={styles.textAreaInput}
              {...register("introduction")}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          保存する
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
