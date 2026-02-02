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
                                { name: "Patient ID", type: "TEXT", order: 0, width: 120 },
                                { name: "Item", type: "SELECT", order: 1, width: 150, options: ["CGM PTS"] },
                                { name: "Patient Name", type: "TEXT", order: 2, width: 200 },
                                { name: "DOB", type: "DATE", order: 3, width: 120 },
                                { name: "Returned", type: "SELECT", order: 4, width: 130, options: ["Yes", "No", "Left Voicemail"] },
                                { name: "Complete", type: "CHECKBOX", order: 5, width: 100 },
                                { name: "Referring Dr", type: "TEXT", order: 6, width: 180 },
                                { name: "New Visit Record", type: "FILE", order: 7, width: 150 },
                                { name: "Clinical Notes", type: "LONG_TEXT", order: 8, width: 300 },
                                { name: "Exam Estimate", type: "CURRENCY", order: 9, width: 140 },
                                { name: "POD", type: "DATE", order: 10, width: 120 },
                                { name: "Attachments", type: "FILE", order: 11, width: 150 },
                                { name: "Tracking", type: "TEXT", order: 12, width: 150 },
                                { name: "Delivered Date", type: "DATE", order: 13, width: 130 },
                                { name: "Notes", type: "LONG_TEXT", order: 14, width: 250 },
                                { name: "Address", type: "TEXT", order: 15, width: 200 },
                                { name: "City", type: "TEXT", order: 16, width: 150 },
                                { name: "State", type: "TEXT", order: 17, width: 100 },
                                { name: "Zip", type: "TEXT", order: 18, width: 100 },
                                { name: "DOS", type: "DATE", order: 19, width: 120 },
                                { name: "Product", type: "SELECT", order: 20, width: 150, options: ["Product A", "Product B", "Product C"] },
                                { name: "Billed", type: "CURRENCY", order: 21, width: 130 },
                                { name: "Paid", type: "CURRENCY", order: 22, width: 130 },
                                { name: "Amount", type: "CURRENCY", order: 23, width: 130 },
                                { name: "Secondary Pay", type: "CURRENCY", order: 24, width: 140 },
                                { name: "Deductible", type: "CURRENCY", order: 25, width: 130 },
                                { name: "Billing Notes", type: "LONG_TEXT", order: 26, width: 250 },
                                { name: "Removal Needed", type: "CHECKBOX", order: 27, width: 140 },
                                { name: "Verified", type: "CHECKBOX", order: 28, width: 100 },
                                { name: "Completed", type: "CHECKBOX", order: 29, width: 100 },
                                { name: "Removal Form", type: "FILE", order: 30, width: 150 },
                                { name: "Last Modified", type: "DATE", order: 31, width: 160 },
                                { name: "Last Modified By", type: "USER", order: 32, width: 160 },
                                { name: "Reason for Review", type: "SELECT", order: 33, width: 180, options: ["Audit", "Dispute", "Routine"] },
                                { name: "Summary (Tasks)", type: "LONG_TEXT", order: 34, width: 300 }
                            ]
                        }
                    },
                    { name: "MED-B - Call Log", order: 1 },
                    {
                        name: "CGM PTS",
                        order: 2,
                        columns: {
                            create: [
                                { name: "Name", type: "TEXT", order: 0, width: 200 },
                                { name: "Date in Dropbox", type: "DATE", order: 1, width: 150 },
                                { name: "Completed", type: "CHECKBOX", order: 2, width: 100 },
                                { name: "Voice Record", type: "CHECKBOX", order: 3, width: 120 },
                                { name: "Clinical Notes", type: "CHECKBOX", order: 4, width: 130 },
                                { name: "RX", type: "CHECKBOX", order: 5, width: 80 },
                                { name: "No Match", type: "CHECKBOX", order: 6, width: 100 },
                                { name: "Packing Slip", type: "CHECKBOX", order: 7, width: 120 },
                                { name: "POD", type: "CHECKBOX", order: 8, width: 80 },
                                { name: "notes", type: "LONG_TEXT", order: 9, width: 250 },
                                { name: "Tracking Number", type: "TEXT", order: 10, width: 180 },
                                { name: "Delivery Status", type: "TEXT", order: 11, width: 150 },
                                { name: "Attachments", type: "FILE", order: 12, width: 150 },
                                { name: "Returned", type: "CHECKBOX", order: 13, width: 100 },
                                { name: "Medicare ID", type: "TEXT", order: 14, width: 150 },
                                { name: "DOB", type: "DATE", order: 15, width: 120 },
                                { name: "Phone", type: "TEXT", order: 16, width: 140 },
                                { name: "Address", type: "TEXT", order: 17, width: 200 },
                                { name: "City", type: "TEXT", order: 18, width: 150 },
                                { name: "State", type: "TEXT", order: 19, width: 80 },
                                { name: "Zip Code", type: "TEXT", order: 20, width: 100 },
                                { name: "DR NAME", type: "TEXT", order: 21, width: 180 },
                                { name: "DR NPI NUMBER", type: "TEXT", order: 22, width: 150 },
                                { name: "Date of Appointment", type: "DATE", order: 23, width: 150 },
                                { name: "DEVICE TYPE", type: "SELECT", order: 24, width: 150, options: ["Freestyle Libre 2", "Dexcom", "Freestyle 2"] },
                                { name: "Refill Due", type: "DATE", order: 25, width: 120 },
                                { name: "RX Expires", type: "DATE", order: 26, width: 120 },
                                { name: "Welcome Call Date", type: "DATE", order: 27, width: 150 },
                                { name: "Satisfaction", type: "TEXT", order: 28, width: 150 },
                                { name: "Notes IBP", type: "LONG_TEXT", order: 29, width: 200 },
                                { name: "Notes Delta", type: "LONG_TEXT", order: 30, width: 200 },
                                { name: "JULY TRACKING", type: "TEXT", order: 31, width: 180 },
                                { name: "JULY RECEIVED DATE", type: "DATE", order: 32, width: 150 },
                                { name: "AUG TRACKING", type: "TEXT", order: 33, width: 180 },
                                { name: "AUG RECEIVED DATE", type: "DATE", order: 34, width: 150 },
                                { name: "SEPT TRACKING", type: "TEXT", order: 35, width: 180 },
                                { name: "SEPT RECEIVED DATE", type: "DATE", order: 36, width: 150 },
                                { name: "OCT TRACKING", type: "TEXT", order: 37, width: 180 },
                                { name: "OCT RECEIVED DATE", type: "DATE", order: 38, width: 150 },
                                { name: "NOV TRACKING", type: "TEXT", order: 39, width: 180 },
                                { name: "NOV RECEIVED DATE", type: "DATE", order: 40, width: 150 },
                                { name: "DEC TRACKING", type: "TEXT", order: 41, width: 180 },
                                { name: "DEC RECEIVED DATE", type: "DATE", order: 42, width: 150 }
                            ]
                        }
                    },
                    { name: "Audits Records Request", order: 3 },
                    { name: "EOBs", order: 4 },
                    { name: "EOB Denial", order: 5 },
                    { name: "Overpayment", order: 6 },
                    { name: "Complaint Log", order: 7 },
                    { name: "CGM-Upcoming Orders", order: 8 },
                    { name: "CGM - Call Log", order: 9 },
                    { name: "Questions Pending Answers", order: 10 }
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
        // using the same logic as mock-data but adapting to DB structure
        const sampleRowsData = Array.from({ length: 20 }).map((_, i) => ({
            sheetId: patientsSheet.id,
            order: i,
            data: {
                [colMap['Patient ID']]: `PT-${1000 + i}`,
                [colMap['Patient Name']]: `Patient ${i + 1} Doe`,
                [colMap['DOB']]: new Date(1975 + (i % 45), i % 12, (i % 28) + 1).toISOString().split('T')[0],
                [colMap['Returned']]: i % 3 === 0 ? "Yes" : i % 3 === 1 ? "No" : "Left Voicemail",
                [colMap['Complete']]: i % 4 === 0,
                [colMap['Referring Dr']]: `Dr. Smith ${i}`,
                // ... other fields as needed for initial view
                [colMap['Clinical Notes']]: "Patient reports mild symptoms. Recommended follow up.",
                [colMap['Exam Estimate']]: (i * 50.25 + 100).toFixed(2),
                [colMap['Product']]: i % 3 === 0 ? "Product A" : i % 3 === 1 ? "Product B" : "Product C",
                [colMap['Billed']]: (i * 200.00).toFixed(2)
            }
        }))

        // Use transaction or Promise.all for speed, though loop is fine for few rows
        for (const rowData of sampleRowsData) {
            await prisma.row.create({ data: rowData })
        }
    }

    revalidatePath("/projects")
    redirect(`/projects/${project.id}`)
}
