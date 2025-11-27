import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

// Configure dayjs with timezone support
dayjs.extend(utc)
dayjs.extend(timezone)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string to a localized format in Phnom Penh timezone
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDateTime(dateString: string): string {
  return dayjs(dateString)
    .tz("Asia/Phnom_Penh")
    .format("MMMM D, YYYY h:mm A")
}
