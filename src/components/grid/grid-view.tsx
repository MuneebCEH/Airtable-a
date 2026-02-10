"use client"

import * as React from "react"
import { GridToolbar } from "./toolbar"
import { DataTable } from "./data-table"
import { MOCK_COLUMNS, MOCK_ROWS } from "./mock-data"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    Table as TableIcon,
    List,
    Calendar,
    Layout,
    LayoutDashboard
} from "lucide-react"

import { SheetNavigation } from "./sheet-navigation"

interface GridViewProps {
    project: any // Type this properly with Prisma types if available on client, or custom interface
    sheets: any[]
    columns: any[]
    rows: any[]
    activeSheetId: string
}

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function GridView({ project, sheets, columns, rows, activeSheetId }: GridViewProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Bulk selection state
    const [isSelectionMode, setIsSelectionMode] = React.useState(false)
    const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])

    const handleSheetChange = (sheetId: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("sheetId", sheetId)
        router.push(`${pathname}?${params.toString()}`)
    }

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode)
        setSelectedRowIds([]) // Clear selection when toggling
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Top Level: Sheet Navigation (Tables) */}
            <SheetNavigation
                sheets={sheets}
                activeSheetId={activeSheetId}
                onSheetChange={handleSheetChange}
                projectId={project.id}
            />

            {/* Secondary Level: Toolbar & View Controls */}
            <div className="flex flex-col border-b">
                {/* View Switcher (Grid/Kanban) */}
                <div className="border-b px-4 bg-muted/10">
                    <Tabs defaultValue="grid" className="w-full">
                        <TabsList className="bg-transparent h-10 p-0 justify-start w-full gap-4">
                            <TabsTrigger
                                value="grid"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-semibold rounded-none h-full px-2 gap-2 border-b-2 border-transparent data-[state=active]:border-primary transition-none"
                            >
                                <TableIcon className="h-4 w-4" /> <span className="hidden sm:inline">Grid View</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="kanban"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-semibold rounded-none h-full px-2 gap-2 border-b-2 border-transparent data-[state=active]:border-primary transition-none"
                            >
                                <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">Kanban</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="calendar"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:font-semibold rounded-none h-full px-2 gap-2 border-b-2 border-transparent data-[state=active]:border-primary transition-none"
                            >
                                <Calendar className="h-4 w-4" /> <span className="hidden sm:inline">Calendar</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <GridToolbar
                    columns={columns}
                    rows={rows}
                    sheetId={activeSheetId || ""}
                    isSelectionMode={isSelectionMode}
                    onToggleSelectionMode={toggleSelectionMode}
                    selectedRowIds={selectedRowIds}
                />
            </div>


            <div className="flex-1 overflow-hidden p-0 relative">
                <DataTable
                    columns={columns}
                    data={rows}
                    sheetId={activeSheetId}
                    isSelectionMode={isSelectionMode}
                    selectedRowIds={selectedRowIds}
                    setSelectedRowIds={setSelectedRowIds}
                />
            </div>
        </div>
    )
}
