import { neon } from "@neondatabase/serverless"

// Create a simple SQL function that handles missing DATABASE_URL
export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : (() => {
      console.warn("DATABASE_URL not set, using mock database")
      return async (strings: any, ...values: any[]) => {
        console.log("Mock SQL query:", strings, values)
        return [] // Return empty array for any query
      }
    })()
