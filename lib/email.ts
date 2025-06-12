// Email functionality disabled for now
export async function sendReminderEmail(
  email: string,
  name: string,
  appointment: {
    title: string
    date: string
    time: string
  },
) {
  // Email functionality disabled
  console.log(`Email reminder would be sent to ${email} for appointment: ${appointment.title}`)
  return Promise.resolve()
}
