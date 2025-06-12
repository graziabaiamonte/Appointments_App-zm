import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Create the appointments table using Supabase SQL
    const { data, error } = await supabase.rpc("create_appointments_table")

    if (error) {
      console.error("Error creating table:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: "Please create the table manually in Supabase SQL Editor",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      data,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: "Please create the table manually in Supabase SQL Editor",
      },
      { status: 500 },
    )
  }
}
