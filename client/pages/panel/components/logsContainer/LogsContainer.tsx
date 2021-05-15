import React, { ReactElement } from 'react'
import ChatLogs from './components/ChatLogs'
import InAndOutLogs from './components/InAndOutLogs'

interface Props {
    
}

export default function LogsContainer({}: Props): ReactElement {
    return (
        <div>
            <InAndOutLogs/>
            <ChatLogs/>
        </div>
    )
}
