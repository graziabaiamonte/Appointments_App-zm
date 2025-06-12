export function generateCalendarLink(appointment: {
  title: string
  description?: string
  date: string
  time: string
}) {
  const startDate = new Date(`${appointment.date}T${appointment.time}`)
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // 1 hour duration

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: appointment.title,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: appointment.description || "",
    location: "Office",
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
