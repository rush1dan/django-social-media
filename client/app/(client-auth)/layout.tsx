import { ReactNode } from "react"

export const metadata = {
    title: 'Register',
    description: 'Tracky - Register',
}

export default function AuthPageLayout({ children } : { children: ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}