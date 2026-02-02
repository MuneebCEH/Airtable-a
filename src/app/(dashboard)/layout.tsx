import { MainSidebar } from "@/components/main-sidebar"
import { UserNav } from "@/components/user-nav" // User profile dropdown
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <div className="border-b shrink-0">
                <div className="flex h-14 items-center px-4">
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <MainSidebar />
                <main className="flex-1 flex flex-col min-w-0 bg-muted/5">
                    {children}
                </main>
            </div>
        </div>
    )
}
