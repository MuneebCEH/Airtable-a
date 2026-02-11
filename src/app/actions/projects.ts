"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getProjects() {
    const session = await getServerSession(authOptions)
    // In real app, filter by workspace or user
    // For now try to fetch, if DB fails (which it will), return empty array or mock
    try {
        const projects = await prisma.project.findMany({
            include: {
                workspace: true,
                _count: {
                    select: { sheets: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        return projects
    } catch (error) {
        console.error("Failed to fetch projects (DB likely not ready):", error)
        return []
    }
}

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    // Find or create a default workspace
    let workspaceId = "default-workspace-id"
    try {
        const workspace = await prisma.workspace.findFirst()
        if (workspace) {
            workspaceId = workspace.id
        } else {
            const newWs = await prisma.workspace.create({
                data: { name: "Default Workspace" }
            })
            workspaceId = newWs.id
        }
    } catch (e) {
        console.error("Workspace init failed:", e)
        throw new Error("Database connection failed")
    }

    // Create Project with Full Template
    const project = await prisma.project.create({
        data: {
            name,
            description,
            workspaceId,
            sheets: {
                create: [
                    {
                        name: "Patients",
                        order: 0,
                        columns: {
                            create: [
                                { name: "Patient Name", type: "TEXT", order: 0, width: 200 },
                                { name: "DOS", type: "DATE", order: 1, width: 120 },
                                { name: "Returned", type: "CHECKBOX", order: 2, width: 100 },
                                { name: "Complete", type: "CHECKBOX", order: 3, width: 100 },
                                { name: "Packing Slip", type: "CHECKBOX", order: 4, width: 100 },
                                { name: "Has Voice Record", type: "CHECKBOX", order: 5, width: 130 },
                                { name: "RX", type: "CHECKBOX", order: 6, width: 80 },
                                { name: "Clinical Notes", type: "CHECKBOX", order: 7, width: 120 },
                                { name: "Same/Similar", type: "CHECKBOX", order: 8, width: 120 },
                                { name: "POD", type: "CHECKBOX", order: 9, width: 80 },
                                { name: "Attachments", type: "FILE", order: 10, width: 150 },
                                { name: "Tracking", type: "TEXT", order: 11, width: 150 },
                                { name: "Tracking Status", type: "SELECT", order: 12, width: 150, options: ["Delivered", "In Transit", "Pending", "Exception", "Label Created"] },
                                { name: "Delivered Date", type: "DATE", order: 13, width: 130 },
                                { name: "Notes", type: "LONG_TEXT", order: 14, width: 250 },
                                { name: "Address", type: "TEXT", order: 15, width: 200 },
                                { name: "City", type: "TEXT", order: 16, width: 150 },
                                { name: "State", type: "TEXT", order: 17, width: 100 },
                                { name: "Zip", type: "TEXT", order: 18, width: 100 },
                                { name: "DOB", type: "DATE", order: 19, width: 120 },
                                { name: "Patient ID", type: "TEXT", order: 20, width: 120 },
                                { name: "Item", type: "TEXT", order: 21, width: 150 },
                                { name: "Product Type", type: "TEXT", order: 22, width: 150 },
                                { name: "Product", type: "SELECT", order: 23, width: 150, options: ["L0457", "L1833", "L1906", "L3170"] },
                                { name: "Billed", type: "CHECKBOX", order: 24, width: 100 },
                                { name: "Paid", type: "CURRENCY", order: 25, width: 130 },
                                { name: "Amount", type: "CURRENCY", order: 26, width: 130 },
                                { name: "Secondary Pay", type: "CURRENCY", order: 27, width: 140 },
                                { name: "Deductible", type: "CURRENCY", order: 28, width: 130 },
                                { name: "Billing Notes", type: "LONG_TEXT", order: 29, width: 250 },
                                { name: "Reversal Needed", type: "CHECKBOX", order: 30, width: 140 },
                                { name: "Method", type: "TEXT", order: 31, width: 120 },
                                { name: "Completed", type: "CHECKBOX", order: 32, width: 100 },
                                { name: "Reversal Form", type: "FILE", order: 33, width: 150 },
                                { name: "Last Modified", type: "DATE", order: 34, width: 160 },
                                { name: "Last Modified By", type: "USER", order: 35, width: 160 },
                                { name: "Reason for Return", type: "SELECT", order: 36, width: 180, options: ["BAD STATE", "SNS FAILED", "No Answer"] },
                                { name: "Summary (State)", type: "TEXT", order: 37, width: 300 },
                                { name: "Refill Due", type: "DATE", order: 38, width: 130 }
                            ]
                        }
                    },
                    { name: "MED-B - Call Log", order: 1 },
                    {
                        name: "CGM PTS",
                        order: 2,
                        columns: {
                            create: [
                                { name: "Name", type: "TEXT", order: 0, width: 150 },
                                { name: "Date in Dropbox", type: "DATE", order: 1, width: 150 },
                                { name: "Completed", type: "CHECKBOX", order: 2, width: 150 },
                                { name: "Voice Record", type: "CHECKBOX", order: 3, width: 150 },
                                { name: "Clinical Notes", type: "CHECKBOX", order: 4, width: 150 },
                                { name: "RX", type: "CHECKBOX", order: 5, width: 150 },
                                { name: "No Match", type: "CHECKBOX", order: 6, width: 150 },
                                { name: "Packing Slip", type: "CHECKBOX", order: 7, width: 150 },
                                { name: "POD", type: "CHECKBOX", order: 8, width: 150 },
                                { name: "Notes", type: "LONG_TEXT", order: 9, width: 150 },
                                { name: "Tracking Number", type: "TEXT", order: 10, width: 150 },
                                { name: "Delivery Status", type: "SELECT", order: 11, width: 150, options: ["Delivered", "In Transit", "Pending", "Exception", "Label Created"] },
                                { name: "Delivered Date", type: "DATE", order: 12, width: 150 },
                                { name: "Refill Due", type: "DATE", order: 13, width: 150 },
                                { name: "Attachments", type: "FILE", order: 14, width: 150 },
                                { name: "Returned", type: "CHECKBOX", order: 15, width: 150 },
                                { name: "Medicare ID", type: "TEXT", order: 16, width: 150 },
                                { name: "DOB", type: "DATE", order: 17, width: 150 },
                                { name: "Address", type: "TEXT", order: 18, width: 150 },
                                { name: "City", type: "TEXT", order: 19, width: 150 },
                                { name: "State", type: "TEXT", order: 20, width: 150 },
                                { name: "Zip Code", type: "TEXT", order: 21, width: 150 }
                            ]
                        }
                    },
                    {
                        name: "BRX PTs",
                        order: 3,
                        columns: {
                            create: [
                                { name: "Name", type: "TEXT", order: 0, width: 150 },
                                { name: "Date in Dropbox", type: "DATE", order: 1, width: 150 },
                                { name: "Completed", type: "CHECKBOX", order: 2, width: 150 },
                                { name: "Voice Record", type: "CHECKBOX", order: 3, width: 150 },
                                { name: "Clinical Notes", type: "CHECKBOX", order: 4, width: 150 },
                                { name: "RX", type: "CHECKBOX", order: 5, width: 150 },
                                { name: "No Match", type: "CHECKBOX", order: 6, width: 150 },
                                { name: "Packing Slip", type: "CHECKBOX", order: 7, width: 150 },
                                { name: "POD", type: "CHECKBOX", order: 8, width: 150 },
                                { name: "Notes", type: "LONG_TEXT", order: 9, width: 150 },
                                { name: "Tracking Number", type: "TEXT", order: 10, width: 150 },
                                { name: "Delivery Status", type: "SELECT", order: 11, width: 150, options: ["Delivered", "In Transit", "Pending", "Exception", "Label Created"] },
                                { name: "Delivered Date", type: "DATE", order: 12, width: 150 },
                                { name: "Refill Due", type: "DATE", order: 13, width: 150 },
                                { name: "Attachments", type: "FILE", order: 14, width: 150 },
                                { name: "Returned", type: "CHECKBOX", order: 15, width: 150 },
                                { name: "Medicare ID", type: "TEXT", order: 16, width: 150 },
                                { name: "DOB", type: "DATE", order: 17, width: 150 },
                                { name: "Address", type: "TEXT", order: 18, width: 150 },
                                { name: "City", type: "TEXT", order: 19, width: 150 },
                                { name: "State", type: "TEXT", order: 20, width: 150 },
                                { name: "Zip Code", type: "TEXT", order: 21, width: 150 }
                            ]
                        }
                    },
                    { name: "Audits Records Request", order: 4 },
                    { name: "EOBs", order: 5 },
                    { name: "EOB Denial", order: 6 },
                    { name: "Overpayment", order: 7 },
                    { name: "Complaint Log", order: 8 },
                    { name: "CGM-Upcoming Orders", order: 9 },
                    { name: "CGM - Call Log", order: 10 },
                    { name: "Questions Pending Answers", order: 11 }
                ]
            }
        }
    })

    // Populate "Patients" sheet with Mock Data
    const patientsSheet = await prisma.sheet.findFirst({
        where: { projectId: project.id, name: "Patients" },
        include: { columns: true }
    })

    if (patientsSheet) {
        const colMap = patientsSheet.columns.reduce((acc, col) => ({ ...acc, [col.name]: col.id }), {} as Record<string, string>)

        // Use a loop to create multiple sample rows (e.g., 20 rows)
        const sampleRowsData = Array.from({ length: 20 }).map((_, i) => ({
            sheetId: patientsSheet.id,
            order: i,
            data: {
                [colMap['Patient ID']]: `PT-${1000 + i}`,
                [colMap['Patient Name']]: `Patient ${i + 1} Doe`,
                [colMap['DOB']]: new Date(1975 + (i % 45), i % 12, (i % 28) + 1).toISOString().split('T')[0],
                [colMap['Returned']]: i % 2 === 0,
                [colMap['Complete']]: i % 4 === 0,
                [colMap['Notes']]: "Patient reports mild symptoms. Recommended follow up.",
                [colMap['Amount']]: (i * 50.25 + 100).toFixed(2),
                [colMap['Product']]: i % 3 === 0 ? "L0457" : i % 3 === 1 ? "L1833" : "L1906",
                [colMap['Billed']]: i % 2 === 0
            }
        }))

        for (const rowData of sampleRowsData) {
            await prisma.row.create({ data: rowData })
        }
    }

    revalidatePath("/projects")
    redirect(`/projects/${project.id}`)
}
