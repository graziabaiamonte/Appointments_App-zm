import Link from "next/link"
import { Calendar } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AppointmentBook</span>
          </Link>
          <div className="text-sm text-gray-600">Book your appointment - No registration required</div>
        </div>
      </div>
    </header>
  )
}
