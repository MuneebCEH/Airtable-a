import React from "react"
import {
    Users,
    Building2,
    TrendingUp,
    ShieldCheck,
    MoreHorizontal,
    Plus,
    Search,
    Filter,
    Download,
    ArrowUpRight,
    BadgeCheck,
    Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const clients = [
    { id: "CL-001", name: "Global Health Corp", industry: "Healthcare", status: "Active", value: "$450,000", growth: "+12%", avatar: "GH" },
    { id: "CL-002", name: "Apex BioLabs", industry: "Pharmaceutical", status: "Active", value: "$280,000", growth: "+8%", avatar: "AB" },
    { id: "CL-003", name: "NorthStar Medical", industry: "Clinical Research", status: "Pending", value: "$120,000", growth: "+0%", avatar: "NM" },
    { id: "CL-004", name: "Delta Pharma", industry: "Life Sciences", status: "Active", value: "$890,000", growth: "+24%", avatar: "DP" },
    { id: "CL-005", name: "Zion Diagnostics", industry: "Diagnostics", status: "Inactive", value: "$50,000", growth: "-5%", avatar: "ZD" },
]

export default function ClientsPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/30 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Corporate Clients</h1>
                    <p className="text-slate-500 font-medium">Manage and monitor enterprise-level healthcare partnerships.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-6 h-12 hover:bg-white hover:shadow-md transition-all">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-black px-6 h-12 shadow-lg shadow-amber-200 transition-all active:scale-95 border-none">
                        <Plus className="mr-2 h-5 w-5" /> Add New Client
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Clients", value: "342", icon: Users, trend: "+12.5%", color: "amber" },
                    { label: "Active Revenue", value: "$2.4M", icon: TrendingUp, trend: "+8.2%", color: "blue" },
                    { label: "Compliance Rate", value: "99.4%", icon: ShieldCheck, trend: "+0.3%", color: "green" },
                    { label: "Global Entities", value: "18", icon: Globe, trend: "+2", color: "purple" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-500 bg-white">
                        <CardContent className="p-7">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider">
                                    Last 30 Days
                                </Badge>
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                                    <span className="text-[12px] font-bold text-green-500 flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                                        {stat.trend} <ArrowUpRight className="h-3 w-3 ml-0.5" />
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Section */}
            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="px-8 pt-8 pb-0 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-amber-500" />
                            Client Registry
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    placeholder="Search clients..."
                                    className="pl-11 pr-4 min-w-[280px] rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-amber-500/20 focus:border-amber-500 transition-all h-11"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-2xl border-slate-100 h-11 w-11 bg-slate-50/50 hover:bg-white transition-all">
                                <Filter className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent px-8">
                                <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8">Client Name</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Annual Value</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trend</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id} className="border-slate-50 hover:bg-slate-50/40 transition-colors group">
                                    <TableCell className="py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-11 w-11 rounded-2xl border-2 border-slate-50 shadow-sm group-hover:scale-105 transition-transform">
                                                <AvatarFallback className="bg-slate-900 text-white font-black text-xs">{client.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-black text-slate-900 flex items-center gap-1.5">
                                                    {client.name}
                                                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-400">{client.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[11px] rounded-lg">
                                            {client.industry}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${client.status === 'Active' ? 'bg-green-500' : client.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-300'
                                                }`} />
                                            <span className="text-[13px] font-black text-slate-700">{client.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-900 text-[14px]">
                                        {client.value}
                                    </TableCell>
                                    <TableCell>
                                        <p className={`text-[13px] font-black ${client.growth.startsWith('+') ? 'text-green-600' : 'text-rose-500'}`}>
                                            {client.growth}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 transition-all">
                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                        <p className="text-[12px] font-bold text-slate-400 mr-auto">Showing 5 of 342 enterprise clients</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200">Previous</Button>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-200">Next</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
