import React, { useImperativeHandle, useRef, useCallback } from "react";
import styles from "./modal.module.css";

export type ModalHandle = {
  show: () => void;
  close: () => void;
};

type ModalProps = React.DialogHTMLAttributes<HTMLDialogElement> & {
  ref?: React.Ref<ModalHandle>;
  width?: string | number;
  height?: string | number;
  containerStyle?: React.CSSProperties;
  children: React.ReactNode;
};

export const Modal = ({
  ref,
  width,
  height,
  children,
  containerStyle,
  ...props
}: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const showModal = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  const closeModal = useCallback(() => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    show: () => showModal(),
    close: () => closeModal(),
  }));

  return (
    <dialog
      className={styles.modal}
      style={{ width, height, ...containerStyle }}
      ref={modalRef}
      onClick={closeModal}
      {...props}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </dialog>
  );
};
