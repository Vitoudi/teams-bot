import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../../../../../global/state'
import useGetPreviusLogsFor from '../../../../../hooks/useGetPreviusLogsFor'
import LogBox from '../../LogBox'
import styles from '../../../../../styles/LogBox.module.css'
import { getCurrentIsoDate, getDateFromLog } from '../../../../../utils/getDateForLog'
import Log from './Log'
import { ILog } from '../../../../../types&interfaces/interfaces'


export default function ChatLogs(): ReactElement {
    const globalState = useContext(GlobalContext)[0]
    const [msgs, setMsgs] = useState([]);
    const getPreviousLogs = useGetPreviusLogsFor({'apiRouteToGetLogs': '/chat_logs'})

    useEffect(() => {
        if (!globalState.socket) return;

        getPreviousLogs(setMsgs)

        globalState.socket.on("chat_msg_sent", channel => {
            const log: ILog = { channel, eventName: "chat_msg_sent", date: getCurrentIsoDate() };
            setMsgs(logs => [...logs, log])
        });
    }, [])

    return (
        <LogBox title="Presenças:">
            {msgs.length? msgs.map(log => {
                return <Log log={log}/>
            }) : ''}
        </LogBox>
    )
}
