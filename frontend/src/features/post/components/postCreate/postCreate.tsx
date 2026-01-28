import {
  useState,
  useEffect,
  useImperativeHandle,
  type Ref,
  memo,
} from "react";
import styles from "./postCreate.module.css";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { ImFilePicture } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { Button } from "@/components/ui/button/button";
import { type ModalHandle } from "@/components/ui/modal/modal";
import { IoIosClose } from "react-icons/io";
import { usePostCreate } from "./hooks/usePostCreate";
import { createPortal } from "react-dom";

const currentUser = {
  user_id: "mito_denden",
  user_name: "水戸 太郎",
  user_icon:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiADU1Rn0obHEkfXEgCIKVXO8IEK9Q9MJUL8lb2QkWyHpaQ8AlJmxVF2vP00RYyyzrxaGXKOb3P8BwtC5mIFhyF31_kzKx2QVS2Hee7Skl_3DlAZ2P6sRAsSb0Ts0Alcxx1aks9f-JQkMHh/s800/cat_fish_run.png",
};
const items = [
  { group_id: 1, group_name: "水戸電子専門学校" },
  { group_id: 2, group_name: "水戸電子システム" },
  { group_id: 3, group_name: "情報処理" },
  { group_id: 4, group_name: "水戸" },
  { group_id: 5, group_name: "八文字学園" },
];

const Range = memo(
  ({
    id,
    title,
    checked,
    onChange,
  }: {
    id: number;
    title: string;
    checked: boolean;
    onChange: (id: number) => void;
  }) => (
    <div className={styles.rangeItem}>
      <Checkbox
        labelTextAfterLink={title}
        className={styles.checkboxCustom}
        checked={checked}
        onChange={() => onChange(id)}
      />
    </div>
  ),
);

export const PostCreateModal = ({
  ref,
  onClose,
}: {
  ref: Ref<ModalHandle>;
  onClose?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state, actions, refs } = usePostCreate(setIsOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      actions.setStep("input");
      setIsOpen(true);
    },
    close: handleClose,
  }));

  const handleOpenConfirm = () => {
    const finalContent = state.postText.trim();
    if (!finalContent && state.images.length === 0) {
      actions.setSubmitError("投稿内容を入力してください");
      return;
    }
    actions.setPostText(finalContent);
    actions.setSubmitError(null);
    actions.setStep("confirm");
  };

  if (!isOpen) return null;

  const isInputStep = state.step === "input";

  return createPortal(
    <div
      className={styles.overlay}
      onClick={() => {
        if (isInputStep) handleClose();
      }}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            {isInputStep ? "投稿を作成" : "投稿内容の確認"}
          </div>
          {isInputStep && (
            <button className={styles.closeButton} onClick={handleClose}>
              <IoIosClose size={28} />
            </button>
          )}
        </div>

        <div className={styles.bodyScroll}>
          <div className={styles.userInfo}>
            <img
              src={currentUser.user_icon}
              alt="User Icon"
              className={styles.userIcon}
            />
            <div>
              <div className={styles.userName}>{currentUser.user_name}</div>
              <div className={styles.userId}>@{currentUser.user_id}</div>
            </div>
          </div>

          <div className={styles.inputArea}>
            {isInputStep ? (
              <textarea
                className={styles.textarea}
                placeholder="いまどうしてる？"
                value={state.postText}
                onChange={(e) => actions.handleTextChange(e.target.value)}
              />
            ) : (
              <div className={styles.confirmTextDisplay}>{state.postText}</div>
            )}
          </div>

          {(state.images.length > 0 || !isInputStep) && (
            <div className={styles.previewContainer}>
              {state.images.map((img) => (
                <div key={img.url} className={styles.previewItem}>
                  <img
                    src={img.url}
                    className={styles.previewImage}
                    alt="投稿画像"
                  />
                  {isInputStep && (
                    <button
                      onClick={() => actions.removeImage(img.url)}
                      className={styles.removeButton}
                      type="button"
                    >
                      <MdDeleteForever size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className={styles.rangeSection}>
            <div className={styles.rangeLabel}>
              {isInputStep ? "公開範囲を選択" : "公開範囲"}
            </div>
            <div className={styles.rangeList}>
              {isInputStep ? (
                items.map((item) => (
                  <Range
                    key={item.group_id}
                    id={item.group_id}
                    title={item.group_name}
                    checked={state.selectedGroupIds.includes(item.group_id)}
                    onChange={actions.toggleGroup}
                  />
                ))
              ) : state.selectedGroupIds.length > 0 ? (
                items
                  .filter((item) =>
                    state.selectedGroupIds.includes(item.group_id),
                  )
                  .map((item) => (
                    <span key={item.group_id} className={styles.confirmTag}>
                      {item.group_name}
                    </span>
                  ))
              ) : (
                <span className={styles.noSelectionMessage}>
                  指定なし（全体公開）
                </span>
              )}
            </div>
          </div>

          {(state.imageError || state.submitError) && (
            <div className={styles.errorArea}>
              {state.imageError && <span>{state.imageError}</span>}
              {state.submitError && <span>{state.submitError}</span>}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerTools}>
            {isInputStep && (
              <>
                <button
                  type="button"
                  onClick={() => refs.fileInputRef.current?.click()}
                  className={styles.iconButton}
                  title="画像を追加"
                >
                  <ImFilePicture size={22} />
                </button>
                <input
                  type="file"
                  ref={refs.fileInputRef}
                  onChange={actions.onImageChange}
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>

          <div className={styles.footerActions}>
            {isInputStep ? (
              <>
                <div className={styles.charCount}>
                  <span
                    className={
                      state.postText.length >= state.MAX_LENGTH
                        ? styles.charLimit
                        : ""
                    }
                  >
                    {state.postText.length}
                  </span>
                  <span className={styles.charMax}> / {state.MAX_LENGTH}</span>
                </div>
                <Button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleOpenConfirm}
                  disabled={!state.postText && state.images.length === 0}
                >
                  次へ
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => actions.setStep("input")}
                >
                  戻る
                </Button>
                <Button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => actions.handlePost(currentUser.user_id)}
                  disabled={state.isSubmitting}
                >
                  {state.isSubmitting ? "送信中..." : "投稿する"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
