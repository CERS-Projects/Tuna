import { useState, useEffect, useImperativeHandle, type Ref } from "react";
import styles from "./postCreate.module.css";
import { ImFilePicture } from "react-icons/im";
import { Button } from "@/components/ui/button/button";
import { type ModalHandle } from "@/components/ui/modal/modal";
import { IoIosClose } from "react-icons/io";
import { usePostCreate } from "../../hooks/usePostCreate";
import { createPortal } from "react-dom";
import { RangeSection } from "../range/range";
import { type TreeType } from "@/features/management/types/group";
import { ImagePreview } from "../imagePreview/imagePreview";
import { UserInfo } from "../userInfo/userInfo";
import { PostInput } from "../postInput/postInput";
import { ResponseTo } from "../replyTo/responseTo";
import { type PostData } from "../../types/post";
import { type User } from "@/types/user";

export const PostCreateModal = ({
  ref,
  user,
  groups,
  onClose,
  response,
}: {
  ref: Ref<ModalHandle>;
  user: User | undefined;
  groups: TreeType[];
  onClose?: () => void;
  response?: PostData;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state, actions, refs, form } = usePostCreate(setIsOpen);

  useEffect(() => {
    if (response) {
      form.setValue("responseTo", response.postId);
      form.setValue("shareRange", response.shareRange);
    }
  }, [response, form]);

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
    document.body.style.overflow = "auto";
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
    if (!finalContent) {
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
          {response && <ResponseTo responseTo={response} />}

          {user && (
            <UserInfo
              userIcon={user.iconUrl ?? ""}
              userName={user.userName ?? <span>ニックネームがありません</span>}
              userId={user.showUserId}
            />
          )}

          <PostInput
            isInputStep={isInputStep}
            postText={state.postText}
            onTextChange={actions.handleTextChange}
          />

          {(state.images.length > 0 || !isInputStep) && (
            <ImagePreview
              images={state.images}
              isInputStep={isInputStep}
              onRemoveImage={actions.removeImage}
            />
          )}

          {!response && (
            <RangeSection
              isInputStep={isInputStep}
              items={groups}
              selectedGroupIds={state.selectedGroupIds}
              onToggleGroup={actions.toggleGroup}
            />
          )}

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
                  disabled={state.postText.trim().length === 0}
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
                  onClick={() => actions.handlePost()}
                  disabled={
                    state.isSubmitting || state.postText.trim().length === 0
                  }
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
