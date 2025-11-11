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
        <span>Q</span>
        <div>{contents.question}</div>
        <span className={`${Style.toggleIcon} ${isCardOpen ? Style.open : ""}`}>
          ▶
        </span>
      </div>

      <div
        className={`${Style.answerContainer} ${isCardOpen ? Style.open : ""}`}
        onClick={handleAnswerClick}
      >
        <div className={Style.answerContents}>
          <span>A.</span>
          {contents.answer}
        </div>
      </div>
    </div>
  );
};
