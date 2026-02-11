
import { CalendarView } from "@/components/calendar/calendar-view"
import { getCalendarEvents } from "@/app/actions/calendar"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
    title: "Calendar | Delta Medical",
    description: "View delivery dates and schedules.",
}

export default async function CalendarPage() {
    const events = await getCalendarEvents()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
                <div className="flex items-center space-x-2">
                    {/* Add calendar filters or view options here if needed later */}
                </div>
            </div>
            <div className="hidden h-full flex-1 md:flex">
                <div className="w-full">
                    <CalendarView initialEvents={events} />
                </div>
            </div>
            {/* Mobile fallback or varied layout could go here */}
            <div className="md:hidden">
                <p>Please view on a larger screen for the full calendar experience.</p>
            </div>
        </div>
    )
}
