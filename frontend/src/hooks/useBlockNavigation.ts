import { useBlocker } from "react-router";
import { useEffect } from "react";

export const useBlockNavigation = (isDirty: boolean) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      // isDirtyがtrue、かつ現在のパスと次のパスが違う場合にブロック
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    // ブロック状態になったらブラウザ標準のconfirmを出す
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm(
        "入力内容が保存されていません。移動しますか？",
      );
      if (confirmLeave) {
        blocker.proceed(); // 移動する
      } else {
        blocker.reset(); // 移動キャンセル
      }
    }
  }, [blocker]);
};
