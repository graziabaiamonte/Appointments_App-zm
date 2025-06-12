import { sql } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const db = sql(DATABASE_URL)

async function sendReminders() {
  try {
    // Get appointments for tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDate = tomorrow.toISOString().split("T")[0]

    const appointments = await db`
      SELECT a.*, u.name, u.email
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      WHERE a.appointment_date = ${tomorrowDate}
    `

    console.log(`Found ${appointments.length} appointments for tomorrow`)

    for (const appointment of appointments) {
      // Just log instead of sending email
      console.log(
        `Reminder would be sent to ${appointment.email} for appointment: ${appointment.title} on ${appointment.appointment_date} at ${appointment.appointment_time}`,
      )
    }

    console.log("Reminder check completed (emails disabled)")
  } catch (error) {
    console.error("Error checking reminder appointments:", error)
  }
}

// Run the script
sendReminders()
