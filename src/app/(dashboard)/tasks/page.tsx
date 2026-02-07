import React from "react"
import { CheckSquare, Clock, Filter, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function TasksPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/20 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Tasks & Workflow</h1>
                    <p className="text-slate-500 font-medium">Track your personal and team-wide operational tasks.</p>
                </div>
                <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-black px-6 h-12 shadow-lg shadow-amber-200 border-none text-slate-900">
                    <Plus className="mr-2 h-5 w-5" /> Create Task
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "To Do", count: 8, color: "blue" },
                    { label: "In Progress", count: 4, color: "amber" },
                    { label: "Completed", count: 24, color: "green" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900">{stat.count}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <Clock className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Active Tasks</CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Find tasks..." className="pl-10 rounded-xl border-slate-100 w-64" />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl border-slate-100">
                                <Filter className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-12 flex flex-col items-center justify-center text-slate-400">
                    <CheckSquare className="h-12 w-12 mb-4 opacity-20" />
                    <p className="font-bold italic">No urgent tasks assigned to you.</p>
                    <p className="text-xs mt-1">Check the team board for collaborative items.</p>
                </CardContent>
            </Card>
        </div>
    )
}
