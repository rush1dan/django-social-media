import React from 'react'

type Props = {
    children: React.ReactNode,
    className?: string,
    isPending: boolean,
    buttonType?: 'button' | 'submit'| 'reset' | undefined,
    onClick?: React.MouseEventHandler | undefined,
    isRestricted?: boolean
}

const ActionButton = ({children, className, buttonType='button', isPending, onClick, isRestricted = false}: Props) => {
    return (
        <button type={buttonType} onClick={onClick} disabled={isPending || isRestricted} className={`${className} ${isPending ? 'pointer-events-none' : ''} ${isRestricted ? 'cursor-not-allowed' : ''}`}>
            {children}
        </button>
    )
}

export default ActionButton