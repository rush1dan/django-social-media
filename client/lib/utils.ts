const FetchStatus = {
    none: -2,
    error: -1,
    pending: 0,
    success: 1
}

export { FetchStatus }

export function apiPath(path: string) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`
}