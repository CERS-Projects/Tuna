import { useState } from "react";
import type { MouseEvent } from "react";

import Style from "./contentsItem.module.css";

type contentsItemProps = {
  question: string;
  answer: string;
};

export const ContentsItem = (contents: contentsItemProps) => {
  const [isCardOpen, setIsCardOpen] = useState(false);

  // 💡 カード全体をクリックしたときのハンドラ
  const handleCardToggle = () => {
    setIsCardOpen(!isCardOpen);
  };

  // アコーディオンが閉じないようにするハンドラ
  const handleAnswerClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className={Style.contentsCard} onClick={handleCardToggle}>
      <div className={Style.questionSummary}>
        <div>{contents.question}</div>
        <span className={Style.toggleIcon}>{isCardOpen ? "▲" : "▼"}</span>
      </div>

      {isCardOpen && (
        <div className={Style.answerContent} onClick={handleAnswerClick}>
          {contents.answer}
        </div>
      )}
    </div>
  );
};
