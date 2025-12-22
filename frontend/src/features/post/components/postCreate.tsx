import styles from "@/features/post/styles/postCreate.module.css";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import imgBefore from "@/assets/img押下前.png";
import imgAfter from "@/assets/img押下.png";
import deleteButton from "@/assets/×ボタン.png";
import previewRemove from "@/assets/ゴミ箱ボタン.png";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Header } from "@/components/ui/header/header";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";

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

export const PostCreate: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const onPreviewInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const selectedFiles = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        );
        if (imageFiles.length + selectedFiles.length > MAX_IMAGES) {
          alert(`画像は${MAX_IMAGES}枚以下にしてください`);
          return;
        }
        const newUrls = selectedFiles.map((file) => URL.createObjectURL(file));
        setImageFiles((prev) => [...prev, ...selectedFiles]);
        setPreviewImage((prev) => [...prev, ...newUrls]);
        e.target.value = "";
      }
    },
    [imageFiles]
  );
  const removeImage = useCallback(
    (indexToRemove: number) => {
      const urlToRemove = previewImage[indexToRemove];
      if (urlToRemove) {
        URL.revokeObjectURL(urlToRemove);
      }
      setImageFiles((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );

      setPreviewImage((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    },
    [previewImage]
  );

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
  function Range({ id, title }: { id: number; title: string }) {
    return (
      <div className={styles.checkboxPlace}>
        <Checkbox
          labelTextAfterLink={title}
          fontSize="1.3rem"
          checked={selectedGroupIds.includes(id)}
          onChange={() => handleToggleGroup(id)}
        />
      </div>
    );
  }

  const [postText, setPostText] = useState("");
  const modalRef = useRef<ModalHandle>(null);
  const handleOpenConfirm = () => {
    if (!postText && previewImage.length === 0) {
      alert("投稿内容がありません");
      return;
    }
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
            onChange={(e) => setPostText(e.target.value)}
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
          <div className={styles.aaa}>
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
            {previewImage.length > 0 && (
              <div className={styles.previewImage}>
                {previewImage.map((url, index) => (
                  <div key={index} className={styles.previewArea}>
                    <img
                      src={url}
                      alt={`選択された画像 ${index + 1}`}
                      className={styles.preview}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className={styles.removeButton}
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
        </div>
        <div className={styles.postRange}>
          <div className={styles.postRangeGuide}>投稿の共有範囲</div>
          <div className={styles.checkboxGroup}>
            {items.map((item) => (
              <Range
                key={item.group_id}
                id={item.group_id}
                title={item.group_name}
              />
            ))}
          </div>
        </div>

        <div className={styles.nextButton}>
          <Button
            type="button"
            width="120px"
            height="40px"
            fontSize="1.3rem"
            onClick={handleOpenConfirm}
            className={styles.next}
          >
            次へ
          </Button>
        </div>
      </div>
      <Modal
        ref={modalRef}
        containerStyle={{ maxWidth: "800px", borderRadius: "20px" }}
        className={styles.modalContainer}
      >
        <div className={styles.postConfirm}>
          <div className={styles.postConfirmTitle}>投稿内容の確認</div>
          <div className={styles.postConfirmText}>
            {postText && <div className={styles.modalPostText}>{postText}</div>}
            {previewImage.length > 0 && (
              <div className={styles.modalPostImages}>
                {previewImage.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="投稿画像プレビュー"
                    className={styles.inModalImage}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.postConfirmTitleRange}>投稿の共有範囲</div>
          {selectedGroupNames.length > 0 ? (
            <div className={styles.rangePost}>
              {selectedGroupNames.map((name) => (
                <span key={name}>・{name}</span>
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.inModalButton}>
          <button
            onClick={() => modalRef.current?.close()}
            className={styles.backButton}
          >
            <img
              src={deleteButton}
              alt="閉じるボタン"
              className={styles.backIcon}
            />
          </button>

          <div className={styles.postButton}>
            <Button onClick={handlePost}>投稿</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
