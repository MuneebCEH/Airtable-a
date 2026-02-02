import { GridView } from "@/components/grid/grid-view"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

interface PageProps {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ sheetId?: string }>
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
    const { projectId } = await params
    const { sheetId } = await searchParams

    // 1. Fetch Project and Sheets metadata
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            sheets: {
                orderBy: { order: 'asc' },
                select: { id: true, name: true }
            }
        }
    })

    if (!project) {
        notFound()
    }

    // 2. Determine Active Sheet
    let activeSheetId = sheetId

    // Default to first sheet if none selected
    if (!activeSheetId && project.sheets.length > 0) {
        activeSheetId = project.sheets[0].id
    }

    // 3. Fetch Active Sheet Data (Columns, Rows, Views)
    let activeSheetData = null
    if (activeSheetId) {
        activeSheetData = await prisma.sheet.findUnique({
            where: { id: activeSheetId },
            include: {
                columns: { orderBy: { order: 'asc' } },
                rows: { orderBy: { order: 'asc' } },
                views: { orderBy: { name: 'asc' } } // Fetch views if needed
            }
        })
    }

    // Handle invalid sheetId (redirect to first valid or null)
    if (sheetId && !activeSheetData && project.sheets.length > 0) {
        redirect(`/projects/${projectId}`)
    }

    // 4. Transform Data for Client Component
    const columns = activeSheetData?.columns.map(col => ({
        id: col.id,
        name: col.name,
        type: col.type,
        width: col.width,
        options: col.options
    })) || []

    const rows = activeSheetData?.rows.map(row => ({
        id: row.id,
        ...(row.data as object),
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        lastModifiedById: (row as any).lastModifiedById
    })) || []

    return (
        <div className="h-full flex flex-col">
            <GridView
                project={project}
                sheets={project.sheets}
                activeSheetId={activeSheetId || ""}
                columns={columns}
                rows={rows}
            />
        </div>
    )
}
