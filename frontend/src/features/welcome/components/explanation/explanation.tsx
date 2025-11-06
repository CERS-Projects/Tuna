import styles from "./explanation.module.css";

type ExplanationType = {
  title: string;
  text: string;
};

type Props = {
  explanation: ExplanationType;
};

type ListProps = {
  explanationList: ExplanationType[];
};

export const Explanation = ({ explanation }: Props) => {
  return (
    <div>
      <h1 className={styles.explanationTitle}>{explanation.title}</h1>
      <div className={styles.explanationText}>{explanation.text}</div>
    </div>
  );
};

export const ExplanationList = ({ explanationList }: ListProps) => {
  const listItems = explanationList.map((el) => (
    <Explanation explanation={el} />
  ));
  return <div className={styles.explanationContainer}>{listItems}</div>;
};
