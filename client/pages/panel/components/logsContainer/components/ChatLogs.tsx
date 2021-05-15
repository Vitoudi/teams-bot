import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../../../../global/state'
import { LogBox } from '../../LogBox'

interface Props {
    
}

export default function ChatLogs({}: Props): ReactElement {
    const globalState = useContext(GlobalContext)[0]
    const [msgs, setMsgs] = useState([])

    useEffect(() => {
        if (!globalState.socket) return;

        globalState.socket.on("chat_msg_sent", chanelName => {
            setMsgs([...msgs, 'Presença - ' + chanelName])
        });
    })
    return (
        <LogBox title="Presenças:">
            {msgs.length? msgs.map(msg => {
                return <p>{msg}</p>
            }) : ''}
        </LogBox>
    )
}
