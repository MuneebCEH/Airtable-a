import { MainSidebar } from "@/components/main-sidebar"
import { UserNav } from "@/components/user-nav" // User profile dropdown
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
            <div className="border-b shrink-0 bg-white text-foreground">
                <div className="flex h-14 items-center px-4">
                    <div className="ml-auto flex items-center space-x-4">
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <MainSidebar />
                <main
                    className="flex-1 flex flex-col min-w-0 bg-white text-black"
                    style={
                        {
                            "--background": "oklch(1 0 0)",
                            "--foreground": "oklch(0 0 0)",
                            "--border": "oklch(0 0 0)",
                            "--input": "oklch(0 0 0)",
                            "--ring": "oklch(0 0 0)",
                            "--muted": "oklch(0.95 0 0)",
                            "--muted-foreground": "oklch(0.2 0 0)",
                        } as React.CSSProperties
                    }
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
