"use client"

import * as React from "react"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    flexRender,
    SortingState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
// Import server action
import { uploadFile } from "@/app/actions/upload"
import { updateRowData } from "@/app/actions/rows"
import { renameColumn } from "@/app/actions/sheets"
import { GridColumn, GridRow } from "./types"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Plus,
    ArrowUpDown,
    Calendar as CalendarIcon,
    Check,
    FileText,
    MoreHorizontal,
    Paperclip,
    User,
    File,
    Image as ImageIcon,
    Music,
    Video,
    X,
    FileJson,
    FileCode,
    FileArchive,
    Hash,
    Type,
    ChevronDown,
    CheckSquare,
    Clock,
    UserPlus,
    Hash as AutoNumberIcon,
    Maximize2
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Editable cell renderer
const EditableCell = ({
    getValue,
    row,
    column,
    table,
}: {
    getValue: () => any
    row: any
    column: GridColumn
    table: any
}) => {
    const initialValue = getValue()
    const [value, setValue] = React.useState(initialValue)
    const [isUploading, setIsUploading] = React.useState(false)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

    // Sync with external data changes
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const onBlur = async () => {
        table.options.meta?.updateData(row.index, column.id, value)
    }

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value)
        table.options.meta?.updateData(row.index, column.id, e.target.value)
    }

    const onCheckboxChange = (checked: boolean) => {
        setValue(checked)
        table.options.meta?.updateData(row.index, column.id, checked)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        setIsUploading(true)
        const newFiles = []

        const currentFiles = Array.isArray(value) ? value : []

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i]
            const formData = new FormData()
            formData.append("file", file)

            try {
                const res = await uploadFile(formData)
                if (res.success) {
                    newFiles.push({ name: file.name, path: res.path })
                }
            } catch (error) {
                console.error("Upload failed for", file.name, error)
            }
        }

        const updatedValue = [...currentFiles, ...newFiles]
        setValue(updatedValue)
        table.options.meta?.updateData(row.index, column.id, updatedValue)
        setIsUploading(false)

        // Reset input
        e.target.value = ""
    }

    switch (column.type) {
        case 'CHECKBOX':
            return (
                <div className="flex justify-center w-full h-full items-center">
                    <Checkbox
                        checked={!!value}
                        onCheckedChange={onCheckboxChange}
                        className="h-4 w-4"
                    />
                </div>
            )
        case 'CURRENCY':
            return (
                <div className="flex items-center w-full h-full px-2">
                    <span className="text-muted-foreground mr-1">$</span>
                    <input
                        className="w-full bg-transparent outline-none font-mono text-xs tabular-nums text-right"
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                    />
                </div>
            )
        case 'DATE':
            // Delivered Date is fully automated. Show text only, or empty if null.
            if (column.id === 'deliveredDate' || column.name.toLowerCase() === 'delivered date' || column.name.toLowerCase() === 'refill due') {
                return (
                    <div className="flex items-center w-full h-full px-2 text-xs text-slate-700">
                        {value ? (value as string) : ""}
                    </div>
                )
            }

            return (
                <div className="relative w-full h-full flex items-center">
                    <input
                        type="date"
                        className={cn(
                            "w-full bg-transparent outline-none text-xs text-slate-700 px-2 h-full cursor-pointer",
                            !value && "text-transparent" // Hide the dd/mm/yyyy native placeholder
                        )}
                        value={value as string || ""}
                        onChange={(e) => {
                            setValue(e.target.value)
                            table.options.meta?.updateData(row.index, column.id, e.target.value)
                        }}
                    />
                    {!value && (
                        <div className="absolute inset-0 pointer-events-none flex items-center px-2 text-xs text-muted-foreground/0">
                            {/* Empty space */}
                        </div>
                    )}
                </div>
            )
        case 'SELECT':
            // User requested to remove dropdown for tracking status and keep it auto-filled
            if (column.id === 'trackingStatus') {
                return (
                    <div className="flex items-center w-full h-full px-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        {value as string}
                    </div>
                )
            }

            return (
                <select
                    className="w-full h-full bg-transparent outline-none text-xs border-none focus:ring-0 appearance-none pl-1"
                    value={(value as string) || ""}
                    onChange={onSelectChange}
                    style={{ colorScheme: "dark" }}
                >
                    <option value="" disabled className="hidden"></option>
                    {column.options?.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-[#09090b] text-white">{opt}</option>
                    ))}
                </select>
            )
        case 'FILE': {
            const files = Array.isArray(value) ? value : []

            const removeFile = (index: number) => {
                const updatedFiles = [...files]
                updatedFiles.splice(index, 1)
                setValue(updatedFiles)
                table.options.meta?.updateData(row.index, column.id, updatedFiles)
            }

            return (
                <div className="flex items-center gap-1.5 w-full h-full px-2 overflow-x-auto no-scrollbar group/file-cell">
                    {files.map((f: any, i: number) => {
                        const isImage = /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f.name)
                        const isAudio = /\.(mp3|wav|ogg)$/i.test(f.name)
                        const isVideo = /\.(mp4|mov|webm)$/i.test(f.name)
                        const isPdf = /\.pdf$/i.test(f.name)
                        const isArchive = /\.(zip|rar|7z|tar|gz)$/i.test(f.name)
                        const isCode = /\.(js|ts|jsx|tsx|py|go|cpp|c|h|rb|php|html|css|json)$/i.test(f.name)

                        return (
                            <div key={i} className="relative group/thumb shrink-0">
                                <div className="h-7 w-7 rounded-sm border bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                                    {isImage ? (
                                        <img src={f.path} alt={f.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="text-muted-foreground">
                                            {isAudio ? <Music className="h-3.5 w-3.5" /> :
                                                isVideo ? <Video className="h-3.5 w-3.5" /> :
                                                    isPdf ? <FileText className="h-3.5 w-3.5 text-red-500" /> :
                                                        isArchive ? <FileArchive className="h-3.5 w-3.5 text-amber-500" /> :
                                                            isCode ? <FileCode className="h-3.5 w-3.5 text-blue-500" /> :
                                                                <File className="h-3.5 w-3.5" />
                                            }
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(i)
                                    }}
                                    className="absolute -top-1.5 -right-1.5 bg-background border rounded-full p-0.5 shadow-md opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground z-10"
                                >
                                    <X className="h-2 w-2" />
                                </button>
                            </div>
                        )
                    })}
                    <label className="cursor-pointer flex items-center justify-center p-1 hover:bg-muted rounded-md border border-dashed border-muted-foreground/30 min-w-7 h-7 transition-colors">
                        {isUploading ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                        ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground hover:text-amber-600 transition-colors" />
                        )}
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            )
        }
        case 'LONG_TEXT':
            return (
                <div className="relative group/cell w-full h-full flex items-center overflow-hidden">
                    <input
                        className="w-full bg-transparent outline-none px-2 text-sm h-full truncate"
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        onDoubleClick={() => setIsDialogOpen(true)}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsDialogOpen(true)
                        }}
                        className="absolute right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-background/80 backdrop-blur-sm border rounded hover:bg-muted transition-opacity z-10 shadow-sm"
                        title="Expand cell"
                    >
                        <Maximize2 className="h-3 w-3 text-amber-600" />
                    </button>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        if (!open) onBlur()
                        setIsDialogOpen(open)
                    }}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader className="border-b pb-2">
                                <DialogTitle className="flex items-center gap-2 text-amber-700">
                                    <FileText className="h-4 w-4" /> {column.name}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="pt-4">
                                <Textarea
                                    className="min-h-[300px] text-sm leading-relaxed focus-visible:ring-amber-500"
                                    value={value as string}
                                    onChange={(e) => setValue(e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={`Enter ${column.name}...`}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        default:
            return (
                <div className="relative group/cell w-full h-full flex items-center overflow-hidden">
                    <input
                        className="w-full bg-transparent outline-none px-2 text-sm h-full"
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        onDoubleClick={() => setIsDialogOpen(true)}
                    />
                    {typeof value === 'string' && value.length > 20 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsDialogOpen(true)
                            }}
                            className="absolute right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-background/80 backdrop-blur-sm border rounded hover:bg-muted transition-opacity z-10 shadow-sm"
                            title="Expand cell"
                        >
                            <Maximize2 className="h-3 w-3 text-amber-600" />
                        </button>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        if (!open) onBlur()
                        setIsDialogOpen(open)
                    }}>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader className="border-b pb-2">
                                <DialogTitle className="flex items-center gap-2 text-amber-700">
                                    <Type className="h-4 w-4" /> {column.name}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="pt-4">
                                <Textarea
                                    className="min-h-[300px] text-sm leading-relaxed focus-visible:ring-amber-500"
                                    value={value as string}
                                    onChange={(e) => setValue(e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={`Enter ${column.name}...`}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )
    }
}

const ColumnHeader = ({
    column,
    sheetId,
    getColumnIcon
}: {
    column: GridColumn,
    sheetId: string,
    getColumnIcon: (type: string) => React.ReactNode
}) => {
    const [name, setName] = React.useState(column.name)
    const [isEditing, setIsEditing] = React.useState(false)

    // Sync with external name changes
    React.useEffect(() => {
        setName(column.name)
    }, [column.name])

    const handleBlur = async () => {
        setIsEditing(false)
        if (name.trim() && name !== column.name) {
            await renameColumn(column.id, name, sheetId)
        } else {
            setName(column.name)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur()
        }
    }

    return (
        <div className="flex items-center gap-2 overflow-hidden w-full group/header">
            <span className="text-amber-600 shrink-0">{getColumnIcon(column.type)}</span>
            {isEditing ? (
                <input
                    autoFocus
                    className="bg-white text-[11px] font-bold uppercase text-slate-900 outline-none w-full px-1 rounded-sm border border-amber-500 shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span
                    className="text-[11px] font-bold uppercase text-slate-800 truncate tracking-tight cursor-text hover:bg-black/5 px-1 rounded-sm w-full transition-colors"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsEditing(true)
                    }}
                >
                    {name}
                </span>
            )}
        </div>
    )
}

interface DataTableProps {
    columns: GridColumn[]
    data: GridRow[]
    sheetId: string
}

export function DataTable({ columns: initialColumns, data: initialData, sheetId }: DataTableProps) {
    const [data, setData] = React.useState(initialData)
    const [sorting, setSorting] = React.useState<SortingState>([])

    // Ref to track processing rows to avoid double submissions if needed
    // but state update is simple enough

    React.useEffect(() => {
        const MIN_ROWS = 50
        const currentData = [...initialData]
        const check = currentData.length

        if (check < MIN_ROWS) {
            const extraRows = Array.from({ length: MIN_ROWS - check }).map((_, i) => ({
                id: `ghost-${crypto.randomUUID()}-${i}`,
            }))
            setData([...currentData, ...extraRows])
        } else {
            setData(currentData)
        }
    }, [initialData])

    const getColumnIcon = (type: string) => {
        switch (type) {
            case 'TEXT': return <Type className="h-3 w-3" />
            case 'NUMBER': return <Hash className="h-3 w-3" />
            case 'CURRENCY': return <span className="text-[10px] font-bold">$</span>
            case 'DATE': return <CalendarIcon className="h-3 w-3" />
            case 'CHECKBOX': return <CheckSquare className="h-3 w-3" />
            case 'SELECT': return <ChevronDown className="h-3 w-3" />
            case 'FILE': return <Paperclip className="h-3 w-3" />
            case 'LONG_TEXT': return <FileText className="h-3 w-3" />
            case 'USER': return <User className="h-3 w-3" />
            case 'AUTO_NUMBER': return <AutoNumberIcon className="h-3 w-3" />
            default: return null
        }
    }

    // Convert GridColumn to TanStack ColumnDef
    const tableColumns = React.useMemo<ColumnDef<GridRow>[]>(() => {
        return initialColumns.map((col) => ({
            accessorKey: col.id,
            header: ({ column }) => <ColumnHeader column={col} sheetId={sheetId} getColumnIcon={getColumnIcon} />,
            cell: ({ getValue, row, table }) => <EditableCell getValue={getValue} row={row} column={col} table={table} />,
            size: col.width || 150,
        }))
    }, [initialColumns])

    const [aiAnalysisResult, setAiAnalysisResult] = React.useState<string | null>(null)

    const updateData = (rowIndex: number, columnId: string, value: any) => {
        setData((old) => {
            const currentRow = old[rowIndex]
            if (!currentRow) return old

            const rowId = currentRow.id

            // Optimistically update local state first
            const newData = old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex]!,
                        [columnId]: value,
                    }
                }
                return row
            })

            // Trigger server update
            if (rowId) {
                updateRowData(rowId, { [columnId]: value }, sheetId).then(res => {
                    if (res.success && res.row) {
                        // ... existing success logic
                        setData(prev => prev.map((r, idx) => {
                            if (idx === rowIndex) {
                                return {
                                    ...r,
                                    id: res.row.id,
                                    ...(res.row.data as object)
                                }
                            }
                            return r
                        }))

                        // Show AI Analysis in a popup if present
                        if ((res as any).aiAnalysis) {
                            setAiAnalysisResult((res as any).aiAnalysis)
                        }
                    } else if (!res.success) {
                        if ((res as any).isAiError) {
                            alert(`File Analysis Error: ${res.error}`);
                        } else {
                            console.error("Failed to save row", res.error)
                        }
                    }
                })
            }

            return newData
        })
    }

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
        },
        meta: {
            updateData,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    // Virtualization
    const parentRef = React.useRef<HTMLDivElement>(null)

    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35, // Row height
        overscan: 5,
    })

    return (
        <div className="flex flex-col h-full border rounded-md bg-background overflow-hidden">
            <div
                ref={parentRef}
                className="flex-1 overflow-auto w-full relative"
            >
                {/* Header - Sticky inside scroll container */}
                <div
                    className="flex bg-[#ffd66b] font-medium text-slate-900 sticky top-0 z-20 w-fit min-w-full border-b border-[#eeb44c]"
                    style={{
                        width: table.getTotalSize(),
                        minWidth: '100%'
                    }}
                >
                    {table.getHeaderGroups().map(headerGroup => (
                        <div key={headerGroup.id} className="flex w-full">
                            {headerGroup.headers.map(header => (
                                <div
                                    key={header.id}
                                    className="flex items-center px-3 py-2 border-r border-[#eeb44c] h-9 select-none shrink-0 bg-[#ffd66b] hover:bg-[#fccb4f] transition-colors"
                                    style={{ width: header.getSize() }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                    <div
                                        {...{
                                            onMouseDown: header.getResizeHandler(),
                                            onTouchStart: header.getResizeHandler(),
                                            className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                                                }`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: `${table.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index]
                        return (
                            <div
                                key={virtualRow.index}
                                className={cn(
                                    "flex absolute top-0 left-0 w-full border-b hover:bg-muted/50 transition-colors bg-background items-center group",
                                    virtualRow.index % 2 === 0 ? "bg-background" : "bg-muted/10"
                                )}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <div
                                        key={cell.id}
                                        className="px-0 py-0 border-r border-border h-full flex items-center outline-none focus-within:ring-2 focus-within:ring-primary focus-within:-outline-offset-2 cursor-default shrink-0"
                                        style={{ width: cell.column.getSize() }}
                                        tabIndex={0}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* AI Analysis Popup */}
            {aiAnalysisResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-background border rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300 ring-1 ring-border">
                        <div className={cn(
                            "flex items-center justify-between p-5 border-b",
                            aiAnalysisResult.includes("PASS") ? "bg-green-500/10 border-green-500/20" :
                                aiAnalysisResult.includes("FAIL") ? "bg-red-500/10 border-red-500/20" : "bg-muted/30"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    aiAnalysisResult.includes("PASS") ? "bg-green-500 text-white" :
                                        aiAnalysisResult.includes("FAIL") ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"
                                )}>
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">AI Compliance Report</h3>
                                    <p className="text-xs text-muted-foreground">Automation complete - Data extracted and mapped</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAiAnalysisResult(null)}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-8 prose prose-sm max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground/90">
                                {aiAnalysisResult.split('\n').map((line, i) => {
                                    if (line.startsWith('✅') || line.startsWith('👉 PASS')) {
                                        return <div key={i} className="text-green-600 dark:text-green-400 font-bold text-lg mb-4">{line}</div>
                                    }
                                    if (line.startsWith('❌') || line.startsWith('👉 FAIL')) {
                                        return <div key={i} className="text-red-600 dark:text-red-400 font-bold text-lg mb-4">{line}</div>
                                    }
                                    if (line.startsWith('🔍') || line.startsWith('📍') || line.startsWith('✍️')) {
                                        return <div key={i} className="font-semibold text-amber-600 mt-6 mb-2 flex items-center gap-2">{line}</div>
                                    }
                                    return <div key={i} className="mb-1">{line}</div>
                                })}
                            </div>
                        </div>
                        <div className="p-5 border-t bg-muted/5 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground italic">
                                * All data has been automatically filled in the grid.
                            </div>
                            <button
                                onClick={() => setAiAnalysisResult(null)}
                                className="px-8 py-2.5 bg-amber-600 text-white rounded-lg font-semibold hover:ring-2 ring-amber-500/20 transition-all shadow-lg active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
