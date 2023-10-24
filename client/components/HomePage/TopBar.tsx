import React from 'react'

type Props = {
    className?: string
}

const TopBar = ({className}: Props) => {
    return (
        <div className={className}>
            <div className='w-full h-full flex flex-row items-center justify-between'>
                TopBar
            </div>
        </div>
    )
}

export default TopBar