import React from 'react'
import styles from "./helpCategory.module.css"

interface helpCategoryBoxProps {
    title: string;
    description: string;
    iconUrl? : string;
}

export const HelpCategoryBoxTemplate: React.FC<helpCategoryBoxProps> = ({ title, description, iconUrl}) => {
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
