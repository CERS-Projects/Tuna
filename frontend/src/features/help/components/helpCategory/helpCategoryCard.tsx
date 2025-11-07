import styles from "./helpCategoryCard.module.css"

type HelpCategoryBoxProps = {
    title: string;
    description: string;
    iconUrl? : string;
}

export const HelpCategoryCard = ({title, description, iconUrl}: HelpCategoryBoxProps) => {
    return (
        <div className={styles.helpCategoryBox}>
            {/*...タイトル...*/}
            <h3>{title}</h3>

            {/*...説明...*/}
            <p>{description}</p>

            {/*...アイコン画像...*/}
            {iconUrl && (
                <img src={iconUrl} alt={`${title}のアイコン`} className="icon" />
            )}
        </div>
    )
}
