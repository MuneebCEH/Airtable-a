"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    FolderKanban,
    Home,
    Settings,
    Users,
    Table2,
    Database,
    Calendar as CalendarIcon
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function MainSidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 w-64 border-r h-full bg-sidebar text-sidebar-foreground", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-6 px-4 text-2xl font-bold tracking-tight text-primary">
                        Delta Medical
                    </h2>
                    <div className="space-y-1">
                        <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} asChild className="w-full justify-start">
                            <Link href="/dashboard">
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button variant={pathname === "/projects" ? "secondary" : "ghost"} asChild className="w-full justify-start">
                            <Link href="/projects">
                                <FolderKanban className="mr-2 h-4 w-4" />
                                Projects
                            </Link>
                        </Button>
                        <Button variant={pathname === "/calendar" ? "secondary" : "ghost"} asChild className="w-full justify-start">
                            <Link href="/calendar">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Calendar
                            </Link>
                        </Button>
                        <Button variant={pathname === "/automation" ? "secondary" : "ghost"} asChild className="w-full justify-start">
                            <Link href="/automation">
                                <Settings className="mr-2 h-4 w-4" />
                                Automation
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full justify-start">
                            <Link href="/templates">
                                <Database className="mr-2 h-4 w-4" />
                                Templates
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Admin
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Team
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Backups
                    </h2>
                    <div className="space-y-1">
                        <Button variant={pathname === "/admin/backups" ? "secondary" : "ghost"} asChild className="w-full justify-start">
                            <Link href="/admin/backups">
                                <Database className="mr-2 h-4 w-4" />
                                Database Backups
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
