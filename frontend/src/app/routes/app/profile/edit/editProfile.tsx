import { type EditProfileData } from "@/features/profile/types/profileTypes";
import { type ProfileData } from "../types/profileTypes"; // 遷移元と同じ型をインポート
import { useState, useRef } from "react";
import { useLocation } from "react-router"; // 遷移データ取得用
import styles from "@/features/profile/styles/editProfile.module.css";

// フォールバック用のダミーデータ
const dummyEditProfileData: EditProfileData = {
  userId: 1,
  showUserId: "user-default",
  userName: "ゲストユーザー",
  iconUrl: "https://via.placeholder.com/150",
  introduction: "自己紹介が設定されていません。",
};

type EditState = Omit<EditProfileData, "userId">;

const maxFileSize = 1024 * 1024 * 5;
const fileTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
];

const EditProfile = () => {
  const location = useLocation();
  const receivedData = location.state as ProfileData | null;

  const [editData, setEditData] = useState<EditState>({
    showUserId: receivedData?.showUserId ?? dummyEditProfileData.showUserId,
    userName: receivedData?.userName ?? dummyEditProfileData.userName,
    iconUrl: receivedData?.iconUrl ?? dummyEditProfileData.iconUrl,
    introduction:
      receivedData?.introduction ?? dummyEditProfileData.introduction,
  });

  const [previewUrl, setPreviewUrl] = useState<string>(editData.iconUrl ?? "");
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userName", editData.userName ?? "");
    formData.append("showUserId", editData.showUserId ?? "");
    formData.append("introduction", editData.introduction ?? "");

    if (imageFile) {
      formData.append("icon", imageFile);
    }
    console.log("送信データ:", Object.fromEntries(formData));
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
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
              style={{ display: "none" }} // 非表示
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
            <label htmlFor="userName">名前</label>
            <input
              id="userName"
              name="userName"
              value={editData.userName}
              maxLength={50}
              onChange={handleChange}
              className={styles.textInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="showUserId">ユーザーID</label>
            <input
              id="showUserId"
              name="showUserId"
              value={editData.showUserId}
              maxLength={20}
              onChange={handleChange}
              className={styles.textInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="introduction">自己紹介</label>
            <textarea
              id="introduction"
              name="introduction"
              value={editData.introduction ?? ""}
              maxLength={200}
              onChange={handleChange}
              className={styles.textAreaInput}
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
