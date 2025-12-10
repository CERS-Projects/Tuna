import React from "react";
import { type SchoolRequestType } from "../../types/schoolRequest";
import { ApiRequestError } from "@/types/apiRequestError";
import { Modal, type ModalHandle } from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button/button";
import styles from "./confirmModal.module.css";

type ConfirmModalProps = {
  ref: React.Ref<ModalHandle>;
  request: SchoolRequestType;
  isPending: boolean;
  error: Error | null;
  handleSubmit: () => void;
  handleClose: () => void;
};

export const ConfirmModal = ({
  ref,
  request,
  isPending,
  error,
  handleSubmit,
  handleClose,
}: ConfirmModalProps) => {
  return (
    <Modal
      ref={ref}
      containerStyle={{ width: "70%", height: "80%", backgroundColor: "#fff" }}
    >
      <div className={styles.confirmContainer}>
        <h3>この内容でよろしいですか？</h3>
        <table className={styles.confirmData}>
          <tr>
            <th>学校名</th>
            <td>{request.schoolDto.schoolName}</td>
          </tr>
          <tr>
            <th>学校コード</th>
            <td>{request.schoolDto.schoolCode}</td>
          </tr>
          <tr>
            <th>学校住所</th>
            <td>{request.schoolDto.schoolAddress}</td>
          </tr>
          <tr>
            <th>学校メールアドレス</th>
            <td>{request.schoolDto.schoolMailAddress}</td>
          </tr>
          <tr>
            <th>表示用管理者ID</th>
            <td>{request.createTeacherDto.showUserId}</td>
          </tr>
          <tr>
            <th>管理者名</th>
            <td>{request.createTeacherDto.name}</td>
          </tr>
          <tr>
            <th>管理者メールアドレス</th>
            <td>{request.createTeacherDto.mailAddress}</td>
          </tr>
          <tr>
            <th>パスワード</th>
            <td>{request.createTeacherDto.password}</td>
          </tr>
        </table>

        <div className={styles.infoContainer}>
          {error && (
            <span className={styles.requestError}>
              {error instanceof ApiRequestError &&
              error.body?.statusCode === 409
                ? "既に登録されている学校です。"
                : error instanceof ApiRequestError &&
                  error.body?.statusCode === 400
                ? "入力内容に誤りがあります。"
                : "申請に失敗しました。もう一度お試しください。"}
            </span>
          )}

          <div className={styles.buttonContainer}>
            <Button onClick={handleSubmit}>
              {isPending ? "送信中..." : "申請"}
            </Button>
            <Button
              onClick={handleClose}
              style={{ backgroundColor: "#db5252ff" }}
            >
              戻る
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
