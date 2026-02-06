import React from "react"
import {
    CheckCircle2,
    Circle,
    Calendar,
    AlertCircle,
    Clock,
    User,
    Plus,
    Filter,
    Search,
    LayoutGrid,
    List,
    MoreHorizontal,
    Flag,
    Paperclip
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const tasks = [
    { id: "TSK-201", title: "Review Q1 Compliance Reports", priority: "High", status: "In Progress", due: "Feb 12, 2026", assigned: "SJ", tags: ["Audit", "Regulatory"], comments: 4, attachments: 2 },
    { id: "TSK-202", title: "Corporate License Renewal", priority: "Critical", status: "Pending", due: "Feb 05, 2026", assigned: "MT", tags: ["Legal"], comments: 0, attachments: 1 },
    { id: "TSK-203", title: "Update Patient Privacy Policy", priority: "Medium", status: "Review", due: "Feb 20, 2026", assigned: "ER", tags: ["Policy", "Privacy"], comments: 12, attachments: 5 },
    { id: "TSK-204", title: "Inventory Audit: Zion Diagnostics", priority: "High", status: "In Progress", due: "Feb 15, 2026", assigned: "JW", tags: ["Audit", "Site-Visit"], comments: 8, attachments: 0 },
    { id: "TSK-205", title: "New Lab Equipment Certification", priority: "Low", status: "Backlog", due: "Mar 01, 2026", assigned: "SC", tags: ["Ops", "Cert"], comments: 2, attachments: 12 },
    { id: "TSK-206", title: "Insurance Claim Processing Fix", priority: "High", status: "Completed", due: "Jan 30, 2026", assigned: "SJ", tags: ["Bug", "Finance"], comments: 15, attachments: 3 },
]

export default function TasksPage() {
    return (
        <div className="p-8 space-y-6 bg-[#f8fafc] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-amber-500" />
                        Task Management
                    </h1>
                    <p className="text-slate-500 font-medium">Enterprise workflows and project milestones tracking.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 text-amber-600 bg-amber-50">
                        <List className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50 text-slate-400">
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <div className="w-[1px] h-6 bg-slate-100 mx-1" />
                    <Button className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-5 h-10 shadow-lg shadow-amber-200 transition-all active:scale-95 border-none">
                        <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Button>
                </div>
            </div>

            {/* View Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold cursor-pointer hover:bg-slate-800 transition-colors">All Tasks</Badge>
                    <Badge variant="outline" className="px-4 py-2 rounded-xl border-slate-200 text-slate-600 font-bold cursor-pointer hover:bg-white transition-colors">Assigned to Me</Badge>
                    <Badge variant="outline" className="px-4 py-2 rounded-xl border-slate-200 text-slate-600 font-bold cursor-pointer hover:bg-white transition-colors">High Priority</Badge>
                    <Badge variant="outline" className="px-4 py-2 rounded-xl border-slate-200 text-slate-600 font-bold cursor-pointer hover:bg-white transition-colors">Upcoming</Badge>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <Input
                        placeholder="Quick search tasks..."
                        className="pl-11 pr-4 rounded-2xl border-none bg-white shadow-sm focus:ring-amber-500/20 focus:shadow-md transition-all h-11 w-full sm:w-64"
                    />
                </div>
            </div>

            {/* Task List Card */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                <TableHead className="w-[450px] text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 py-6">Task Description</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-8">Context</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-green-500 border-green-500' : 'border-slate-200 group-hover:border-amber-400'
                                                }`}>
                                                {task.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                                {task.status !== 'Completed' && <Circle className="h-3 w-3 text-transparent" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-black tracking-tight text-[15px] mb-2 ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'
                                                    }`}>
                                                    {task.title}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {task.tags.map((tag, idx) => (
                                                        <span key={idx} className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200/50">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Avatar className="h-8 w-8 rounded-xl border border-white shadow-sm ring-2 ring-slate-100 hover:scale-110 transition-transform">
                                            <AvatarFallback className="bg-slate-900 text-white text-[10px] font-black">{task.assigned}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[12px] font-black px-2.5 py-1 rounded-lg ${task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                                                        task.status === 'Review' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-slate-100 text-slate-500'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[13px]">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {task.due}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Flag className={`h-4 w-4 ${task.priority === 'Critical' ? 'text-rose-500 fill-rose-500' :
                                                    task.priority === 'High' ? 'text-amber-500 fill-amber-500' :
                                                        'text-slate-300'
                                                }`} />
                                            <span className="text-[12px] font-black text-slate-900">{task.priority}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-4 text-slate-400">
                                            {task.attachments > 0 && (
                                                <div className="flex items-center gap-1 hover:text-amber-600 cursor-pointer transition-colors">
                                                    <Paperclip className="h-3.5 w-3.5" />
                                                    <span className="text-[11px] font-bold">{task.attachments}</span>
                                                </div>
                                            )}
                                            {task.comments > 0 && (
                                                <div className="flex items-center gap-1 hover:text-amber-600 cursor-pointer transition-colors">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="text-[11px] font-bold">{task.comments}</span>
                                                </div>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Quick Stats Overlay (Floating) */}
            <div className="fixed bottom-10 right-10 bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-slate-800 flex items-center gap-8 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Sprint</span>
                    <span className="text-white font-black text-lg">Feb Bloom #4</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-800" />
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {['SJ', 'MT', 'ER'].map((u, i) => (
                            <Avatar key={i} className="h-8 w-8 rounded-full border-4 border-slate-900">
                                <AvatarFallback className="bg-slate-700 text-white text-[10px] font-bold">{u}</AvatarFallback>
                            </Avatar>
                        ))}
                        <div className="h-8 w-8 rounded-full border-4 border-slate-900 bg-amber-500 flex items-center justify-center text-[10px] font-black text-slate-900">
                            +12
                        </div>
                    </div>
                </div>
                <Button className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-6 border-none h-11">
                    Manage Workflow
                </Button>
            </div>
        </div>
    )
}
