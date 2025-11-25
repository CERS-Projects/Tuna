import styles from "./helpCategoryCard.module.css"
import {Link} from 'react-router-dom'

type HelpCategoryBoxProps = {
    title: string;
    description: string;
    iconUrl? : string;
    to: string;
}

export const HelpCategoryCard = ({title, description, iconUrl, to}: HelpCategoryBoxProps) => {
    return (
        <Link to= {to} className={styles.helpCategoryBox}>

            <div className={styles.contentInner}>
                {/*...タイトル...*/}
                <h3>{title}</h3>

                {/*...説明...*/}
                <p>{description}</p>

              {/*...アイコン画像...*/}
                {iconUrl && (
                    <img src={iconUrl} alt={`${title}のアイコン`} className={styles.icon}/>
                )}
            </div>
            
        </Link>
    )
}
