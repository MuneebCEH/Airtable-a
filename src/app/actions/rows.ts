"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getFedexTrackingStatus } from "./fedex"
import { processAttachmentCompliance } from "./ai-compliance"

export async function updateRowData(rowId: string, data: any, sheetId?: string) {
    if (!rowId) return { success: false, error: "Row ID is required" } as any

    try {
        let targetSheetId = sheetId
        if (!targetSheetId && !rowId.startsWith("ghost-")) {
            const row = await prisma.row.findUnique({ where: { id: rowId }, select: { sheetId: true } })
            if (row) targetSheetId = row.sheetId
        }

        if (targetSheetId) {
            const columns = await prisma.column.findMany({
                where: { sheetId: targetSheetId }
            })

            const trackingCol = columns.find(c => c.name.toLowerCase() === 'tracking')
            const statusCol = columns.find(c => c.name.toLowerCase() === 'tracking status')
            const deliveredDateCol = columns.find(c => c.name.toLowerCase() === 'delivered date')

            if (trackingCol && data[trackingCol.id] && typeof data[trackingCol.id] === 'string' && data[trackingCol.id].trim().length > 5) {
                try {
                    const fedexRes = await getFedexTrackingStatus(data[trackingCol.id].trim())

                    if (fedexRes) {
                        if (fedexRes.status && statusCol) {
                            data[statusCol.id] = fedexRes.status
                        }
                        if (fedexRes.deliveredDate && deliveredDateCol) {
                            data[deliveredDateCol.id] = fedexRes.deliveredDate
                        }
                    }
                } catch (err) {
                    console.error("FedEx auto-lookup failed:", err)
                }
            }

            // --- SYNC DELIVERED DATE TO REFILL DUE ---
            const refillDueCol = columns.find(c => c.name.toLowerCase() === 'refill due')
            if (deliveredDateCol && refillDueCol) {
                const deliveredDateVal = data[deliveredDateCol.id]
                if (deliveredDateVal) {
                    try {
                        const date = new Date(deliveredDateVal)
                        if (!isNaN(date.getTime())) {
                            date.setDate(date.getDate() + 30)
                            data[refillDueCol.id] = date.toISOString().split('T')[0]
                        } else {
                            data[refillDueCol.id] = deliveredDateVal
                        }
                    } catch (e) {
                        data[refillDueCol.id] = deliveredDateVal
                    }
                }
            }

            // --- ATTACHMENT PROCESSING START ---
            const attachmentCol = columns.find(c => c.name.toLowerCase() === 'attachments' || c.type === 'FILE')

            if (attachmentCol && data[attachmentCol.id] && Array.isArray(data[attachmentCol.id])) {
                let priorData: any = {}
                if (!rowId.startsWith("ghost-")) {
                    const r = await prisma.row.findUnique({ where: { id: rowId }, select: { data: true } })
                    if (r) priorData = r.data || {}
                }

                const oldFiles = (priorData[attachmentCol.id] as any[]) || []
                const newFiles = data[attachmentCol.id] as any[]

                const addedFiles = newFiles.filter(nf => !oldFiles.some(of => of.path === nf.path))

                if (addedFiles.length > 0) {
                    const fileToProcess = addedFiles[addedFiles.length - 1];

                    if (fileToProcess.path.match(/\.(pdf|jpg|jpeg|png|webp)$/i)) {
                        try {
                            const result = await processAttachmentCompliance(fileToProcess.path)

                            if (result.success && result.extractedData) {
                                const ext = result.extractedData as any;
                                const colMap: Record<string, string> = {};
                                columns.forEach(c => colMap[c.name.toLowerCase()] = c.id);

                                const setIfCol = (colName: string, val: any) => {
                                    const id = colMap[colName.toLowerCase()]
                                    if (id && val) data[id] = val
                                }

                                setIfCol("Dr Name", ext.dr_name)
                                setIfCol("NPI Number", ext.dr_npi)
                                setIfCol("Medicare ID", ext.medicare_id)
                                setIfCol("Patient Name", ext.patient_name)
                                setIfCol("DOB", ext.dob)
                                setIfCol("DOS", ext.date_of_appointment)
                                setIfCol("Notes", result.analysis)

                                if (result.analysis) {
                                    (data as any)._aiAnalysisTemp = result.analysis;
                                }
                            } else if (!result.success) {
                                console.error("AI Analysis failed:", result.error);
                                (data as any)._aiErrorTemp = result.error;
                            }
                        } catch (e) {
                            console.error("Attachment processing error:", e)
                        }
                    }
                }
            }

            // --- SYNC TO SPECIAL SHEETS START ---
            const productTypeCol = columns.find(c =>
                ['product type', 'product', 'item'].includes(c.name.toLowerCase())
            )
            const selection = productTypeCol ? (data[productTypeCol.id] as string)?.trim() : null

            if (selection && !rowId.startsWith("ghost-")) {
                const targetSheetName = (selection === 'CGM PTS' || selection === 'CGM PST') ? 'CGM PTS' :
                    (selection === 'BRX PTs') ? 'BRX PTs' : null;

                if (targetSheetName) {
                    const sheet = await prisma.sheet.findUnique({ where: { id: targetSheetId } })
                    // Only sync if we are in the Patients sheet
                    if (sheet && sheet.name === 'Patients') {
                        const existingRow = await prisma.row.findUnique({ where: { id: rowId } })
                        const prevData = (existingRow?.data as any) || {}

                        if (prevData[productTypeCol!.id] !== selection) {
                            // This only copies the data to the target sheet, it does NOT delete or move the original row
                            await syncRowToSpecialSheet(rowId, { ...prevData, ...data }, targetSheetId, columns, targetSheetName)
                        }
                    }
                }
            }
            // --- SYNC TO SPECIAL SHEETS END ---
        }

        if (rowId.startsWith("ghost-")) {
            if (!sheetId) return { success: false, error: "Sheet ID required" } as any
            const newRow = await prisma.row.create({
                data: { sheetId, data: data, order: 999999 }
            })
            revalidatePath("/projects/[projectId]")
            return { success: true, row: newRow } as any
        }

        const existingRow = await prisma.row.findUnique({ where: { id: rowId } })
        if (!existingRow) return { success: false, error: "Row not found" } as any

        const currentData = existingRow.data as Record<string, any> || {}
        const newDataForPrisma = { ...currentData, ...data }

        const updatedRow = await prisma.row.update({
            where: { id: rowId },
            data: { data: newDataForPrisma, updatedAt: new Date() }
        })

        revalidatePath("/projects/[projectId]")

        const result: any = { success: true, row: updatedRow }
        if ((data as any)._aiAnalysisTemp) result.aiAnalysis = (data as any)._aiAnalysisTemp
        if ((data as any)._aiErrorTemp) {
            result.success = false
            result.isAiError = true
            result.error = (data as any)._aiErrorTemp
        }

        return result
    } catch (error) {
        console.error("Failed to update row:", error)
        return { success: false, error: "Database update failed" } as any
    }
}

async function syncRowToSpecialSheet(rowId: string, combinedData: any, targetSheetId: string, columns: any[], targetSheetName: string) {
    const sheet = await prisma.sheet.findUnique({ where: { id: targetSheetId } })
    if (!sheet) return

    let destinationSheet = await prisma.sheet.findFirst({
        where: { name: targetSheetName, projectId: sheet.projectId }
    })

    // Fallback for CGM PTS/PST if specifically requested
    if (!destinationSheet && targetSheetName === 'CGM PTS') {
        destinationSheet = await prisma.sheet.findFirst({
            where: { name: 'CGM PST', projectId: sheet.projectId }
        })
    }

    if (destinationSheet) {
        const destColumns = await prisma.column.findMany({ where: { sheetId: destinationSheet.id } })
        const newRowData: any = {}

        const nameMapping: Record<string, string> = {
            'patient name': 'name',
            'dos': 'date of appointment',
            'complete': 'completed',
            'has voice record': 'voice record',
            'tracking': 'tracking number',
            'tracking status': 'delivery status',
            'dr name': 'dr name',
            'npi number': 'dr npi number',
            'notes': 'notes',
            'delivered date': 'delivered date'
        }

        for (const sourceCol of columns) {
            const sourceNameLower = sourceCol.name.toLowerCase()
            const targetName = nameMapping[sourceNameLower] || sourceNameLower
            const targetCol = destColumns.find(c => c.name.toLowerCase() === targetName)

            if (targetCol && combinedData[sourceCol.id] !== undefined) {
                newRowData[targetCol.id] = combinedData[sourceCol.id]
            }
        }

        const deliveredDateCol = destColumns.find(c => c.name.toLowerCase() === 'delivered date')
        const refillDueCol = destColumns.find(c => c.name.toLowerCase() === 'refill due')
        if (deliveredDateCol && refillDueCol && newRowData[deliveredDateCol.id]) {
            try {
                const date = new Date(newRowData[deliveredDateCol.id])
                if (!isNaN(date.getTime())) {
                    date.setDate(date.getDate() + 30)
                    newRowData[refillDueCol.id] = date.toISOString().split('T')[0]
                } else {
                    newRowData[refillDueCol.id] = newRowData[deliveredDateCol.id]
                }
            } catch (e) {
                newRowData[refillDueCol.id] = newRowData[deliveredDateCol.id]
            }
        }

        const patientNameCol = destColumns.find(c => c.name.toLowerCase() === 'name')
        let shouldCreate = true
        if (patientNameCol && newRowData[patientNameCol.id]) {
            const destRows = await prisma.row.findMany({ where: { sheetId: destinationSheet.id } })
            const isDuplicate = destRows.some(r => {
                const rData = (r.data as any) || {}
                return rData[patientNameCol.id] === newRowData[patientNameCol.id]
            })
            if (isDuplicate) shouldCreate = false
        }

        if (shouldCreate) {
            await prisma.row.create({
                data: { sheetId: destinationSheet.id, data: newRowData, order: 0 }
            })
        }
    }
}

export async function bulkMoveToSpecialSheet(sheetId: string, rowIds: string[], targetSheetName: string) {
    try {
        const columns = await prisma.column.findMany({ where: { sheetId } })
        const productTypeCol = columns.find(c =>
            ['product type', 'product', 'item'].includes(c.name.toLowerCase())
        )

        if (!productTypeCol) return { success: false, error: "Product Type column not found" }

        for (const rowId of rowIds) {
            const row = await prisma.row.findUnique({ where: { id: rowId } })
            if (!row) continue

            const currentData = row.data as any || {}
            // Normalize "CGM PTS" for the column value if needed, or use the exact sheet name
            const val = targetSheetName === 'CGM PTS' ? 'CGM PTS' : 'BRX PTs'
            const newData = { ...currentData, [productTypeCol.id]: val }

            await prisma.row.update({
                where: { id: rowId },
                data: { data: newData }
            })

            await syncRowToSpecialSheet(rowId, newData, sheetId, columns, targetSheetName)
        }

        revalidatePath("/projects/[projectId]", "layout")
        return { success: true }
    } catch (error) {
        console.error(`Bulk move to ${targetSheetName} failed:`, error)
        return { success: false, error: (error as Error).message }
    }
}

export async function bulkMoveToCgmPts(sheetId: string, rowIds: string[]) {
    return bulkMoveToSpecialSheet(sheetId, rowIds, 'CGM PTS')
}

export async function bulkMoveToBrxPts(sheetId: string, rowIds: string[]) {
    return bulkMoveToSpecialSheet(sheetId, rowIds, 'BRX PTs')
}

export async function createRow(sheetId: string, initialData: any = {}) {
    try {
        const row = await prisma.row.create({ data: { sheetId, data: initialData, order: 0 } })
        revalidatePath("/projects/[projectId]")
        return { success: true, row }
    } catch (error) {
        console.error("Failed to create row:", error)
        return { success: false } as any
    }
}

export async function bulkCreateRows(sheetId: string, rowsData: any[]) {
    try {
        console.log(`Starting bulk import of ${rowsData.length} rows for sheet ${sheetId}`)

        const result = await prisma.row.createMany({
            data: rowsData.map((data, index) => ({
                sheetId,
                data: data as any,
                order: index
            }))
        })

        console.log(`Successfully imported ${result.count} rows`)
        revalidatePath("/projects/[projectId]", "layout")
        return { success: true, count: result.count }
    } catch (error) {
        console.error("CRITICAL: Bulk creation failed:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Bulk creation failed"
        }
    }
}

export async function deleteRows(rowIds: string[]) {
    try {
        await prisma.row.deleteMany({
            where: {
                id: { in: rowIds }
            }
        })
        revalidatePath("/projects/[projectId]", "layout")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete rows:", error)
        return { success: false, error: "Deletion failed" }
    }
}
