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
    VisibilityState,
    RowData
} from "@tanstack/react-table"

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: any) => void
        openProfile: (row: any) => void
        deleteRows: (rowIds: string[]) => void
    }
}
import { useVirtualizer } from "@tanstack/react-virtual"
// Import server action
import { uploadFile } from "@/app/actions/upload"
import { updateRowData, createRow, deleteRows } from "@/app/actions/rows"
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
    Maximize2,
    IdCard,
    Trash2
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

    const isPatientNameColumn = column.name.toLowerCase() === 'patient name' || column.id === 'patientName'

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
                    {value ? (
                        <div className="flex items-center justify-center p-0.5 rounded bg-emerald-500 text-white">
                            <Check className="h-3 w-3" />
                        </div>
                    ) : (
                        <div
                            className="h-4 w-4 rounded border border-slate-300 bg-white cursor-pointer"
                            onClick={() => onCheckboxChange(true)}
                        />
                    )}
                    <Checkbox
                        checked={!!value}
                        onCheckedChange={onCheckboxChange}
                        className="hidden" // Keep logical checkbox for accessibility but use custom UI
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

                        return (
                            <div key={i} className="relative group/thumb shrink-0">
                                <div className="h-6 w-6 rounded border bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                    {isImage ? (
                                        <img src={f.path} alt={f.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="text-slate-400">
                                            <FileText className="h-3.5 w-3.5" />
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
                        className={cn(
                            "flex-1 w-0 bg-transparent outline-none px-2 text-sm h-full",
                            isPatientNameColumn && "font-medium text-amber-700"
                        )}
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        onDoubleClick={() => setIsDialogOpen(true)}
                    />
                    {isPatientNameColumn && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                table.options.meta?.openProfile(row.original)
                            }}
                            className="mr-1 p-1 bg-amber-100/50 text-amber-600 rounded border border-amber-200 hover:bg-amber-100 hover:text-amber-700 transition-all shadow-sm shrink-0"
                            title="Open Patient Profile"
                        >
                            <Maximize2 className="h-3 w-3" />
                        </button>
                    )}
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
            <span className="text-slate-400 shrink-0">{getColumnIcon(column.type)}</span>
            {isEditing ? (
                <input
                    autoFocus
                    className="bg-white text-[11px] font-semibold text-slate-800 outline-none w-full px-1 rounded-sm border border-slate-300 shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span
                    className="text-[11px] font-semibold text-slate-600 truncate tracking-tight cursor-text hover:bg-black/5 px-1 rounded-sm w-full transition-colors"
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
    isSelectionMode: boolean
    selectedRowIds: string[]
    setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>
    globalFilter: string
    setGlobalFilter: (val: string) => void
    sorting: SortingState
    setSorting: (val: any) => void
    columnVisibility: VisibilityState
    setColumnVisibility: (val: any) => void
}

export function DataTable({
    columns: initialColumns,
    data: initialData,
    sheetId,
    isSelectionMode,
    selectedRowIds,
    setSelectedRowIds,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility
}: DataTableProps) {
    const [data, setData] = React.useState(initialData)

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

    // Convert GridColumn to TanStack ColumnDef with Selection Column if needed
    const tableColumns = React.useMemo<ColumnDef<GridRow>[]>(() => {
        const cols: ColumnDef<GridRow>[] = []

        // Add selection column only in selection mode
        if (isSelectionMode) {
            cols.push({
                id: "selection",
                header: ({ table }) => (
                    <div className="flex items-center justify-center w-full h-full">
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                            className="bg-white border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                        />
                    </div>
                ),
                cell: ({ row }) => {
                    const isGhost = row.original.id.startsWith("ghost-")
                    if (isGhost) return null

                    return (
                        <div className="flex items-center justify-center w-full h-full">
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select row"
                                className="border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                            />
                        </div>
                    )
                },
                size: 40,
                enableSorting: false,
                enableHiding: false,
            })
        }

        const dataCols = initialColumns.map((col) => ({
            accessorKey: col.id,
            header: ({ column }: { column: any }) => <ColumnHeader column={col} sheetId={sheetId} getColumnIcon={getColumnIcon} />,
            cell: ({ getValue, row, table }: { getValue: any, row: any, table: any }) => <EditableCell getValue={getValue} row={row} column={col} table={table} />,
            size: col.width || 150,
        }))

        return [...cols, ...dataCols]
    }, [initialColumns, isSelectionMode, sheetId])

    const [aiAnalysisResult, setAiAnalysisResult] = React.useState<string | null>(null)

    const updateData = (rowIndex: number, columnId: string, value: any) => {
        if (isSelectionMode) return // Prevent editing in selection mode

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

    const [selectedProfileRow, setSelectedProfileRow] = React.useState<GridRow | null>(null)
    const [isProfileOpen, setIsProfileOpen] = React.useState(false)

    const openProfile = (row: GridRow) => {
        setSelectedProfileRow(row)
        setIsProfileOpen(true)
    }

    const [rowSelection, setRowSelection] = React.useState({})

    // Sync TanStack row selection with our selectedRowIds
    React.useEffect(() => {
        const ids = Object.keys(rowSelection)
            .map(idx => data[Number(idx)]?.id)
            .filter(id => id && !id.startsWith("ghost-"))
        setSelectedRowIds(ids as string[])
    }, [rowSelection, data, setSelectedRowIds])

    // Reset selection when exiting mode
    React.useEffect(() => {
        if (!isSelectionMode) {
            setRowSelection({})
        }
    }, [isSelectionMode])

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
            rowSelection,
            globalFilter,
            columnVisibility,
        },
        enableRowSelection: isSelectionMode,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        meta: {
            updateData,
            openProfile,
            deleteRows,
        },
        columnResizeMode: "onChange",
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row, index) => index.toString(), // Important for indices in rowSelection
    })

    const handleInsertRow = async (index: number) => {
        const res = await createRow(sheetId, {})
        if (res.success) {
            // Update local state to reflect the new row immediately
            const newData = [...data]
            newData.splice(index + 1, 0, res.row as any)
            setData(newData)
        }
    }

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
                    className="flex bg-[#f5f5f5] font-normal text-slate-600 sticky top-0 z-20 w-fit min-w-full border-b border-slate-200"
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
                                    className="relative flex items-center px-3 py-2 border-r border-slate-200 h-9 shrink-0 bg-[#f5f5f5] hover:bg-[#ececec] transition-colors group text-[11px] uppercase tracking-wider font-semibold"
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div
                                        key={virtualRow.index}
                                        className={cn(
                                            "flex absolute top-0 left-0 w-full border-b border-slate-100 hover:bg-slate-50/80 transition-colors bg-background items-center group cursor-context-menu",
                                            virtualRow.index % 2 === 0 ? "bg-background" : "bg-slate-50/30"
                                        )}
                                        style={{
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                        onContextMenu={(e) => {
                                            // We don't need to prevent default here if we use DropdownMenu as triggered by right click
                                            // But DropdownMenuTrigger asChild usually handles clicks. 
                                            // Standard Shadcn Dropdown doesn't support right click out of box easily without a specialized component.
                                            // We will simulate it by ensuring the Trigger covers the row.
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <div
                                                key={cell.id}
                                                className="px-0 py-0 border-r border-slate-100 h-full flex items-center outline-none cursor-text shrink-0 select-text"
                                                style={{ width: cell.column.getSize() }}
                                                tabIndex={0}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </div>
                                        ))}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48 bg-white">
                                    <DropdownMenuItem
                                        className="gap-2 cursor-pointer"
                                        onClick={() => handleInsertRow(virtualRow.index)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Insert Row Below</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="gap-2 text-destructive cursor-pointer"
                                        onClick={() => table.options.meta?.deleteRows?.([row.original.id])}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete Row</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    })}
                    {/* Add row at the bottom */}
                    <div
                        className="flex absolute left-0 w-full border-b border-slate-100 bg-background items-center group cursor-pointer hover:bg-slate-50 transition-colors"
                        style={{
                            height: `35px`,
                            width: `${table.getTotalSize()}px`,
                            top: `${rowVirtualizer.getTotalSize()}px`,
                        }}
                        onClick={() => handleInsertRow(rows.length - 1)}
                    >
                        <div className="flex items-center justify-center p-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Plus className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
            {/* AI Analysis Popup */}
            {aiAnalysisResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-background border rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300 ring-1 ring-border">
                        <div className={cn(
                            "flex items-center justify-between p-5 border-b",
                            aiAnalysisResult.includes("PASS") ? "bg-green-500/10 border-green-500/20" :
                                aiAnalysisResult.includes("FAIL") ? "bg-red-500/10 border-red-500/20" : "bg-blue-500/10 border-blue-500/20"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <CheckSquare className="h-4 w-4 text-blue-600" />
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
                                        return <div key={i} className="font-semibold text-blue-600 mt-6 mb-2 flex items-center gap-2">{line}</div>
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
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:ring-2 ring-blue-500/20 transition-all shadow-lg active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Profile Dialog - Optimized & Sexy Design */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="max-w-[92vw] 2xl:max-w-[85vw] h-[88vh] overflow-hidden p-0 border-none shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] bg-[#fdfdfd] flex flex-col rounded-[32px] transition-all duration-500 ease-in-out">
                    {selectedProfileRow && (
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left Sidebar - Profile Summary (Upscaled for Visibility) */}
                            <div className="w-full md:w-[420px] bg-gradient-to-br from-amber-600 to-amber-700 p-12 flex flex-col items-center text-center text-white relative overflow-hidden shrink-0">
                                {/* Decorative Background Elements */}
                                <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-black/10 rounded-full blur-[100px] pointer-events-none" />

                                <button
                                    onClick={() => setIsProfileOpen(false)}
                                    className="absolute top-6 left-6 p-3 hover:bg-white/20 rounded-full transition-all md:hidden z-20"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>

                                <div className="relative z-10 mt-6 flex flex-col items-center w-full">
                                    <div className="h-44 w-44 rounded-[56px] bg-white/20 backdrop-blur-3xl flex items-center justify-center border-4 border-white/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] mb-10 group transition-all hover:rotate-2 duration-700">
                                        <User className="h-24 w-24 text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[40px] p-8 mb-10 shadow-2xl w-full">
                                        <h2 className="text-4xl font-black tracking-tighter leading-[1.1] text-white mb-4">
                                            {initialColumns.find(c => c.name.toLowerCase() === 'patient name')
                                                ? selectedProfileRow[initialColumns.find(c => c.name.toLowerCase() === 'patient name')!.id]
                                                : "Patient Profile"
                                            }
                                        </h2>
                                        <div className="h-1.5 w-20 bg-amber-400 rounded-full mb-5 mx-auto shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                        <p className="text-sm font-black uppercase tracking-[0.4em] text-amber-200/90">Primary Identity</p>
                                    </div>

                                    <div className="flex flex-col gap-5 w-full">
                                        <div className="bg-black/20 backdrop-blur-2xl rounded-3xl px-8 py-6 border border-white/10 flex items-center justify-between text-left group hover:bg-black/30 transition-all shadow-lg active:scale-95">
                                            <div className="flex items-center gap-5">
                                                <div className="p-3 bg-amber-500/20 rounded-xl">
                                                    <ChevronDown className="ml-2 h-3.5 w-3.5 text-slate-400 opacity-70" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase tracking-widest text-amber-100/60 leading-none mb-1">Digital Key</span>
                                                    <span className="text-sm font-mono font-black tracking-widest text-white leading-none">SECURE-ID</span>
                                                </div>
                                            </div>
                                            <span className="text-lg font-mono font-black tracking-wider text-white bg-white/10 px-4 py-1.5 rounded-xl border border-white/10">{selectedProfileRow.id.split('-')[0].toUpperCase()}</span>
                                        </div>

                                        <div className="bg-emerald-500/20 backdrop-blur-2xl rounded-3xl px-8 py-6 border border-emerald-400/20 flex items-center justify-between text-left group hover:bg-emerald-500/30 transition-all shadow-lg active:scale-95">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping absolute inset-0 opacity-75" />
                                                    <div className="w-4 h-4 rounded-full bg-emerald-400 relative shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-100/60 leading-none mb-1">System Status</span>
                                                    <span className="text-sm font-black text-emerald-300 uppercase leading-none">Live Monitoring</span>
                                                </div>
                                            </div>
                                            <span className="text-sm font-black text-emerald-100 uppercase tracking-widest bg-emerald-400/20 px-4 py-2 rounded-xl border border-emerald-400/30">Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-10 w-full z-10 hidden md:block">
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-10" />
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200/60 mb-6 drop-shadow-md">Professional Verification</p>
                                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex items-center gap-6 text-left backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all cursor-default group/badge">
                                        <div className="p-4 bg-emerald-400/20 rounded-full shrink-0 shadow-inner group-hover/badge:scale-110 transition-transform duration-500 border border-emerald-400/30">
                                            <Check className="w-8 h-8 text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-lg text-white font-black leading-tight mb-1">Authenticated</p>
                                            <p className="text-sm text-amber-50/70 font-bold leading-relaxed tracking-wide">AI & Medical Compliance Cleared Successfully</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content Area - Detailed Info */}
                            <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]/50">
                                {/* Header with Navigation/Actions */}
                                <div className="h-20 flex items-center justify-between px-8 border-b bg-white/80 backdrop-blur-md sticky top-0 z-20">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-amber-50 rounded-xl">
                                            <FileText className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Comprehensive Details</h3>
                                    </div>
                                    <button
                                        onClick={() => setIsProfileOpen(false)}
                                        className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Quick Insights Bar */}
                                <div className="px-8 py-5 bg-white border-b flex items-center gap-6 overflow-x-auto no-scrollbar shrink-0">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 line-clamp-1">Compliance Score</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-16 bg-emerald-100 rounded-full overflow-hidden">
                                                <div className="h-full w-[85%] bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            </div>
                                            <span className="text-[11px] font-black text-emerald-600 italic">85%</span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 hidden sm:block" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Record Health</span>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4].map(i => <div key={i} className="h-1.5 w-3 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />)}
                                                <div className="h-1.5 w-3 bg-slate-100 rounded-full" />
                                            </div>
                                            <span className="text-[11px] font-black text-amber-600 italic">Strong</span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-100 hidden sm:block" />
                                    <div className="flex items-center gap-3">
                                        <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                                            Verified
                                        </div>
                                        <div className="px-3.5 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-[10px] font-black text-purple-600 uppercase tracking-widest shadow-sm">
                                            VIP Patient
                                        </div>
                                    </div>
                                </div>

                                {/* Main scrollable body */}
                                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar scroll-smooth bg-slate-50/20">
                                    <div className="space-y-10 w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
                                            {initialColumns.map((col) => {
                                                const colValue = selectedProfileRow[col.id];
                                                const isEmpty = colValue === null || colValue === undefined || colValue === '';
                                                if (col.name.toLowerCase() === 'patient name') return null;

                                                return (
                                                    <div
                                                        key={col.id}
                                                        className="group relative flex flex-col p-7 rounded-[32px] bg-white border border-slate-200/50 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.06)] hover:border-amber-400/30 hover:-translate-y-1.5 transition-all duration-500"
                                                    >
                                                        <div className="flex justify-between items-start mb-5">
                                                            <div className="flex items-center gap-3.5">
                                                                <div className="p-3 rounded-[20px] bg-slate-50 text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_12px_24px_-6px_rgba(245,158,11,0.4)]">
                                                                    {getColumnIcon(col.type)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-800 transition-colors leading-none mb-1">
                                                                        {col.name}
                                                                    </span>
                                                                    <span className="text-[9px] font-bold text-slate-300 group-hover:text-amber-600/50 uppercase tracking-tight transition-colors">Information Field</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="pl-0.5">
                                                            {col.type === 'CHECKBOX' ? (
                                                                <div className={cn(
                                                                    "inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase border-2 transition-all duration-500",
                                                                    colValue
                                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.1)]"
                                                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                                                )}>
                                                                    <div className={cn("h-2.5 w-2.5 rounded-full", colValue ? "bg-emerald-500 animate-pulse" : "bg-slate-200")} />
                                                                    {colValue ? "Verified & Completed" : "Requires Attention"}
                                                                </div>
                                                            ) : col.type === 'FILE' ? (
                                                                <div className="flex flex-wrap gap-2.5 py-1">
                                                                    {Array.isArray(colValue) && colValue.length > 0 ? colValue.map((f: any, i: number) => (
                                                                        <div key={i} className="flex items-center gap-3 bg-slate-50 hover:bg-white border border-slate-100 hover:border-amber-400 rounded-2xl px-5 py-3.5 text-[13px] font-bold text-slate-700 transition-all cursor-pointer shadow-sm hover:shadow-xl group/file">
                                                                            <Paperclip className="w-5 h-5 text-amber-500 group-hover/file:rotate-12 transition-transform" />
                                                                            <span className="max-w-[180px] truncate">{f.name}</span>
                                                                        </div>
                                                                    )) : <span className="text-slate-300 text-sm italic font-black">No Records Attached</span>}
                                                                </div>
                                                            ) : col.type === 'DATE' ? (
                                                                <div className="flex items-center gap-5 py-1">
                                                                    <div className="w-14 h-14 rounded-[22px] bg-amber-50 flex flex-col items-center justify-center border-2 border-amber-100 text-amber-600 shadow-inner group-hover:bg-amber-600 group-hover:text-white transition-all duration-700">
                                                                        <CalendarIcon className="w-6 h-6" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[17px] font-black text-slate-800 tracking-tight leading-none mb-1">
                                                                            {colValue ? (typeof colValue === 'string' ? colValue : "Not Set") : "—"}
                                                                        </p>
                                                                        <p className="text-[10px] font-black text-amber-600/60 uppercase tracking-widest">Official Registration</p>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className={cn(
                                                                    "text-[17px] font-black leading-snug pr-8 group-hover:text-slate-900 transition-colors",
                                                                    isEmpty ? "text-slate-200 italic" : "text-slate-700"
                                                                )}>
                                                                    {isEmpty ? "Record Undefined" : String(colValue)}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Decorative Background Icon */}
                                                        <div className="absolute top-6 right-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none group-hover:rotate-12 transform group-hover:scale-[2.5]">
                                                            {getColumnIcon(col.type)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="h-24 px-8 border-t bg-white flex items-center justify-end gap-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] rounded-br-[24px]">
                                    <button
                                        onClick={() => setIsProfileOpen(false)}
                                        className="h-12 px-8 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-95 text-sm"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        onClick={() => setIsProfileOpen(false)}
                                        className="h-12 px-8 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-[0_8px_25px_-8px_rgba(217,119,6,0.5)] transition-all active:scale-95 flex items-center gap-2 text-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                        Update Records
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
