// Last updated: 2026-02-11T07:02:00
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

        // Fetch all relevant sheets with their columns
        const sheets = await prisma.sheet.findMany({
            include: {
                columns: true
            }
        })

        for (const sheet of sheets) {
            const nameColumn = sheet.columns.find(c =>
                c.name.toLowerCase() === "name" ||
                c.name.toLowerCase() === "patient name" ||
                c.name.toLowerCase().includes("patient")
            )

            const dateCols = sheet.columns.filter(c =>
                c.name.toLowerCase() === "refill due" ||
                c.name.toLowerCase() === "delivered date" ||
                c.name.toLowerCase() === "date delivered"
            )

            if (dateCols.length > 0) {
                const rows = await prisma.row.findMany({
                    where: { sheetId: sheet.id }
                })

                for (const row of rows) {
                    const data = row.data as Record<string, any>

                    // Priority: Refill Due > Delivered Date
                    let bestDateCol = dateCols.find(c => c.name.toLowerCase() === "refill due")
                    if (!bestDateCol || !data[bestDateCol.id]) {
                        const delivered = dateCols.find(c => c.name.toLowerCase().includes("delivered"))
                        if (delivered && data[delivered.id]) {
                            bestDateCol = delivered
                        } else {
                            bestDateCol = undefined
                        }
                    }

                    if (bestDateCol && data[bestDateCol.id]) {
                        const dateValue = String(data[bestDateCol.id]).trim()

                        // Handle potential date format issues (e.g. 02/02/2026)
                        // Most JS engines handle this, but let's be safe
                        const date = new Date(dateValue)

                        if (!isNaN(date.getTime())) {
                            const nameValue = nameColumn ? data[nameColumn.id] : "Unnamed"
                            const isRefill = bestDateCol.name.toLowerCase().includes("refill")

                            events.push({
                                id: `${row.id}:date:${bestDateCol.id}`,
                                pureRowId: row.id,
                                title: `${isRefill ? 'Refill' : 'Delivered'}: ${String(nameValue || "Unnamed")}`,
                                start: date,
                                end: date,
                                allDay: true,
                                sheetId: sheet.id,
                                dateColumnId: bestDateCol.id,
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
