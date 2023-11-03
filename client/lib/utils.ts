import * as path from 'path';

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

export function getMediaURLFromApiBackend(mediaURL: string | null) {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${mediaURL}`
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
  
export function getFileNameWithExtension(filePath: string): string | null {
  const parsedPath = path.parse(filePath);
  if (parsedPath.base) {
    return parsedPath.base;
  }
  return null;
}
  