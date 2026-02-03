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
            // --- SYNC END ---

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

                                // Populate Notes with the AI analysis
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
            // --- ATTACHMENT PROCESSING END ---

            // --- SYNC TO CGM PTS START ---
            const productTypeCol = columns.find(c => c.name.toLowerCase() === 'product type')
            const selection = productTypeCol ? data[productTypeCol.id] : null

            if ((selection === 'CGM PTS' || selection === 'CGM PST') && !rowId.startsWith("ghost-")) {
                const sheet = await prisma.sheet.findUnique({ where: { id: targetSheetId } })
                if (sheet && sheet.name === 'Patients') {
                    const existingRow = await prisma.row.findUnique({ where: { id: rowId } })
                    const prevData = (existingRow?.data as any) || {}

                    if (prevData[productTypeCol!.id] !== selection) {
                        let cgmSheet = await prisma.sheet.findFirst({
                            where: { name: 'CGM PTS', projectId: sheet.projectId }
                        })
                        if (!cgmSheet) {
                            cgmSheet = await prisma.sheet.findFirst({
                                where: { name: 'CGM PST', projectId: sheet.projectId }
                            })
                        }

                        if (cgmSheet) {
                            const cgmColumns = await prisma.column.findMany({ where: { sheetId: cgmSheet.id } })
                            const combinedData = { ...prevData, ...data }
                            const newRowData: any = {}

                            // Map matching columns by name with overrides for existing CGM PTS structure
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
                                const targetCol = cgmColumns.find(c => c.name.toLowerCase() === targetName)

                                if (targetCol && combinedData[sourceCol.id] !== undefined) {
                                    newRowData[targetCol.id] = combinedData[sourceCol.id]
                                }
                            }

                            // Sync Delivered Date to Refill Due
                            const deliveredDateCol = cgmColumns.find(c => c.name.toLowerCase() === 'delivered date')
                            const refillDueCol = cgmColumns.find(c => c.name.toLowerCase() === 'refill due')
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

                            // Prevent duplicate sync for same patient name (Check 'Name' column)
                            const patientNameCol = cgmColumns.find(c => c.name.toLowerCase() === 'name')
                            let shouldCreate = true
                            if (patientNameCol && newRowData[patientNameCol.id]) {
                                const cgmRows = await prisma.row.findMany({ where: { sheetId: cgmSheet.id } })
                                const isDuplicate = cgmRows.some(r => {
                                    const rData = (r.data as any) || {}
                                    return rData[patientNameCol.id] === newRowData[patientNameCol.id]
                                })
                                if (isDuplicate) shouldCreate = false
                            }

                            if (shouldCreate) {
                                await prisma.row.create({
                                    data: { sheetId: cgmSheet.id, data: newRowData, order: 0 }
                                })
                            }
                        }
                    }
                }
            }
            // --- SYNC TO CGM PTS END ---
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

        // Return with AI Analysis metadata if present (stripped from saved data)
        const result: any = { success: true, row: updatedRow }
        if ((data as any)._aiAnalysisTemp) result.aiAnalysis = (data as any)._aiAnalysisTemp
        if ((data as any)._aiErrorTemp) {
            result.success = false // or keep true but warn?
            result.isAiError = true
            result.error = (data as any)._aiErrorTemp
        }

        return result
    } catch (error) {
        console.error("Failed to update row:", error)
        return { success: false, error: "Database update failed" } as any
    }
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
