import React, { ReactElement } from 'react'

interface Props {
    msg: string
}

export default function ErrorMsg({msg}: Props): ReactElement {
    return (
        <div style={{fontWeight: "bold", fontSize: '1.35rem', textAlign: 'center'}}>
            <span style={{color: "darkred"}}>Erro: </span>{msg}
        </div>
    )
}
