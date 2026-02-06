import React from "react"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    Receipt,
    PieChart,
    Truck,
    Globe,
    Cpu,
    Briefcase,
    Zap,
    Download,
    Plus
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

const expenses = [
    { id: "EXP-901", description: "AWS Cloud Infrastructure", category: "Technology", amount: "$2,450.00", date: "Feb 03, 2026", status: "Approved", method: "Corporate Card" },
    { id: "EXP-902", description: "Medical Logistics: Q1 Delivery", category: "Operations", amount: "$12,800.00", date: "Feb 02, 2026", status: "Pending", method: "Bank Transfer" },
    { id: "EXP-903", description: "Delta Pharma Conference Travel", category: "Travel", amount: "$1,200.00", date: "Feb 01, 2026", status: "Approved", method: "Reimbursement" },
    { id: "EXP-904", description: "Office Supplies & Bio-Disposal", category: "Maintenance", amount: "$450.00", date: "Jan 30, 2026", status: "Flagged", method: "Debit Card" },
    { id: "EXP-905", description: "Salesforce CRM License (Annual)", category: "Marketing", amount: "$18,500.00", date: "Jan 28, 2026", status: "Approved", method: "Bank Transfer" },
    { id: "EXP-906", description: "R&D Lab Equipment Lease", category: "Technology", amount: "$5,600.00", date: "Jan 25, 2026", status: "Review", method: "Corporate Card" },
]

export default function ExpensesPage() {
    return (
        <div className="p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-1 flex items-center gap-3">
                        <Wallet className="h-8 w-8 text-amber-500" />
                        Operational Expenses
                    </h1>
                    <p className="text-slate-500 font-bold tracking-tight">Track, categorize and audit enterprise-wide expenditure and overhead.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-black px-6 h-12 bg-white hover:shadow-lg transition-all">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button className="rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-black px-8 h-12 shadow-2xl shadow-slate-200 transition-all border-none">
                        <Plus className="mr-2 h-5 w-5 text-amber-500" /> Log Expense
                    </Button>
                </div>
            </div>

            {/* Categorized Spending Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { category: "Technology", total: "$12.4k", icon: Cpu, color: "blue", trend: "+5%" },
                    { category: "Operations", total: "$45.8k", icon: Truck, color: "amber", trend: "+12%" },
                    { category: "Travel", total: "$3.2k", icon: Globe, trend: "-2%" },
                    { category: "Maintenance", total: "$1.4k", icon: Zap, color: "rose", trend: "+$200" },
                ].map((cat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-${cat.color}-50 text-${cat.color}-600 group-hover:scale-110 transition-transform`}>
                                    <cat.icon className="h-6 w-6" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${cat.trend.startsWith('+') ? 'text-green-500' : 'text-rose-500'}`}>
                                    {cat.trend}
                                </span>
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{cat.category}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">{cat.total}</span>
                                <span className="text-[11px] font-bold text-slate-400">/mo</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Transaction Ledger */}
            <Card className="border-none shadow-2xl shadow-slate-100 rounded-[3rem] bg-white overflow-hidden border border-slate-50">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-amber-500" />
                        Expenditure History
                    </CardTitle>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by recipient, ID or tag..."
                                className="pl-11 pr-4 rounded-xl border-none bg-slate-50 focus:bg-white focus:shadow-md transition-all h-12 w-full md:w-80 font-semibold"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl border-slate-100 h-12 w-12 hover:bg-white">
                            <Filter className="h-5 w-5 text-slate-500" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-10 py-6">Voucher ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Logged</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-10">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((exp) => (
                                <TableRow key={exp.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-7 pl-10 font-black text-slate-900 tracking-tighter uppercase">{exp.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 text-[14px] uppercase tracking-tight">{exp.description}</span>
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{exp.method}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-black text-[10px] uppercase tracking-wider px-3 py-1">
                                            {exp.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-900 text-lg tracking-tighter">{exp.amount}</span>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-500 text-[12px]">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {exp.date}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${exp.status === 'Approved' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' :
                                                    exp.status === 'Pending' ? 'bg-amber-500 animate-pulse' :
                                                        exp.status === 'Flagged' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'bg-blue-500'
                                                }`} />
                                            <span className="text-[13px] font-black text-slate-900">{exp.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-10 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
                        <div>
                            <p className="text-slate-400 font-bold flex items-center gap-2">
                                <PieChart className="h-4 w-4 text-amber-500" />
                                Budget Utilization: <span className="text-slate-900 font-black">64% of Q1 Allocation</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="rounded-xl border-slate-200 font-bold px-6 bg-white">Audit All Records</Button>
                            <Button className="rounded-xl bg-slate-900 text-white font-black px-8 h-12 shadow-xl border-none hover:bg-slate-800 transition-all">Submit for Multi-Signature Approval</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
