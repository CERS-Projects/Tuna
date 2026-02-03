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
import { ReplyTo } from "../replyTo/replyTo";
import { type PostData } from "../../types/post";

const currentUser = {
  user_id: "mito_denden",
  user_name: "水戸 太郎",
  user_icon:
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiADU1Rn0obHEkfXEgCIKVXO8IEK9Q9MJUL8lb2QkWyHpaQ8AlJmxVF2vP00RYyyzrxaGXKOb3P8BwtC5mIFhyF31_kzKx2QVS2Hee7Skl_3DlAZ2P6sRAsSb0Ts0Alcxx1aks9f-JQkMHh/s800/cat_fish_run.png",
};

const items: TreeType[] = [
  {
    id: 1,
    name: "八文字学園",
    branch: [
      {
        id: 2,
        name: "水戸電子専門学校",
        branch: [
          { id: 3, name: "情報処理" },
          { id: 4, name: "水戸電子システム" },
        ],
      },
      { id: 5, name: "水戸" },
    ],
  },
];

export const PostCreateModal = ({
  ref,
  onClose,
  response,
}: {
  ref: Ref<ModalHandle>;
  onClose?: () => void;
  response?: PostData;
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
          {response && <ReplyTo replyTo={response} />}

          <UserInfo
            userIcon={currentUser.user_icon}
            userName={currentUser.user_name}
            userId={currentUser.user_id}
          />

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
              items={items}
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
