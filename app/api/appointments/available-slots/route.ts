import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    console.log("Fetching slots for date:", date)

    // Generate all possible time slots (9 AM to 6 PM, 30-minute intervals)
    const allTimeSlots = []
    for (let hour = 9; hour < 18; hour++) {
      allTimeSlots.push(`${hour.toString().padStart(2, "0")}:00:00`)
      if (hour < 17) {
        allTimeSlots.push(`${hour.toString().padStart(2, "0")}:30:00`)
      }
    }

    // Get all booked slots for the date
    const { data: bookedSlots, error } = await supabase
      .from("appointments")
      .select("appointment_time")
      .eq("appointment_date", date)

    if (error) {
      console.error("Supabase error:", error)
      // Return all slots if there's an error
      return NextResponse.json(allTimeSlots)
    }

    console.log("Booked slots from Supabase:", bookedSlots)

    // Convert booked times to string format for comparison
    const bookedTimes = (bookedSlots || []).map((slot) => {
      const timeStr = slot.appointment_time
      // Ensure time is in HH:MM:SS format
      if (typeof timeStr === "string") {
        return timeStr.includes(":") && timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr
      }
      return timeStr
    })

    console.log("Processed booked times:", bookedTimes)

    const availableSlots = allTimeSlots.filter((time) => !bookedTimes.includes(time))
    console.log("Available slots:", availableSlots)

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error("Error fetching available slots:", error)

    // Return all slots as fallback
    const allTimeSlots = []
    for (let hour = 9; hour < 18; hour++) {
      allTimeSlots.push(`${hour.toString().padStart(2, "0")}:00:00`)
      if (hour < 17) {
        allTimeSlots.push(`${hour.toString().padStart(2, "0")}:30:00`)
      }
    }

    return NextResponse.json(allTimeSlots)
  }
}
