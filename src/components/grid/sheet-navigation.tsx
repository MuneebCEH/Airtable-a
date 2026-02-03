"use client"

import * as React from "react"
import { createSheet, renameSheet, deleteSheet } from "@/app/actions/sheets"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronDown, Trash, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SheetNavigationProps {
    sheets: { id: string; name: string }[]
    activeSheetId: string
    onSheetChange: (id: string) => void
    projectId: string
}

export function SheetNavigation({ sheets, activeSheetId, onSheetChange, projectId }: SheetNavigationProps) {
    const router = useRouter()
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [editName, setEditName] = React.useState("")

    const handleAddSheet = async () => {
        const result = await createSheet(projectId)
        if (result.success && result.sheetId) {
            onSheetChange(result.sheetId)
        }
    }

    const startRename = (id: string, name: string) => {
        setEditingId(id)
        setEditName(name)
    }

    const saveRename = async () => {
        if (editingId && editName.trim()) {
            await renameSheet(editingId, editName)
        }
        setEditingId(null)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this sheet?")) {
            await deleteSheet(id)
            if (activeSheetId === id) {
                // If deleted active sheet, refresh or let the page handle redirect
                router.refresh()
            }
        }
    }

    return (
        <div className="flex items-center border-b bg-[#ffd66b] border-[#eeb44c]">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-1 p-2">
                    {sheets.map((sheet) => {
                        const isActive = activeSheetId === sheet.id

                        // Inline Editing Mode
                        if (editingId === sheet.id) {
                            return (
                                <Input
                                    key={sheet.id}
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onBlur={saveRename}
                                    onKeyDown={(e) => e.key === "Enter" && saveRename()}
                                    autoFocus
                                    className="w-32 h-9 my-auto bg-white text-black"
                                />
                            )
                        }

                        // Normal Mode with Dropdown
                        return (
                            <DropdownMenu key={sheet.id}>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => onSheetChange(sheet.id)}
                                        onDoubleClick={() => startRename(sheet.id, sheet.name)}
                                        className={cn(
                                            "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                                            isActive
                                                ? "bg-white text-[#d97706] shadow-sm"
                                                : "text-slate-800 hover:bg-[#fccb4f] hover:text-slate-900 bg-transparent"
                                        )}
                                    >
                                        {sheet.name}
                                        {isActive && (
                                            <DropdownMenuTrigger asChild>
                                                <div
                                                    role="button"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="ml-2 p-0.5 rounded-sm hover:bg-sky-100 cursor-pointer"
                                                >
                                                    <ChevronDown className="h-3 w-3 text-[#d97706] opacity-70" />
                                                </div>
                                            </DropdownMenuTrigger>
                                        )}
                                    </button>
                                </div>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => startRename(sheet.id, sheet.name)}>
                                        <Edit2 className="mr-2 h-4 w-4" /> Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={(e) => { e.stopPropagation(); handleDelete(sheet.id) }}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
            <div className="flex items-center px-4 border-l border-[#eeb44c] bg-amber-600/10 h-10">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full border border-dashed border-slate-600/50 text-slate-800 hover:bg-white/20 hover:text-slate-900"
                    onClick={handleAddSheet}
                >
                    <span className="sr-only">Add Sheet</span>
                    <span className="text-xs">+</span>
                </Button>
            </div>
        </div>
    )
}
