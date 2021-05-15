import React, { ReactElement } from 'react'
import Image from 'next/image'

interface Props {
    msg: string
}

export default function Loading({msg}: Props): ReactElement {
    return (
        <div style={{display: 'grid'}}>
            <p style={{marginBottom: '10px'}}>{msg}</p>
            <Image width={60} height={60} src="/../public/assets/loading-icon.svg"/>
        </div>
    )
}
