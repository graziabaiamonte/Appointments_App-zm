import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
    }

    return NextResponse.json(appointments || [])
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, title, description, date, time } = await request.json()

    if (!firstName || !lastName || !email || !title || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if slot is already booked
    const { data: existingAppointment, error: checkError } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", date)
      .eq("appointment_time", time)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing appointment:", checkError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingAppointment) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 400 })
    }

    // Validate date is weekday and in the future
    const appointmentDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (appointmentDate < today) {
      return NextResponse.json({ error: "Cannot book appointments in the past" }, { status: 400 })
    }

    const dayOfWeek = appointmentDate.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({ error: "Appointments are only available Monday to Friday" }, { status: 400 })
    }

    // Validate time is within business hours
    const [hour] = time.split(":").map(Number)
    if (hour < 9 || hour >= 18) {
      return NextResponse.json({ error: "Appointments are only available from 9:00 AM to 6:00 PM" }, { status: 400 })
    }

    // Create the appointment
    const { data: newAppointment, error: insertError } = await supabase
      .from("appointments")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        title,
        description,
        appointment_date: date,
        appointment_time: time,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating appointment:", insertError)
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
    }

    return NextResponse.json(newAppointment)
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
