// Last updated: 2026-02-11T06:58:00
'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { updateRowData } from "./rows"

export interface CalendarEvent {
    id: string // unique event id
    pureRowId?: string // original row id
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
            let nameColumn = sheet.columns.find(c =>
                c.name.toLowerCase() === "name" ||
                c.name.toLowerCase() === "patient name" ||
                c.name.toLowerCase().includes("patient")
            )

            // Priority Columns
            const refillCol = sheet.columns.find(c => c.name.toLowerCase() === "refill due")
            const deliveredCol = sheet.columns.find(c =>
                c.name.toLowerCase() === "delivered date" ||
                c.name.toLowerCase() === "date delivered"
            )

            if (refillCol || deliveredCol) {
                const rows = await prisma.row.findMany({ where: { sheetId: sheet.id } })
                for (const row of rows) {
                    const data = row.data as Record<string, any>

                    // Priority: Refill Due, then Delivered Date
                    let activeCol = null
                    if (refillCol && data[refillCol.id]) {
                        activeCol = refillCol
                    } else if (deliveredCol && data[deliveredCol.id]) {
                        activeCol = deliveredCol
                    }

                    if (activeCol && data[activeCol.id]) {
                        const dateValue = String(data[activeCol.id]).trim()
                        const date = new Date(dateValue)
                        if (!isNaN(date.getTime())) {
                            const isRefill = activeCol.name.toLowerCase().includes("refill")
                            const nameValue = nameColumn ? data[nameColumn.id] : "Unnamed"

                            events.push({
                                id: `${row.id}:date:${activeCol.id}`,
                                pureRowId: row.id,
                                title: `${isRefill ? 'Refill' : 'Delivered'}: ${String(nameValue || "Unnamed")}`,
                                start: date,
                                end: date,
                                allDay: true,
                                sheetId: sheet.id,
                                dateColumnId: activeCol.id,
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



export async function updateEventDate(combinedId: string, sheetId: string, dateColumnId: string, newDate: Date) {
    try {
        const rowId = combinedId.split(':date:')[0]
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
