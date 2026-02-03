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
    Calendar as CalendarIcon,
    PanelLeftClose,
    PanelLeftOpen,
    Menu
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function MainSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <div className={cn(
            "relative flex flex-col border-r h-full transition-all duration-300 ease-in-out bg-white shadow-sm",
            isCollapsed ? "w-16" : "w-64",
            className
        )}>
            <div className={cn(
                "flex items-center h-14 border-b shrink-0 overflow-hidden transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "px-4 justify-between"
            )}>
                {!isCollapsed && (
                    <span className="font-bold text-xl truncate text-amber-600 animate-in fade-in duration-300">
                        Delta Medical
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "shrink-0 hover:bg-slate-100 text-slate-900",
                        isCollapsed ? "h-10 w-10" : "h-8 w-8"
                    )}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-4 py-4 px-3">
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Main
                            </h2>
                        )}
                        <SidebarItem
                            href="/dashboard"
                            icon={<Home className="h-4 w-4" />}
                            label="Dashboard"
                            active={pathname === "/dashboard"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/projects"
                            icon={<FolderKanban className="h-4 w-4" />}
                            label="Projects"
                            active={pathname === "/projects"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/calendar"
                            icon={<CalendarIcon className="h-4 w-4" />}
                            label="Calendar"
                            active={pathname === "/calendar"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/automation"
                            icon={<Settings className="h-4 w-4" />}
                            label="Automation"
                            active={pathname === "/automation"}
                            collapsed={isCollapsed}
                        />
                    </div>

                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Admin
                            </h2>
                        )}
                        <SidebarItem
                            href="/team"
                            icon={<Users className="h-4 w-4" />}
                            label="Team"
                            active={pathname === "/team"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/admin/backups"
                            icon={<Database className="h-4 w-4" />}
                            label="Backups"
                            active={pathname === "/admin/backups"}
                            collapsed={isCollapsed}
                        />
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

function SidebarItem({
    href,
    icon,
    label,
    active,
    collapsed
}: {
    href: string
    icon: React.ReactNode
    label: string
    active: boolean
    collapsed: boolean
}) {
    return (
        <Button
            variant={active ? "secondary" : "ghost"}
            asChild
            className={cn(
                "w-full transition-all duration-200",
                collapsed ? "justify-center px-0" : "justify-start px-4",
                active ? "bg-amber-100/50 text-slate-900 hover:bg-amber-100" : "text-slate-900 hover:bg-slate-100"
            )}
            title={collapsed ? label : undefined}
        >
            <Link href={href} className="flex items-center w-full">
                <span className={cn(
                    "shrink-0",
                    active ? "text-amber-600" : "text-slate-900"
                )}>
                    {icon}
                </span>
                {!collapsed && (
                    <span className={cn(
                        "ml-3 truncate font-semibold",
                        active ? "text-slate-900" : "text-slate-900"
                    )}>{label}</span>
                )}
            </Link>
        </Button>
    )
}
