import React, { ReactElement } from 'react'
import Logo from '../../../components/Logo'
import useFetch from '../../../hooks/useFetch'
import styles from '../../../styles/panel.module.css'

interface Props {
    
}

export default function Aside({}: Props): ReactElement {
    const makeRequest = useFetch()

    function handleClick() {
        makeRequest('http://localhost:8000/close', "POST")
    }

    return (
        <aside className={styles['aside']}>
            <Logo fontSize={45}/>
            <ul>
                <li>Painel</li>
                <li>Configurações</li>
                <li style={{color: 'darkred'}} onClick={handleClick}>Fechar</li>
            </ul>
        </aside>
    )
}
