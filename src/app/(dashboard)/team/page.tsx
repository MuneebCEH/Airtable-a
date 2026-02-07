import { getUsers } from "@/app/actions/users"
import { UserManagementClient } from "@/components/team/user-management-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Team Management - Delta Medical",
    description: "Manage system access and roles for Admin, Manager, and Agent accounts.",
}

export default async function TeamPage() {
    const response = await getUsers()
    const users = response.success ? response.users : []

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-slate-50/30 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 mb-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-1">Team Hub</h2>
                    <p className="text-slate-500 font-medium">Control identities and access levels across the organization.</p>
                </div>
            </div>

            <UserManagementClient initialUsers={users || []} />
        </div>
    )
}
