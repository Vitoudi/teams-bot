import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {GlobalContext} from '../../../../../global/state'
import LogBox from '../../LogBox'

interface Props {
    
}

export default function InAndOutLogs({}: Props): ReactElement {
    const globalState = useContext(GlobalContext)[0]
    const [msgs, setMsgs] = useState<string []>([]);

    useEffect(() => {
        if(!globalState.socket) return

        globalState.socket.on("entered_meeting", chanelName => {
            console.log('entered meeting')
            setMsgs([...msgs, 'Entrou - ' + chanelName])
        });

        globalState.socket.on("left_meeting", () => {
          console.log("left meeting");
          setMsgs([...msgs, "Saiu"]);
        });
    });
    
    return (
        <LogBox title="Entradas e saídas">
            {msgs.length ? msgs.map(msg => {
                return <p>{msg}</p>
            }) : ''}
        </LogBox>
    )
}
