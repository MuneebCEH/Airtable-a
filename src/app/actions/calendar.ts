'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { updateRowData } from "./rows"

export interface CalendarEvent {
    id: string // row id
    title: string
    start: Date
    end: Date
    allDay: boolean
    resource?: any
    sheetId: string
    dateColumnId: string
    fullData?: Record<string, any>
    columns?: { id: string, name: string }[]
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
        const events: CalendarEvent[] = []
        const sheets = await prisma.sheet.findMany({ include: { columns: true } })

        for (const sheet of sheets) {
            const sheetNameLower = sheet.name.toLowerCase()
            let dateColumn = null
            let nameColumn = sheet.columns.find(c =>
                c.name.toLowerCase() === "name" ||
                c.name.toLowerCase() === "patient name" ||
                c.name.toLowerCase().includes("patient")
            )

            if (sheetNameLower.includes("cgm pts") || sheetNameLower.includes("cgm pst")) {
                dateColumn = sheet.columns.find(c => c.name.toLowerCase() === "refill due")
                if (!dateColumn) dateColumn = sheet.columns.find(c => c.name.toLowerCase() === "delivered date")
            } else {
                dateColumn = sheet.columns.find(c =>
                    c.name.toLowerCase() === "delivered date" ||
                    c.name.toLowerCase() === "date delivered"
                )
            }

            if (dateColumn) {
                const rows = await prisma.row.findMany({ where: { sheetId: sheet.id } })
                for (const row of rows) {
                    const data = row.data as Record<string, any>
                    const dateValue = data[dateColumn.id]
                    const nameValue = nameColumn ? data[nameColumn.id] : "Untitled"

                    if (dateValue) {
                        const date = new Date(dateValue)
                        if (!isNaN(date.getTime())) {
                            events.push({
                                id: row.id,
                                title: `Refill: ${String(nameValue || "Unnamed")}`,
                                start: date,
                                end: date,
                                allDay: true,
                                sheetId: sheet.id,
                                dateColumnId: dateColumn.id,
                                fullData: data,
                                columns: sheet.columns.map(c => ({ id: c.id, name: c.name }))
                            })
                        }
                    }
                }
            }
        }
        return events
    } catch (error) {
        console.error("Error fetching calendar events:", error)
        return []
    }
}



export async function updateEventDate(rowId: string, sheetId: string, dateColumnId: string, newDate: Date) {
    try {
        const result = await updateRowData(rowId, {
            [dateColumnId]: newDate.toISOString()
        }, sheetId)

        if (!result.success) {
            throw new Error(result.error || "Failed to update row through central handler")
        }

        revalidatePath('/calendar')
        revalidatePath(`/projects`)
        return { success: true }
    } catch (error) {
        console.error("Error updating event date:", error)
        return { success: false, error: "Failed to update date" }
    }
}
