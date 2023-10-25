import { FetchStatus } from '@/lib/utils'
import React from 'react'

type Props = {
    children: React.ReactNode,
    isPending: boolean,
    onClick: React.MouseEventHandler | undefined,
    isRestricted?: boolean
}

const ActionButton = ({children, isPending, onClick, isRestricted = false}: Props) => {
    return (
        <button type='button' onClick={onClick} disabled={isPending || isRestricted} className={`${isPending ? 'opacity-25' : ''} ${isRestricted ? 'cursor-not-allowed' : ''}`}>
            {children}
        </button>
    )
}

export default ActionButton