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
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
        // 1. Find the target sheet and columns
        // Strategy: Look for a sheet named "Patient Sheet" (case insensitive)
        // and find columns "Date Delivered" and "Patient Name"

        // First, get all sheets with their columns
        const sheets = await prisma.sheet.findMany({
            include: {
                columns: true
            }
        })

        let targetSheet = sheets.find(s => s.name.toLowerCase().includes("patient"))

        // If no specific "Patient" sheet, search for any sheet with "Date Delivered" column
        if (!targetSheet) {
            targetSheet = sheets.find(s =>
                s.columns.some(c => c.name.toLowerCase() === "date delivered")
            )
        }

        if (!targetSheet) {
            console.log("No suitable sheet found for calendar")
            return []
        }

        const dateColumn = targetSheet.columns.find(c => c.name.toLowerCase() === "date delivered")
        const nameColumn = targetSheet.columns.find(c => c.name.toLowerCase().includes("patient") || c.name.toLowerCase() === "name")

        if (!dateColumn) {
            console.log("Date Delivered column not found")
            return []
        }

        // 2. Fetch rows for the target sheet
        const rows = await prisma.row.findMany({
            where: {
                sheetId: targetSheet.id
            }
        })

        // 3. Map rows to events
        const events: CalendarEvent[] = []

        for (const row of rows) {
            const data = row.data as Record<string, any>
            const dateValue = data[dateColumn.id]
            const nameValue = nameColumn ? data[nameColumn.id] : "Untitled"

            if (dateValue) {
                const date = new Date(dateValue)
                if (!isNaN(date.getTime())) {
                    events.push({
                        id: row.id,
                        title: String(nameValue || "Unnamed Patient"),
                        start: date,
                        end: date, // Single day event usually
                        allDay: true,
                        sheetId: targetSheet.id,
                        dateColumnId: dateColumn.id
                    })
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
