import { FetchStatus } from '@/lib/utils'
import React from 'react'

type Props = {
    children: React.ReactNode,
    isPending: boolean,
    onClick: React.MouseEventHandler | undefined
}

const ActionLink = ({children, isPending, onClick}: Props) => {
    return (
        <div onClick={onClick} className={`cursor-pointer ${isPending ? 'pointer-events-none' : ''}`}>
            {children}
        </div>
    )
}

export default ActionLink