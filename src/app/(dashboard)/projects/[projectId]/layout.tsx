import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ projectId: string }>
}) {
    const { projectId } = await params
    // Verify project exists
    // In a real app we'd fetch sheets here to render the sidebar/tabs
    // But for now just pass through

    return (
        <div className="flex flex-1 flex-col h-full overflow-hidden">
            {children}
        </div>
    )
}
