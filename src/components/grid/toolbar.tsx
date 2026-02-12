"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    ArrowUpDown,
    Settings2,
    Plus,
    Download,
    Share2,
    Upload,
    MoreHorizontal,
    Trash2,
    CheckCircle2,
    ArrowRightCircle,
    Eye,
    EyeOff,
    Layers
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { SortingState, VisibilityState } from "@tanstack/react-table"
import Papa from "papaparse"
import { bulkCreateRows, deleteRows, bulkMoveToCgmPts, bulkMoveToBrxPts } from "@/app/actions/rows"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"
import { NewRecordModal } from "./new-record-modal"

interface GridToolbarProps {
    columns: any[]
    rows: any[]
    sheetId: string
    isSelectionMode: boolean
    onToggleSelectionMode: () => void
    selectedRowIds: string[]
    globalFilter: string
    setGlobalFilter: (val: string) => void
    columnVisibility: VisibilityState
    setColumnVisibility: (val: VisibilityState) => void
    sorting: SortingState
    setSorting: (val: any) => void
    grouping: any[]
    setGrouping: (val: any) => void
}

export function GridToolbar({
    columns,
    rows,
    sheetId,
    isSelectionMode,
    onToggleSelectionMode,
    selectedRowIds,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    sorting,
    setSorting,
    grouping,
    setGrouping
}: GridToolbarProps) {
    const router = useRouter()
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

    const handleDelete = async () => {
        if (selectedRowIds.length === 0) return

        if (confirm(`Are you sure you want to delete ${selectedRowIds.length} records?`)) {
            const loading = toast.loading(`Deleting ${selectedRowIds.length} records...`)
            const res = await deleteRows(selectedRowIds)
            if (res.success) {
                toast.success("Successfully deleted records", { id: loading })
                onToggleSelectionMode() // Exit selection mode
                router.refresh()
            } else {
                toast.error("Failed to delete records", { id: loading })
            }
        }
    }

    const handleMoveToCgmPts = async () => {
        if (selectedRowIds.length === 0) return

        const loading = toast.loading(`Moving ${selectedRowIds.length} records to CGM PTS...`)
        const res = await bulkMoveToCgmPts(sheetId, selectedRowIds)

        if (res.success) {
            toast.success("Successfully moved records to CGM PTS", { id: loading })
            onToggleSelectionMode()
            router.refresh()
        } else {
            toast.error("Move failed: " + (res.error || "Unknown error"), { id: loading })
        }
    }

    const handleMoveToBrxPts = async () => {
        if (selectedRowIds.length === 0) return

        const loading = toast.loading(`Moving ${selectedRowIds.length} records to BRX PTs...`)
        const res = await bulkMoveToBrxPts(sheetId, selectedRowIds)

        if (res.success) {
            toast.success("Successfully moved records to BRX PTs", { id: loading })
            onToggleSelectionMode()
            router.refresh()
        } else {
            toast.error("Move failed: " + (res.error || "Unknown error"), { id: loading })
        }
    }

    const handleExport = () => {
        if (!rows || rows.length === 0) {
            toast.error("No data to export")
            return
        }

        // Prepare data for export: Map column IDs back to names
        const exportData = rows.map(row => {
            const rowData: any = {}
            columns.forEach(col => {
                rowData[col.name] = row[col.id] || ""
            })
            return rowData
        })

        const csv = Papa.unparse(exportData)
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `export_${sheetId}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Data exported successfully")
    }

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const loadingToast = toast.loading("Parsing CSV and importing data...")

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const importedData = results.data as any[]

                    if (importedData.length === 0) {
                        toast.error("No data found in CSV", { id: loadingToast })
                        return
                    }

                    // Map CSV headers to column IDs based on names (more robust trim/lowercase)
                    const colMap: Record<string, string> = {}
                    columns.forEach(col => {
                        const normalizedName = col.name.toLowerCase().replace(/[^a-z0-9]/g, '')
                        colMap[normalizedName] = col.id
                    })

                    const rowsToCreate = importedData.map(csvRow => {
                        const rowData: any = {}
                        Object.keys(csvRow).forEach(key => {
                            const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
                            const colId = colMap[normalizedKey]
                            if (colId) {
                                rowData[colId] = csvRow[key]
                            }
                        })
                        return rowData
                    })

                    console.log("Sending rows to server:", rowsToCreate.length)
                    const res = await bulkCreateRows(sheetId, rowsToCreate)

                    if (res.success) {
                        toast.success(`Successfully imported ${res.count} records`, { id: loadingToast })
                        // Force a refresh to show new data immediately
                        router.refresh()
                    } else {
                        toast.error("Failed to import: " + (res.error || "Unknown error"), { id: loadingToast })
                    }
                } catch (err) {
                    console.error("Import process error:", err)
                    toast.error("An error occurred during import", { id: loadingToast })
                }
            },
            error: (err) => {
                toast.error("CSV Parse Error: " + err.message, { id: loadingToast })
            }
        })

        // Reset input so the same file can be picked again
        if (event.target) event.target.value = ""
    }

    return (
        <div className="flex items-center justify-between p-1 px-4 border-b bg-white">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border border-slate-200 rounded px-2 h-7 bg-slate-50 transition-colors focus-within:bg-white focus-within:border-slate-400">
                    <Search className="h-3.5 w-3.5 text-slate-400" />
                    <Input
                        className="h-full w-40 border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-slate-400 text-[11px]"
                        placeholder="Find in view..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-slate-600 hover:bg-slate-100">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Filter</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white">
                        <DropdownMenuLabel className="text-xs">Filter records</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-2 text-xs text-muted-foreground italic">
                            Column filtering is active in search. Advanced filters coming soon.
                        </div>
                        {globalFilter && (
                            <DropdownMenuItem onClick={() => setGlobalFilter("")} className="text-xs text-amber-600 font-medium">
                                Clear Search
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-slate-600 hover:bg-slate-100">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Sort</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white">
                        <DropdownMenuLabel className="text-xs">Sort by Column</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={sorting[0]?.id}
                            onValueChange={(val) => setSorting([{ id: val, desc: false }])}
                        >
                            <DropdownMenuRadioItem value="" className="text-xs">Default (Recent)</DropdownMenuRadioItem>
                            {columns.slice(0, 8).map(col => (
                                <DropdownMenuRadioItem key={col.id} value={col.id} className="text-xs">
                                    {col.name}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "h-7 gap-1.5 px-2 text-slate-600 hover:bg-slate-100",
                                grouping.length > 0 && "text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                            )}
                        >
                            <Layers className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Group</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white">
                        <DropdownMenuLabel className="text-xs">Group by Column</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={grouping[0]}
                            onValueChange={(val) => setGrouping(val ? [val] : [])}
                        >
                            <DropdownMenuRadioItem value="" className="text-xs">No Grouping</DropdownMenuRadioItem>
                            {columns.filter(col => col.type !== 'FILE').slice(0, 12).map(col => (
                                <DropdownMenuRadioItem key={col.id} value={col.id} className="text-xs">
                                    {col.name}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-slate-600 hover:bg-slate-100">
                            <Settings2 className="h-3.5 w-3.5" />
                            <span className="text-[11px] font-medium">Hide Fields</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-white">
                        <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {columns.map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize text-xs"
                                checked={columnVisibility[column.id] !== false}
                                onCheckedChange={(value) =>
                                    setColumnVisibility({
                                        ...columnVisibility,
                                        [column.id]: !!value,
                                    })
                                }
                            >
                                {column.name}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant={isSelectionMode ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-7 gap-1.5 text-slate-600",
                        isSelectionMode && "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
                    )}
                    onClick={onToggleSelectionMode}
                >
                    {isSelectionMode ? <CheckCircle2 className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
                    {isSelectionMode ? "Exit Selection" : "Select Bulk"}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-slate-600 px-2"
                >
                    <Share2 className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-[11px]">Share</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-[11px]"
                    onClick={() => {
                        if (!isSelectionMode) {
                            onToggleSelectionMode()
                        } else if (selectedRowIds.length > 0) {
                            handleMoveToCgmPts()
                        } else {
                            toast.info("Select rows to move to CGM PTS")
                        }
                    }}
                >
                    <ArrowRightCircle className="h-4 w-4" />
                    CGM PST {selectedRowIds.length > 0 ? `(${selectedRowIds.length})` : ""}
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-[11px]"
                    onClick={() => {
                        if (!isSelectionMode) {
                            onToggleSelectionMode()
                        } else if (selectedRowIds.length > 0) {
                            handleMoveToBrxPts()
                        } else {
                            toast.info("Select rows to move to BRX PTs")
                        }
                    }}
                >
                    <ArrowRightCircle className="h-4 w-4 text-blue-500" />
                    BRX PTs {selectedRowIds.length > 0 ? `(${selectedRowIds.length})` : ""}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-[11px]"
                    onClick={() => {
                        if (!isSelectionMode) {
                            onToggleSelectionMode()
                        } else if (selectedRowIds.length > 0) {
                            handleDelete()
                        } else {
                            toast.info("Select rows to delete")
                        }
                    }}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete {selectedRowIds.length > 0 ? `(${selectedRowIds.length})` : ""}
                </Button>

                {/* Import/Export Section */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                />

                <Button variant="ghost" size="sm" className="h-7 text-slate-600 px-2" onClick={handleImportClick}>
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-[11px]">Import</span>
                </Button>

                <Button variant="ghost" size="sm" className="h-7 text-slate-600 px-2" onClick={handleExport}>
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-[11px]">Export</span>
                </Button>

                <Button size="sm" className="h-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] px-3 shadow-sm rounded ml-2" onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Record
                </Button>
            </div>

            <NewRecordModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                columns={columns}
                sheetId={sheetId}
            />
        </div>
    )
}
