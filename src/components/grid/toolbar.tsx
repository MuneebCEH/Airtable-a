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
    ArrowRightCircle
} from "lucide-react"
import Papa from "papaparse"
import { bulkCreateRows, deleteRows, bulkMoveToCgmPts, bulkMoveToBrxPts } from "@/app/actions/rows"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { useRouter } from "next/navigation"

interface GridToolbarProps {
    columns: any[]
    rows: any[]
    sheetId: string
    isSelectionMode: boolean
    onToggleSelectionMode: () => void
    selectedRowIds: string[]
}

export function GridToolbar({ columns, rows, sheetId, isSelectionMode, onToggleSelectionMode, selectedRowIds }: GridToolbarProps) {
    const router = useRouter()
    const fileInputRef = React.useRef<HTMLInputElement>(null)

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
        <div className="flex items-center justify-between p-2 border-b bg-background">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border rounded-md px-2 py-1 bg-muted/20">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        className="h-6 w-40 border-none shadow-none focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground"
                        placeholder="Find in view..."
                    />
                </div>

                <Button variant="outline" size="sm" className="h-8 gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Sort</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Columns</span>
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant={isSelectionMode ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                        "h-8 gap-2 transition-all",
                        isSelectionMode && "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 shadow-sm"
                    )}
                    onClick={onToggleSelectionMode}
                >
                    {isSelectionMode ? <CheckCircle2 className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
                    {isSelectionMode ? "Exit Selection" : "Select Bulk"}
                </Button>

                <Button variant="ghost" size="sm" className="h-8">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 transition-all shadow-sm border-amber-200 text-amber-700 font-bold hover:bg-amber-50"
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
                    className="h-8 gap-2 transition-all shadow-sm border-blue-200 text-blue-700 font-bold hover:bg-blue-50"
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
                    variant="destructive"
                    size="sm"
                    className="h-8 gap-2 transition-all shadow-sm text-black font-bold"
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
                    <Trash2 className="h-4 w-4 text-black" />
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

                <Button variant="outline" size="sm" className="h-8" onClick={handleImportClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                </Button>

                <Button variant="outline" size="sm" className="h-8" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>

                <Button size="sm" className="h-8">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Record
                </Button>
            </div>
        </div>
    )
}
