import React from "react"
import {
    CreditCard,
    ArrowDownLeft,
    ArrowUpRight,
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    ShieldCheck,
    Globe,
    Banknote,
    Zap
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const payments = [
    { id: "PAY-00342", customer: "John Sterling", method: "Visa •••• 4242", amount: "+ $1,450.00", date: "Feb 03, 11:42 AM", status: "Successful", type: "Subscription" },
    { id: "PAY-00343", customer: "Maria Garcia", method: "Bank Transfer", amount: "+ $12,500.00", date: "Feb 03, 10:15 AM", status: "Processing", type: "One-time" },
    { id: "PAY-00344", customer: "Global Health Corp", method: "Corporate Amex •••• 1002", amount: "+ $45,000.00", date: "Feb 02, 09:30 PM", status: "Successful", type: "Enterprise" },
    { id: "PAY-00345", customer: "Robert Fox", company: "Fox Pharma Ltd", method: "PayPal", amount: "+ $89.00", date: "Feb 02, 04:20 PM", status: "Refunded", type: "Add-on" },
    { id: "PAY-00346", customer: "Apex BioLabs", method: "Visa •••• 9921", amount: "+ $4,800.00", date: "Feb 01, 11:00 AM", status: "Failed", type: "Setup Fee" },
]

export default function PaymentsPage() {
    return (
        <div className="p-8 space-y-8 bg-[#fafafa] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-amber-500" />
                        Live Payments
                    </h1>
                    <p className="text-slate-500 font-medium">Real-time transaction monitoring and settlement reconciliation.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-6 h-12 hover:bg-white hover:shadow-md transition-all">
                        <ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> Security Log
                    </Button>
                    <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-8 h-12 shadow-lg shadow-slate-200 transition-all active:scale-95 border-none">
                        <Zap className="mr-2 h-5 w-5 text-amber-500" /> Payment Settings
                    </Button>
                </div>
            </div>

            {/* Transaction Pulse Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Net Volume", value: "$42.8k", icon: Globe, trend: "+14%", color: "amber" },
                    { label: "Avg. Transaction", value: "$1,240", icon: Banknote, trend: "+2%", color: "blue" },
                    { label: "Success Rate", value: "98.4%", icon: ShieldCheck, trend: "+0.2%", color: "green" },
                    { label: "Refunds", value: "$840", icon: ArrowUpRight, trend: "-40%", color: "rose" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2.2rem] bg-white group hover:shadow-xl transition-all duration-500 overflow-hidden relative border border-slate-50">
                        <CardContent className="p-7">
                            <div className="flex justify-between items-center mb-4">
                                <div className={`p-4 rounded-3xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className={`text-[10px] font-black tracking-widest uppercase ${stat.color === 'rose' ? 'text-rose-500' : 'text-green-500'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Payments Ledger */}
            <Card className="border-none shadow-xl shadow-slate-100 rounded-[3rem] bg-white overflow-hidden">
                <div className="p-8 pb-0 border-b border-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-6">
                            <button className="text-[13px] font-black text-slate-900 border-b-2 border-amber-500 pb-2">All Transactions</button>
                            <button className="text-[13px] font-black text-slate-400 hover:text-slate-600 transition-colors pb-2">Refunds</button>
                            <button className="text-[13px] font-black text-slate-400 hover:text-slate-600 transition-colors pb-2">Chargebacks</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Transaction ID, customer..."
                                    className="pl-11 pr-4 rounded-xl border-none bg-slate-50 focus:bg-white focus:shadow-md transition-all h-11 w-64"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="rounded-xl border-slate-100 h-11 w-11 hover:bg-white transition-all">
                                <Filter className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>
                </div>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent px-8">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 py-6">Transaction ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer / Entity</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Method</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Time</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((pay) => (
                                <TableRow key={pay.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-6 pl-8">
                                        <span className="font-black text-slate-900 uppercase tracking-tight text-[13px]">{pay.id}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                                                <AvatarFallback className="bg-slate-100 text-slate-900 font-bold text-[10px] uppercase">
                                                    {pay.customer.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 text-[14px]">{pay.customer}</span>
                                                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{pay.type}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-[13px]">
                                            <div className="w-8 h-5 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                                                <CreditCard className="h-3 w-3 text-slate-400" />
                                            </div>
                                            {pay.method}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-black text-[15px] tracking-tight ${pay.amount.startsWith('-') ? 'text-rose-600' : 'text-slate-900'
                                            }`}>
                                            {pay.amount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-400 text-[12px]">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {pay.date}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${pay.status === 'Successful' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' :
                                                    pay.status === 'Processing' ? 'bg-amber-500 animate-pulse' :
                                                        pay.status === 'Refunded' ? 'bg-blue-500' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                                                }`} />
                                            <span className="text-[13px] font-black text-slate-900">{pay.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                            <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-8 flex items-center justify-between border-t border-slate-50">
                        <p className="text-[12px] font-bold text-slate-400">Secure automated settlement enabled via Delta Gateway.</p>
                        <div className="flex gap-2">
                            <Button variant="ghost" className="font-bold text-slate-400 hover:text-slate-900">Download CSV</Button>
                            <Button className="rounded-xl bg-slate-900 text-white font-black px-6 h-10 hover:shadow-lg transition-all border-none">View All Page</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
