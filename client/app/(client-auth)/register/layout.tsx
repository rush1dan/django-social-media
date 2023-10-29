import { ReactNode } from "react"

export const metadata = {
    title: 'Register',
    description: 'Django Social Media - Register',
}

export default function RegisterPageLayout({ children } : { children: ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}