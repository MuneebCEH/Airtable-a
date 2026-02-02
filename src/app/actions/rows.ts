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
