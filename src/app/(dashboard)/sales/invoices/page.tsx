import React from "react"
import {
    FileText,
    Download,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Mail,
    Eye,
    ChevronDown,
    ArrowUpRight,
    Wallet
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

const invoices = [
    { id: "INV-8821", client: "Global Health Corp", amount: "$12,450.00", date: "Feb 02, 2026", status: "Paid", due: "Feb 10, 2026" },
    { id: "INV-8822", client: "Apex BioLabs", amount: "$4,800.00", date: "Feb 01, 2026", status: "Overdue", due: "Feb 01, 2026" },
    { id: "INV-8823", client: "NorthStar Medical", amount: "$2,120.00", date: "Jan 28, 2026", status: "Pending", due: "Feb 15, 2026" },
    { id: "INV-8824", client: "Delta Pharma", amount: "$45,000.00", date: "Jan 25, 2026", status: "Paid", due: "Feb 05, 2026" },
    { id: "INV-8825", client: "Zion Diagnostics", amount: "$1,200.00", date: "Jan 20, 2026", status: "Draft", due: "N/A" },
    { id: "INV-8826", client: "Pacific Bio Research", amount: "$8,900.00", date: "Jan 15, 2026", status: "Overdue", due: "Jan 30, 2026" },
]

export default function InvoicesPage() {
    return (
        <div className="p-8 space-y-8 bg-[#fcfcfd] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                        <FileText className="h-8 w-8 text-amber-500" />
                        Billing & Invoices
                    </h1>
                    <p className="text-slate-500 font-medium">Generate, track and manage enterprise billing cycles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-6 h-12 hover:bg-white hover:shadow-md transition-all">
                        Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-8 h-12 shadow-lg shadow-amber-200 transition-all active:scale-95 border-none">
                        <Plus className="mr-2 h-5 w-5" /> New Invoice
                    </Button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Outstanding", amount: "$158,420.00", count: "14 Invoices", icon: Clock, color: "blue", trend: "+5.2%" },
                    { label: "Total Paid (MTD)", amount: "$412,900.00", count: "128 Invoices", icon: CheckCircle2, color: "green", trend: "+12.8%" },
                    { label: "Total Overdue", amount: "$12,850.00", count: "4 Invoices", icon: AlertTriangle, color: "rose", trend: "-2.4%" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-[12px] font-black ${stat.color === 'rose' ? 'text-rose-500' : 'text-green-500'} flex items-center gap-1 bg-${stat.color}-50 px-2 py-1 rounded-lg`}>
                                        {stat.trend} <ArrowUpRight className="h-3 w-3" />
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">vs last month</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.amount}</h3>
                                <p className="text-slate-500 font-bold text-sm mt-1">{stat.count}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Invoices List */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Invoice History</CardTitle>
                            <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[10px] px-3">2,451 Total</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    placeholder="Invoice # or client..."
                                    className="pl-11 pr-4 min-w-[300px] rounded-2xl border-none bg-slate-50 focus:bg-white focus:ring-amber-500/20 focus:shadow-md transition-all h-12"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-2xl border-slate-100 h-12 w-12 bg-slate-50/50 hover:bg-white transition-all">
                                <Filter className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent px-8">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 py-6">Invoice Number</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Issued</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((inv) => (
                                <TableRow key={inv.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-6 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <span className="font-black text-slate-900 uppercase tracking-tight">{inv.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-black text-slate-900">{inv.client}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-900 text-lg tracking-tight">{inv.amount}</span>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-500 text-[13px]">
                                        {inv.date}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                inv.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                                                    inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                            } border-none`}>
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50">
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                                <Download className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-6">
                            <p className="text-[13px] font-bold text-slate-400 flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-amber-500" />
                                Total Revenue: <span className="text-slate-900 font-black">$2.8M</span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="rounded-xl font-bold px-6 border-slate-200 bg-white">Load Archive</Button>
                            <Button className="rounded-xl bg-slate-900 text-white font-black px-6 border-none hover:bg-slate-800 transition-all">Next Page</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
