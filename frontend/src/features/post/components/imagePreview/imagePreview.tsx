import { MdDeleteForever } from "react-icons/md";
import { type ImageData } from "../../types/post";
import styles from "./imagePreview.module.css";

type ImagePreviewProps = {
  images: ImageData[];
  isInputStep: boolean;
  onRemoveImage: (url: string) => void;
};

export const ImagePreview = ({
  images,
  isInputStep,
  onRemoveImage,
}: ImagePreviewProps) => {
  if (images.length === 0 && isInputStep) return null;

  return (
    <div className={styles.previewContainer}>
      {images.map((img) => (
        <div key={img.url} className={styles.previewItem}>
          <img src={img.url} className={styles.previewImage} alt="投稿画像" />
          {isInputStep && (
            <button
              onClick={() => onRemoveImage(img.url)}
              className={styles.removeButton}
              type="button"
            >
              <MdDeleteForever size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
