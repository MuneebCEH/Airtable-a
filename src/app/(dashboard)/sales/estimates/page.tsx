import React from "react"
import {
    FileSignature,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    ArrowRightLeft,
    FileCheck,
    Calendar,
    Target,
    Send,
    Eye,
    ChevronDown
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

const estimates = [
    { id: "EST-4001", client: "Global Health Corp", value: "$120,000.00", date: "Feb 03, 2026", expiry: "Feb 17, 2026", status: "Sent", probability: "85%" },
    { id: "EST-4002", client: "Apex BioLabs", value: "$45,500.00", date: "Feb 02, 2026", expiry: "Feb 16, 2026", status: "Accepted", probability: "100%" },
    { id: "EST-4003", client: "NorthStar Medical", value: "$8,900.00", date: "Feb 01, 2026", expiry: "Feb 15, 2026", status: "Expired", probability: "0%" },
    { id: "EST-4004", client: "Zion Diagnostics", value: "$22,400.00", date: "Jan 30, 2026", expiry: "Feb 13, 2026", status: "Review", probability: "45%" },
    { id: "EST-4005", client: "Delta Pharma", value: "$250,000.00", date: "Jan 28, 2026", expiry: "Feb 11, 2026", status: "Declined", probability: "0%" },
]

export default function EstimatesPage() {
    return (
        <div className="p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                        <FileSignature className="h-8 w-8 text-amber-500" />
                        Service Estimates
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight">Manage complex pharmaceutical service quotes and project proposals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-black px-6 h-12 hover:bg-white hover:shadow-lg transition-all flex items-center gap-2">
                        Templates <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black px-8 h-12 shadow-xl shadow-amber-200 transition-all active:scale-95 border-none">
                        <Plus className="mr-2 h-5 w-5" /> New Estimate
                    </Button>
                </div>
            </div>

            {/* Pipeline Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Quotes", value: "42", metric: "$1.4M", color: "blue" },
                    { label: "Conversion Rate", value: "68%", metric: "+12%", color: "amber" },
                    { label: "Pending Review", value: "12", metric: "$450k", color: "purple" },
                    { label: "Expiring Soon", value: "5", metric: "$85k", color: "rose" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-8">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">{stat.label}</h3>
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                                <span className={`text-[12px] font-black text-${stat.color}-600 bg-${stat.color}-50 px-3 py-1 rounded-lg`}>{stat.metric}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-50 rounded-full mt-6 overflow-hidden">
                                <div className={`h-full bg-${stat.color}-500 w-2/3 group-hover:w-full transition-all duration-1000`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Estimates Table */}
            <Card className="border-none shadow-2xl shadow-slate-100 rounded-[3rem] bg-white overflow-hidden border border-slate-50">
                <CardHeader className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-50">
                    <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Target className="h-5 w-5 text-amber-500" />
                        Sales Quotes
                    </CardTitle>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative group w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by recipient or ID..."
                                className="pl-11 pr-4 rounded-xl border-none bg-slate-50 focus:bg-white focus:shadow-md transition-all h-11"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl border-slate-100 h-11 w-11 hover:bg-white flex-shrink-0">
                            <Filter className="h-4 w-4 text-slate-500" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent pl-8">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-8 py-6">Reference</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quote Total</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Issued On</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valid Until</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {estimates.map((est) => (
                                <TableRow key={est.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-6 pl-8 font-black text-slate-900 tracking-tight">{est.id}</TableCell>
                                    <TableCell>
                                        <p className="font-black text-slate-900">{est.client}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-900 text-lg tracking-tight">{est.value}</span>
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Prob: {est.probability}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-500 text-[13px]">{est.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[13px]">
                                            <Clock className="h-3.5 w-3.5" />
                                            {est.expiry}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-xl px-4 py-1 font-black text-[10px] uppercase tracking-wider ${est.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                                est.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                                                    est.status === 'Expired' ? 'bg-rose-100 text-rose-700' :
                                                        est.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                            } border-none`}>
                                            {est.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100 hover:text-amber-500 transition-all">
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                            {est.status === 'Accepted' ? (
                                                <Button size="sm" className="rounded-xl bg-slate-900 text-white font-black px-4 h-9 shadow-lg hover:shadow-xl transition-all border-none flex items-center gap-2">
                                                    <ArrowRightLeft className="h-3.5 w-3.5 text-amber-500" /> Invoice
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-slate-100 hover:text-blue-500 transition-all">
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="p-10 bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h4 className="text-white text-2xl font-black mb-3 italic">Quote Intelligence Hub</h4>
                        <p className="text-slate-400 font-medium max-w-lg mb-6 leading-relaxed">
                            Automate your estimate lifecycle with smart predictive conversion analysis and real-time client interaction monitoring.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pipeline Total</span>
                                <span className="text-white font-black text-xl">$4.2M</span>
                            </div>
                            <div className="w-[1px] h-10 bg-slate-800" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Avg. Cycle</span>
                                <span className="text-white font-black text-xl">4 Days</span>
                            </div>
                        </div>
                    </div>
                    <Button className="rounded-2xl bg-amber-500 hover:bg-white text-slate-950 font-black px-12 h-16 shadow-2xl shadow-amber-500/20 text-lg transition-all border-none">
                        Optimize Pipeline →
                    </Button>
                </div>
            </div>
        </div>
    )
}
