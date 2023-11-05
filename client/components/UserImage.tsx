import { getMediaURLFromApiBackend } from '@/lib/utils';
import React from 'react'

type Props = {
    src: string | undefined,
    widthClass?: string,
    heightClass?: string,
    fill?: boolean
}

const UserImage = ({src, widthClass, heightClass, fill=false}: Props) => {
    const imageOnErrorHandler = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.src = '/user.svg';
    };

    return (
        <div className={`${fill ? '' : `${widthClass} ${heightClass}`} flex-none rounded-full relative bg-slate-500 overflow-clip`}>
            <img src={getMediaURLFromApiBackend(src)} alt='dp' className='object-cover'
                        onError={imageOnErrorHandler}/>
        </div>
    )
}

export default UserImage