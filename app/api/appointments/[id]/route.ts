import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id

    // Get appointment details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single()

    if (fetchError || !appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Check 24-hour rule
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`)
    const now = new Date()
    const diffInHours = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffInHours <= 24) {
      return NextResponse.json({ error: "Cannot cancel appointments within 24 hours" }, { status: 400 })
    }

    // Delete the appointment
    const { error: deleteError } = await supabase.from("appointments").delete().eq("id", appointmentId)

    if (deleteError) {
      console.error("Error deleting appointment:", deleteError)
      return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 })
    }

    return NextResponse.json({ message: "Appointment cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
