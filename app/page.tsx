"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, ExternalLink, Trash2, CalendarDays } from "lucide-react"
import { formatDate, formatTime, isMoreThan24HoursAway } from "@/lib/utils"
import { generateCalendarLink } from "@/lib/calendar"
import { useToast } from "@/hooks/use-toast"
import { BookingModal } from "@/components/booking-modal"
import { Header } from "@/components/header"

interface Appointment {
  id: number
  first_name: string
  last_name: string
  email: string
  title: string
  description?: string
  appointment_date: string
  appointment_time: string
  created_at: string
}

export default function HomePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const { toast } = useToast()

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments")
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleCancelAppointment = async (appointmentId: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return
    }

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment cancelled successfully",
        })
        fetchAppointments()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to cancel appointment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const upcomingAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`)
    return appointmentDate > new Date()
  })

  const pastAppointments = appointments.filter((apt) => {
    const appointmentDate = new Date(`${apt.appointment_date}T${apt.appointment_time}`)
    return appointmentDate <= new Date()
  })

  const totalUsers = new Set(appointments.map((apt) => apt.email)).size

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Book Your Appointment
            <span className="text-blue-600"> Today</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Schedule your appointment quickly and easily. No account required - just enter your details and pick a time!
          </p>
          <Button onClick={() => setIsBookingModalOpen(true)} size="lg" className="text-lg px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People Served</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8">
          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Upcoming Appointments ({upcomingAppointments.length})
            </h2>

            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <Button onClick={() => setIsBookingModalOpen(true)} className="mt-4">
                    Book the First Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{appointment.title}</CardTitle>
                          <CardDescription className="mt-1">{appointment.description}</CardDescription>
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Booked by:</strong> {appointment.first_name} {appointment.last_name} (
                            {appointment.email})
                          </div>
                        </div>
                        <Badge variant="secondary">Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(appointment.appointment_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(appointment.appointment_time)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const calendarLink = generateCalendarLink({
                                title: appointment.title,
                                description: appointment.description,
                                date: appointment.appointment_date,
                                time: appointment.appointment_time,
                              })
                              window.open(calendarLink, "_blank")
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Add to Calendar
                          </Button>
                          {isMoreThan24HoursAway(appointment.appointment_date, appointment.appointment_time) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Past Appointments ({pastAppointments.length})
              </h2>
              <div className="grid gap-4">
                {pastAppointments.slice(0, 5).map((appointment) => (
                  <Card key={appointment.id} className="opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{appointment.title}</CardTitle>
                          <CardDescription className="mt-1">{appointment.description}</CardDescription>
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Attended by:</strong> {appointment.first_name} {appointment.last_name}
                          </div>
                        </div>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.appointment_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.appointment_time)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSuccess={() => {
          setIsBookingModalOpen(false)
          fetchAppointments()
        }}
      />
    </div>
  )
}
