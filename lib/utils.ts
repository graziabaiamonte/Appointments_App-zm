import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(time: string) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function isMoreThan24HoursAway(date: string, time: string) {
  const appointmentDateTime = new Date(`${date}T${time}`)
  const now = new Date()
  const diffInHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  return diffInHours > 24
}

export function generateTimeSlots() {
  const slots = []
  for (let hour = 9; hour < 18; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00:00`)
    if (hour < 17) {
      slots.push(`${hour.toString().padStart(2, "0")}:30:00`)
    }
  }
  return slots
}

export function isWeekday(date: Date) {
  const day = date.getDay()
  return day >= 1 && day <= 5 // Monday to Friday
}
