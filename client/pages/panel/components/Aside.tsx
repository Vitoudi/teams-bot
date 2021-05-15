import React, { ReactElement } from 'react'
import Logo from '../../../components/Logo'
import styles from '../../../styles/panel.module.css'

interface Props {
    
}

export default function Aside({}: Props): ReactElement {
    return (
        <aside className={styles['aside']}>
            <Logo fontSize={45}/>
            <ul>
                <li>Painel</li>
                <li>Configurações</li>
            </ul>
        </aside>
    )
}
