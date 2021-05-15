import React, { ReactElement } from 'react'
import styles from '../../../styles/LogBox.module.css'

interface Props {
    title: string
}

const LogBox: React.FC<Props> = ({title, children}) => {
    return (
        <div className={styles['container']}>
            <h2>{title}</h2>
            <div>
                {children}
            </div>
        </div>
    )
}

export default LogBox
