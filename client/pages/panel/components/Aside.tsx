import React, { ReactElement, useContext } from 'react'
import Logo from '../../../components/Logo'
import { GlobalContext } from '../../../global/state'
import useFetch from '../../../hooks/useFetch'
import styles from '../../../styles/panel.module.css'

interface Props {
    
}

export default function Aside({}: Props): ReactElement {
    const globalState = useContext(GlobalContext)[0]
    const makeRequest = useFetch()

    function handleClick() {
        makeRequest({url: 'http://localhost:8000/close', method: 'POST', token: globalState.jsonToken})
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
