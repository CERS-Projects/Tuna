import { forwardRef } from "react";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button/button";
import deleteButton from "@/assets/×ボタン.png";
import styles from "@/features/post/styles/postModal.module.css";

interface PostModalProps {
  postText: string;
  images: { file: File; url: string }[];
  selectedGroupNames: string[];
  onPost: () => void;
  onClose: () => void;
}

export const PostModal = forwardRef<ModalHandle, PostModalProps>(
  ({ postText, images, selectedGroupNames, onPost, onClose }, ref) => {
    return (
      <>
        <Modal
          ref={ref}
          containerStyle={{ maxWidth: "800px", borderRadius: "20px" }}
          className={styles.modalContainer}
        >
          <div className={styles.postConfirm}>
            <div className={styles.postConfirmTitle}>投稿内容の確認</div>
            <div className={styles.postConfirmText}>
              {postText && (
                <div className={styles.modalPostText}>{postText}</div>
              )}
              {images.length > 0 && (
                <div className={styles.modalPostImages}>
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
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
            ) : (
              <div className={styles.rangePost}>
                <span>共有範囲は選択されていません</span>
              </div>
            )}
          </div>
          <div className={styles.inModalButton}>
            <button
              onClick={onClose}
              className={styles.backButton}
              type="button"
            >
              <img
                src={deleteButton}
                alt="閉じるボタン"
                className={styles.backIcon}
              />
            </button>

            <div className={styles.postButton}>
              <Button onClick={onPost}>投稿</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
);
