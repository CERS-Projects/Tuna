import { type EditProfileData } from "@/features/profile/types/profileTypes";
import { useState, useRef } from "react";
import styles from "@/features/profile/styles/editProfile.module.css";

// ダミーデータ（本来はAPIから取得したもの）
const dummyEditProfileData: EditProfileData = {
  userId: 1,
  showUserId: "user-8823-v9p",
  userName: "サカバンバスピス",
  iconUrl:
    "https://www.sankei.com/resizer/v2/3P43OGHLUFBDNO6BED37J2RTPM.jpg?auth=54f463fd643ce84582d10a89b4392500c8ac357e9ac79bb92d50980d2225080a&quality=40&focal=593%2C440&width=1200",
  introduction:
    "深海魚です。趣味は某動画本社を爆破すること。本職は水族館勤務。タツノオトシゴが運営しています。",
};

type EditState = Omit<EditProfileData, "userId">;

const EditProfile = () => {
  const [editData, setEditData] = useState<EditState>({
    showUserId: dummyEditProfileData.showUserId,
    userName: dummyEditProfileData.userName,
    iconUrl: dummyEditProfileData.iconUrl,
    introduction: dummyEditProfileData.introduction,
  });

  const [previewUrl, setPreviewUrl] = useState<string>(
    dummyEditProfileData.iconUrl ?? "",
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
    console.log("送信データ(FormData):", Object.fromEntries(formData));
    console.log("現在のState:", editData);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.header}>
          <h2>プロフィール編集</h2>
        </div>

        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            <img src={previewUrl} alt="Preview" />
          </div>
          <div className="styles.avatarControls">
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
          </div>
        </div>

        <div className={styles.fieldsContainer}>
          <div className={styles.inputGroup}>
            <label>名前</label>
            <input
              name="userName"
              value={editData.userName}
              maxLength={50}
              onChange={handleChange}
              className={styles.textInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>ユーザーID</label>
            <input
              name="showUserId"
              value={editData.showUserId}
              maxLength={20}
              onChange={handleChange}
              className={styles.textInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>自己紹介</label>
            <textarea
              name="introduction"
              value={editData.introduction}
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
