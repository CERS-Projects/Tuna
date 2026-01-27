import { useState, useEffect, useImperativeHandle, type Ref } from "react";
import styles from "./postCreate.module.css";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import imgBefore from "@/assets/img押下前.png";
import imgAfter from "@/assets/img押下.png";
import previewRemove from "@/assets/ゴミ箱ボタン.png";
import { Button } from "@/components/ui/button/button";
import { type ModalHandle } from "@/components/ui/modal/modal";
import deleteButton from "@/assets/×ボタン.png";
import defaultIcon from "@/assets/default-user.png";
import { usePostCreate } from "./hooks/usePostCreate";
import { createPortal } from "react-dom";
import { memo } from "react";

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
    <div className={styles.checkboxPlace}>
      <Checkbox
        labelTextAfterLink={title}
        fontSize="1.3rem"
        checked={checked}
        onChange={() => onChange(id)}
      />
    </div>
  ),
);

export const PostCreateModal = ({ ref }: { ref: Ref<ModalHandle> }) => {
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

  useImperativeHandle(ref, () => ({
    show: () => {
      actions.setStep("input");
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  }));

  const handleOpenConfirm = () => {
    const finalContent = state.postText.trim();
    if (!finalContent && state.images.length === 0) {
      actions.setSubmitError("投稿内容がありません");
      return;
    }
    actions.setPostText(finalContent);
    actions.setSubmitError(null);
    actions.setStep("confirm");
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={() => {
        if (state.step === "input") {
          setIsOpen(false);
        }
      }}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.postCreate}>
          <div className={styles.postCreateTitle}>
            {state.step === "input" ? "投稿作成" : "投稿内容の確認"}
            {state.step === "input" && (
              <button
                className={styles.button}
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={deleteButton}
                  alt="閉じる"
                  className={styles.backIcon}
                />
              </button>
            )}
          </div>
          <hr className={styles.hr} />
          <div className={styles.user}>
            <img
              src={currentUser.user_icon || defaultIcon}
              alt="User Icon"
              className={styles.userIcon}
            />
            <div className={styles.userInfoText}>
              <div className={styles.user_name}>{currentUser.user_name}</div>
              <div className={styles.user_id}>@{currentUser.user_id}</div>
            </div>
          </div>

          <div
            className={
              state.step === "input" ? styles.postBox : styles.confirmPostBox
            }
          >
            {state.step === "input" ? (
              <textarea
                className={styles.textarea}
                placeholder="投稿内容を入力してください"
                value={state.postText}
                onChange={(e) => actions.handleTextChange(e.target.value)}
              />
            ) : (
              <div className={styles.confirmTextDisplay}>{state.postText}</div>
            )}

            <hr
              className={state.step === "input" ? styles.hr : styles.hrNone}
            />
            {state.step === "input" && (
              <div className={styles.postLength}>
                <span
                  className={
                    state.postText.length >= state.MAX_LENGTH
                      ? styles.charLimit
                      : ""
                  }
                >
                  {state.postText.length}
                </span>
                /{state.MAX_LENGTH}
              </div>
            )}

            <div className={state.step === "input" ? styles.imageSection : ""}>
              {state.step === "input" && (
                <button
                  type="button"
                  onClick={() => refs.fileInputRef.current?.click()}
                  className={styles.pictureAndButton}
                >
                  <img
                    src={imgBefore}
                    alt="画像選択"
                    className={styles.pictureIcon}
                  />
                  <img
                    src={imgAfter}
                    alt="画像選択(押下時)"
                    className={styles.pictureIconPush}
                  />
                </button>
              )}
              <div
                className={state.step === "input" ? styles.previewImage : ""}
              >
                {state.images.map((img) => (
                  <div
                    key={img.url}
                    className={state.step === "input" ? styles.previewArea : ""}
                  >
                    <img
                      src={img.url}
                      className={
                        state.step === "input"
                          ? styles.preview
                          : styles.confirmPreview
                      }
                      alt="投稿画像プレビュー"
                    />
                    {state.step === "input" && (
                      <button
                        onClick={() => actions.removeImage(img.url)}
                        className={styles.removeButton}
                        type="button"
                      >
                        <img
                          src={previewRemove}
                          className={styles.removeIcon}
                          alt="画像削除"
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <input
              type="file"
              ref={refs.fileInputRef}
              onChange={actions.onImageChange}
              multiple
              accept="image/*"
              className={styles.fileButton}
            />
            {state.imageError && (
              <span className={styles.errorTextInline}>{state.imageError}</span>
            )}
            {state.submitError && (
              <span className={styles.errorTextBlock}>{state.submitError}</span>
            )}
          </div>

          <div className={state.step === "input" ? styles.postRange : ""}>
            <div className={styles.postRangeGuide}>
              {state.step === "input" ? "投稿の共有範囲" : "選択された共有範囲"}
            </div>
            <div
              className={
                state.step === "input"
                  ? styles.checkboxGroup
                  : styles.confirmPostRange
              }
            >
              {state.step === "input" ? (
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
                      ・{item.group_name}
                    </span>
                  ))
              ) : (
                <span className={styles.noSelectionMessage}>
                  共有範囲は設定されていません
                </span>
              )}
            </div>
          </div>

          <div className={styles.next}>
            {state.step === "input" ? (
              <div className={styles.nextButton}>
                <Button
                  type="button"
                  width="100px"
                  height="40px"
                  fontSize="1.3rem"
                  onClick={handleOpenConfirm}
                >
                  次へ
                </Button>
              </div>
            ) : (
              <div className={styles.confirmButtons}>
                <div className={styles.confirmBack}>
                  <Button
                    type="button"
                    width="100px"
                    height="40px"
                    fontSize="1.3rem"
                    onClick={() => actions.setStep("input")}
                  >
                    戻る
                  </Button>
                </div>
                <div className={styles.confirmPost}>
                  <Button
                    type="button"
                    width="100px"
                    height="40px"
                    fontSize="1.3rem"
                    onClick={() => actions.handlePost(currentUser.user_id)}
                    disabled={state.isSubmitting}
                  >
                    {state.isSubmitting ? "送信中..." : "投稿"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
