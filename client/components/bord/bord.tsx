import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import RoomSelector from './components/RoomSelector';
import styles from "../../styles/Bord.module.css";
import Logo from '../Logo';

export type Mode = "loginForm" | "roomSelector" 

export default function bord() {
    const [mode, setMode] = useState<Mode>("loginForm");

    return (
        <div className={styles['bord-container']}>
            <Logo/>
            {mode === 'loginForm'? <LoginForm setMode={setMode}/> : (
                <RoomSelector/>
            )}
        </div>
    )
}
