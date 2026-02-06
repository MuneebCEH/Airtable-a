import React from "react"
import {
    RefreshCcw,
    ArrowUpRight,
    ArrowDownRight,
    Play,
    Pause,
    XCircle,
    Search,
    Filter,
    MoreHorizontal,
    TrendingUp,
    Users,
    Zap,
    CreditCard,
    Calendar,
    ChevronRight
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

const subscriptions = [
    { id: "SUB-801", client: "Global Health Corp", plan: "Enterprise Elite", interval: "Annual", price: "$24,000/yr", status: "Active", renewal: "Oct 12, 2026", churn_risk: "Low" },
    { id: "SUB-802", client: "Apex BioLabs", plan: "Pro Clinical", interval: "Monthly", price: "$450/mo", status: "Active", renewal: "Feb 28, 2026", churn_risk: "Medium" },
    { id: "SUB-803", client: "NorthStar Medical", plan: "Standard Care", interval: "Monthly", price: "$199/mo", status: "Paused", renewal: "N/A", churn_risk: "High" },
    { id: "SUB-804", client: "Delta Pharma", plan: "Enterprise Elite", interval: "Annual", price: "$18,500/yr", status: "Active", renewal: "Dec 05, 2026", churn_risk: "Low" },
    { id: "SUB-805", client: "Zion Diagnostics", plan: "Pro Clinical", interval: "Monthly", price: "$450/mo", status: "Cancelled", renewal: "N/A", churn_risk: "N/A" },
]

export default function SubscriptionsPage() {
    return (
        <div className="p-8 space-y-10 bg-[#f8fafc] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-slate-950 mb-2 flex items-center gap-4">
                        <RefreshCcw className="h-10 w-10 text-amber-500 animate-spin-slow" />
                        Subscription Revenue
                    </h1>
                    <p className="text-slate-500 font-bold text-lg max-w-xl">
                        Monitor recurring revenue streams, churn performance, and pharmaceutical service lifecycle metrics.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50">
                    <div className="flex flex-col px-6 border-r border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current MRR</span>
                        <span className="text-2xl font-black text-slate-900">$84,500</span>
                    </div>
                    <div className="flex flex-col px-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Lifetime Value</span>
                        <span className="text-2xl font-black text-slate-900">$1.2M</span>
                    </div>
                    <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-8 h-14 shadow-lg shadow-amber-200 transition-all border-none">
                        Manage Plans
                    </Button>
                </div>
            </div>

            {/* Performance Analytics Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Net Revenue Retention", value: "104.2%", trend: "+2.4%", icon: TrendingUp, color: "blue", sub: "Up from 101.8% last year" },
                    { label: "Active Subscriptions", value: "842", trend: "+12", icon: Users, color: "amber", sub: "New expansion in Q1" },
                    { label: "Projected Churn", value: "1.8%", trend: "-0.4%", icon: XCircle, color: "rose", sub: "Historical low performance" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[3rem] bg-white group hover:shadow-2xl transition-all duration-700 overflow-hidden border border-slate-50">
                        <CardContent className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-5 rounded-3xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                    <stat.icon className="h-8 w-8" />
                                </div>
                                <Badge className={`rounded-xl px-4 py-1 font-black text-[12px] bg-${stat.color === 'rose' ? 'rose' : 'green'}-50 text-${stat.color === 'rose' ? 'rose' : 'green'}-600 border-none`}>
                                    {stat.trend}
                                </Badge>
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</h3>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-5xl font-black tracking-tighter text-slate-950">{stat.value}</span>
                            </div>
                            <p className="text-slate-400 font-semibold text-sm">{stat.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Subscriptions Ledger */}
            <Card className="border-none shadow-2xl shadow-slate-100 rounded-[3rem] bg-white overflow-hidden border border-slate-100">
                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                        <CardTitle className="text-2xl font-black text-slate-950 uppercase tracking-tight">Active Contracts</CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Find subscription..."
                                    className="pl-11 pr-4 rounded-xl border-none bg-slate-50 focus:bg-white focus:shadow-xl transition-all h-12 w-full sm:w-80 font-semibold"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl border-slate-100 h-12 w-12 hover:bg-white">
                                <Filter className="h-5 w-5 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400 pl-10 py-8">Subscription ID</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">Customer Entity</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">service plan</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">billing rate</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">Renewal</TableHead>
                                <TableHead className="text-[11px] font-black uppercase tracking-widest text-slate-400">Churn Risk</TableHead>
                                <TableHead className="text-right text-[11px] font-black uppercase tracking-widest text-slate-400 pr-10">Control</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptions.map((sub) => (
                                <TableRow key={sub.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-8 pl-10">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${sub.status === 'Active' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <span className="font-black text-slate-900 uppercase tracking-tighter text-lg">{sub.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 text-lg">{sub.client}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub.interval} cycle</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-xl px-4 py-1.5 font-black text-[11px] border-none shadow-sm ${sub.plan === 'Enterprise Elite' ? 'bg-indigo-600 text-white' :
                                                sub.plan === 'Pro Clinical' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {sub.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-900 text-xl tracking-tighter">{sub.price}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[14px]">
                                            <Calendar className="h-4 w-4" />
                                            {sub.renewal}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden w-24">
                                                <div className={`h-full rounded-full ${sub.churn_risk === 'Low' ? 'bg-green-500 w-1/4' :
                                                        sub.churn_risk === 'Medium' ? 'bg-amber-500 w-1/2' :
                                                            sub.churn_risk === 'High' ? 'bg-rose-500 w-3/4' : 'bg-slate-200 w-0'
                                                    }`} />
                                            </div>
                                            <span className="text-[12px] font-black text-slate-500">{sub.churn_risk}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {sub.status === 'Active' ? (
                                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-amber-50 hover:text-amber-600">
                                                    <Pause className="h-5 w-5" />
                                                </Button>
                                            ) : (
                                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-green-50 hover:text-green-600">
                                                    <Play className="h-5 w-5" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" className="rounded-xl hover:bg-slate-100 text-slate-400">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                            <ChevronRight className="h-5 w-5 text-slate-300 ml-2" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
