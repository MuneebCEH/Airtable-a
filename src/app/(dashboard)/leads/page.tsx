import React from "react"
import { PhoneIncoming, UserPlus, Search, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LeadsPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/20 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Leads & Inbound</h1>
                    <p className="text-slate-500 font-medium">Manage incoming inquiries and potential healthcare partners.</p>
                </div>
                <Button className="rounded-2xl bg-blue-600 hover:bg-blue-700 font-black px-6 h-12 shadow-lg shadow-blue-200 border-none text-white transition-all">
                    <UserPlus className="mr-2 h-5 w-5" /> Import Leads
                </Button>
            </div>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Recent Leads</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search leads..." className="pl-10 rounded-xl border-slate-100 w-64" />
                            </div>
                            <Button variant="outline" className="rounded-xl border-slate-100">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-20 flex flex-col items-center justify-center text-slate-400">
                    <div className="p-6 bg-slate-50 rounded-full mb-6">
                        <PhoneIncoming className="h-10 w-10 opacity-40 text-blue-500" />
                    </div>
                    <p className="text-lg font-black text-slate-900 mb-1">No pending leads</p>
                    <p className="text-sm">Your inbound queue is currently empty.</p>
                </CardContent>
            </Card>
        </div>
    )
}
