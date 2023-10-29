import { ReactNode } from "react"

export const metadata = {
    title: 'Login',
    description: 'Django Social Media - Login',
}

export default function LoginPageLayout({ children } : { children: ReactNode}) {
    return (
        <>
            {children}
        </>
    )
}