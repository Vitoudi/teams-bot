import React, { ReactElement, useContext } from 'react'
import Logo from '../../../components/Logo'
import { GlobalContext } from '../../../global/state'
import useFetch from '../../../hooks/useFetch'
import styles from '../../../styles/panel.module.css'

interface Props {
    
}

export default function Aside({}: Props): ReactElement {
    const globalState = useContext(GlobalContext)[0];
    const makeRequest = useFetch({ defaultUrlStart: globalState.apiUrl });

    function handleClick() {
        if (!localStorage) return;
        makeRequest({url: '/close', method: 'POST', token: globalState.jsonToken}).then(() => {
            localStorage.removeItem('jsonToken');
        })
    }

    return (
        <aside className={styles['aside']}>
            <Logo fontSize={45}/>
            <ul>
                <li>Painel</li>
                <li>Configurações</li>
                <li style={{color: 'darkred', cursor: 'pointer'}} onClick={handleClick}>Fechar</li>
            </ul>
        </aside>
    )
}
