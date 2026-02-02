import styles from "./postInput.module.css";

type PostInputProps = {
  isInputStep: boolean;
  postText: string;
  onTextChange: (value: string) => void;
};

export const PostInput = ({
  isInputStep,
  postText,
  onTextChange,
}: PostInputProps) => {
  return (
    <div className={styles.inputArea}>
      {isInputStep ? (
        <textarea
          className={styles.textarea}
          placeholder="いまどうしてる？"
          value={postText}
          onChange={(e) => onTextChange(e.target.value)}
        />
      ) : (
        <div className={styles.confirmTextDisplay}>{postText}</div>
      )}
    </div>
  );
};
