import React from 'react'

type Props = {
    children: React.ReactNode,
    isPending: boolean,
    buttonType?: 'button' | 'submit'| 'reset' | undefined,
    onClick?: React.MouseEventHandler | undefined,
    isRestricted?: boolean
}

const ActionButton = ({children, buttonType='button', isPending, onClick, isRestricted = false}: Props) => {
    return (
        <button type={buttonType} onClick={onClick} disabled={isPending || isRestricted} className={`${isPending ? 'opacity-25' : ''} ${isRestricted ? 'cursor-not-allowed' : ''}`}>
            {children}
        </button>
    )
}

export default ActionButton