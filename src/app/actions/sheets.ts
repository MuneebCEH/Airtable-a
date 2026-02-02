"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSheets(projectId: string) {
    if (!projectId) return []
    try {
        const sheets = await prisma.sheet.findMany({
            where: { projectId },
            include: { columns: true },
            orderBy: { order: 'asc' }
        })
        return sheets
    } catch (error) {
        console.error("Failed to fetch sheets:", error)
        return []
    }
}

export async function createSheet(projectId: string) {
    if (!projectId) return { error: "Project ID required" }

    // 1. Get current sheets to determine order/name
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { sheets: true }
    })

    if (!project) return { error: "Project not found" }

    const newOrder = project.sheets.length
    const nextNum = project.sheets.length + 1
    const name = `Table ${nextNum}`

    // 2. Create Sheet
    const sheet = await prisma.sheet.create({
        data: {
            projectId,
            name,
            order: newOrder,
            columns: {
                create: [
                    { name: "Name", type: "TEXT", order: 0, width: 200 },
                    { name: "Notes", type: "LONG_TEXT", order: 1, width: 300 },
                    { name: "Status", type: "SELECT", order: 2, width: 150, options: ["Todo", "In Progress", "Done"] }
                ]
            }
        }
    })

    revalidatePath(`/projects/${projectId}`)
    return { success: true, sheetId: sheet.id }
}

export async function renameSheet(sheetId: string, newName: string) {
    const sheet = await prisma.sheet.update({
        where: { id: sheetId },
        data: { name: newName },
        select: { projectId: true }
    })
    revalidatePath(`/projects/${sheet.projectId}`)
    return { success: true }
}

export async function deleteSheet(sheetId: string) {
    // Check if it's the last sheet? Maybe prevent deleting last sheet?
    // For now, allow deletion.
    const sheet = await prisma.sheet.delete({
        where: { id: sheetId },
        select: { projectId: true }
    })
    revalidatePath(`/projects/${sheet.projectId}`)
    return { success: true, projectId: sheet.projectId }
}
