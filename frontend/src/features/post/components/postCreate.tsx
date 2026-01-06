import styles from "@/features/post/styles/postCreate.module.css";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import imgBefore from "@/assets/img押下前.png";
import imgAfter from "@/assets/img押下.png";
import previewRemove from "@/assets/ゴミ箱ボタン.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Header } from "@/components/ui/header/header";
import { PostModal } from "./postModal";
import { type ModalHandle } from "@/components/ui/modal/modal";

const handlePost = () => {
  console.log("投稿の処理");
};

const MAX_IMAGES = 4;
const MAX_LENGTH = 500;

const items = [
  { group_id: 1, group_name: "水戸電子専門学校" },
  { group_id: 2, group_name: "水戸電子システム" },
  { group_id: 3, group_name: "情報処理" },
  { group_id: 4, group_name: "水戸" },
  { group_id: 5, group_name: "八文字学園" },
];

const Range = ({
  id,
  title,
  checked,
  onChange,
}: {
  id: number;
  title: string;
  checked: boolean;
  onChange: (id: number) => void;
}) => {
  return (
    <div className={styles.checkboxPlace}>
      <Checkbox
        labelTextAfterLink={title}
        fontSize="1.3rem"
        checked={checked}
        onChange={() => onChange(id)}
      />
    </div>
  );
};

export const PostCreate: React.FC = () => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const previewUrlsRef = useRef<string[]>([]);
  useEffect(() => {
    previewUrlsRef.current = images.map((img) => img.url);
  }, [images]);
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const onPreviewInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const selectedFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setImages((prev) => {
        if (prev.length + selectedFiles.length > MAX_IMAGES) {
          newUrls.forEach((url) => URL.revokeObjectURL(url));
          setImageError(`画像は最大${MAX_IMAGES}枚です`);
          setTimeout(() => setImageError(null), 3500);
          return prev;
        }

        setImageError(null);
        setSubmitError(null);

        const newEntries = selectedFiles.map((file, index) => ({
          file,
          url: newUrls[index],
        }));

        return [...prev, ...newEntries];
      });

      e.target.value = "";
    },
    []
  );

  const removeImage = useCallback((indexToRemove: number) => {
    setImages((prev) => {
      const target = prev[indexToRemove];
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, index) => index !== indexToRemove);
    });
  }, []);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const handleToggleGroup = (id: number) => {
    setSelectedGroupIds((prev) =>
      prev.includes(id)
        ? prev.filter((groupId) => groupId !== id)
        : [...prev, id]
    );
  };
  const selectedGroupNames = items
    .filter((item) => selectedGroupIds.includes(item.group_id))
    .map((item) => item.group_name);

  const [postText, setPostText] = useState("");
  const modalRef = useRef<ModalHandle>(null);
  const handleOpenConfirm = () => {
    if (!postText && images.length === 0) {
      setSubmitError("投稿内容がありません");
      return;
    }
    setSubmitError(null);
    modalRef.current?.show();
  };
  return (
    <>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.postCreate}>
        <div className={styles.user}>
          <div>画像</div>
          <h3>ユーザ名</h3>
          <p>@userid</p>
        </div>
        <div className={styles.postBox}>
          <textarea
            className={styles.textarea}
            placeholder="投稿内容を入力してください"
            value={postText}
            maxLength={MAX_LENGTH}
            onChange={(e) => {
              setPostText(e.target.value);
              if (e.target.value.trim().length > 0) {
                setSubmitError(null);
              }
            }}
          ></textarea>
          <hr className={styles.hr} />
          <div className={styles.postLength}>
            <span
              className={postText.length >= MAX_LENGTH ? styles.charLimit : ""}
            >
              {postText.length}
            </span>
            /{MAX_LENGTH}
          </div>
          <div className={styles.imageSection}>
            <button
              type="button"
              onClick={handleButtonClick}
              className={styles.pictureAndButton}
            >
              <img
                src={imgBefore}
                alt="押す前の画像のアイコン"
                className={styles.pictureIcon}
              />
              <img
                src={imgAfter}
                alt="押した後の画像のアイコン"
                className={styles.pictureIconPush}
              />
            </button>
            {images.length > 0 && (
              <div className={styles.previewImage}>
                {images.map((img, index) => (
                  <div key={index} className={styles.previewArea}>
                    <img
                      src={img.url}
                      alt={`選択された画像 ${index + 1}`}
                      className={styles.preview}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className={styles.removeButton}
                      type="button"
                    >
                      <img
                        src={previewRemove}
                        alt="画像を削除するボタン"
                        className={styles.removeIcon}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onPreviewInputChange}
            multiple
            accept="image/*"
            className={styles.fileButton}
          />
          {imageError && (
            <span className={styles.errorTextInline}>{imageError}</span>
          )}
          {submitError && (
            <span className={styles.errorTextBlock}>{submitError}</span>
          )}
        </div>
        <div className={styles.postRange}>
          <div className={styles.postRangeGuide}>投稿の共有範囲</div>
          <div className={styles.checkboxGroup}>
            {items.map((item) => (
              <Range
                key={item.group_id}
                id={item.group_id}
                title={item.group_name}
                checked={selectedGroupIds.includes(item.group_id)}
                onChange={handleToggleGroup}
              />
            ))}
          </div>
        </div>
        <div className={styles.nextButton}>
          <Button
            type="button"
            width="100px"
            height="40px"
            fontSize="1.3rem"
            onClick={handleOpenConfirm}
            className={styles.next}
          >
            次へ
          </Button>
        </div>
      </div>
      <PostModal
        ref={modalRef}
        postText={postText}
        images={images}
        selectedGroupNames={selectedGroupNames}
        onPost={handlePost}
        onClose={() => modalRef.current?.close()}
      />
    </>
  );
};
