import { useRouter } from 'next/router'
import React, { ReactElement, useContext, useEffect } from 'react'
import * as io from 'socket.io-client'
import { GlobalContext } from '../../global/state'
import Aside from './components/Aside'
import InAndOutLogs from './components/logsContainer/components/InAndOutLogs'
import LogsContainer from './components/logsContainer/LogsContainer'
import styles from '../../styles/panel.module.css'
import useFetch from '../../hooks/useFetch'


interface Props {
    
}

export default function panel({}: Props): ReactElement {
    const makeRequest = useFetch()
    const router = useRouter()
    const [globalState, setGlobalState] = useContext(GlobalContext)

    /*useEffect(() => {
        const socket = io.connect("http://localhost:8000")
        putSocketConnectionOnGlobalState(socket)
        socket.on("on_connected", data => {
            console.log(data)
        })
    }, [])*/

    useEffect(() => {
        if (globalState.isLoggedIn) return;

        router.replace('/')
    }, [])

    function putSocketConnectionOnGlobalState(socket: SocketIOClient.Socket) {
        setGlobalState(state => {
            return {...state, socket}
        })
    }

    return (
        <div className={styles['container']}>
            <Aside/>
            <LogsContainer/>
        </div>
    )
}
