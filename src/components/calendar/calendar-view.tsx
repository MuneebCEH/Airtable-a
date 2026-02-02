"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { CalendarEvent, updateEventDate } from "@/app/actions/calendar"

const locales = {
    "en-US": enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

interface CalendarViewProps {
    initialEvents: CalendarEvent[]
}

export function CalendarView({ initialEvents }: CalendarViewProps) {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
    const [view, setView] = useState<View>(Views.MONTH)
    const [date, setDate] = useState(new Date())

    // Update local state when prop changes (e.g. after server revalidation)
    useEffect(() => {
        setEvents(initialEvents)
    }, [initialEvents])

    const onEventDrop = useCallback(
        async ({ event, start, end, isAllDay }: any) => {
            const draggedEvent = event as CalendarEvent

            // Optimistic update
            const updatedEvents = events.map((existingEvent) => {
                if (existingEvent.id === draggedEvent.id) {
                    return { ...existingEvent, start, end, allDay: isAllDay }
                }
                return existingEvent
            })
            setEvents(updatedEvents)

            // Server update
            try {
                const result = await updateEventDate(
                    draggedEvent.id,
                    draggedEvent.sheetId,
                    draggedEvent.dateColumnId,
                    start
                )

                if (!result.success) {
                    // Revert on failure
                    setEvents(events)
                    console.error(result.error)
                    alert("Failed to move event")
                }
            } catch (error) {
                console.error("Failed to update event", error)
                setEvents(events) // Revert
            }
        },
        [events]
    )


    return (
        <div className="h-[calc(100vh-100px)] bg-background p-4 rounded-lg border shadow-sm">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor={(e: CalendarEvent) => e.start}
                endAccessor={(e: CalendarEvent) => e.end}
                style={{ height: "100%" }}
                onEventDrop={onEventDrop}
                draggableAccessor={() => true}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(newView) => setView(newView)}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                popup
                resizable
                className="text-foreground"
            />
        </div>
    )
}
