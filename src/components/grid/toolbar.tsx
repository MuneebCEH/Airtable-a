"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    ArrowUpDown,
    Settings2,
    Plus,
    Download,
    Share2
} from "lucide-react"

export function GridToolbar() {
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
                <Button variant="ghost" size="sm" className="h-8">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
                <Button variant="outline" size="sm" className="h-8">
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
