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

export function formatRelativeTime(dateTimeString: string): string {
    const now = new Date();
    const pastDate = new Date(dateTimeString);
    const timeDifference = now.getTime() - pastDate.getTime();
    
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) {
      return seconds + "s ago";
    } else if (minutes < 60) {
      return minutes + "m ago";
    } else if (hours < 24) {
      return hours + "h ago";
    } else {
      return days + "d ago";
    }
  }
  
//   const dateTimeString = "2023-10-26T16:50:59.380973Z";
//   const relativeTime = formatRelativeTime(dateTimeString);
//   console.log(relativeTime);
  