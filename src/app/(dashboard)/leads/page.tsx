import React from "react"
import {
    PhoneIncoming,
    Mail,
    MoreHorizontal,
    Plus,
    Search,
    Filter,
    ArrowRight,
    Star,
    Briefcase,
    Timer,
    Flame,
    Zap,
    Target
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const leads = [
    { name: "John Sterling", company: "Sterling Healthcare", value: "$45,000", source: "Referral", status: "Hot", owner: "SJ", time: "2h ago" },
    { name: "Maria Garcia", company: "City Medical Center", value: "$12,500", source: "Website", status: "Warm", owner: "MT", time: "5h ago" },
    { name: "Robert Fox", company: "Fox Pharma Ltd", value: "$89,000", source: "LinkedIn", status: "Qualified", owner: "SJ", time: "1d ago" },
    { name: "Sarah Miller", company: "Blue Sky Diagnostics", value: "$3,200", source: "Direct", status: "Cold", owner: "ER", time: "3d ago" },
    { name: "David Chen", company: "Pacific Bio Research", value: "$150,000", source: "Conference", status: "Hot", owner: "MT", time: "Just now" },
]

export default function LeadsPage() {
    return (
        <div className="p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-black text-[10px] tracking-widest uppercase py-1 px-3">
                            Sales Intelligence
                        </Badge>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-bold text-xs">Updated: Feb 03, 2026</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Lead Pipeline</h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
                        Optimize conversion through advanced lead tracking and pharmaceutical sales performance metrics.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {['SJ', 'MT', 'ER'].map((u, i) => (
                            <Avatar key={i} className="h-12 w-12 rounded-2xl border-4 border-white shadow-sm ring-1 ring-slate-100">
                                <AvatarFallback className="bg-slate-900 text-white text-[10px] font-black">{u}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <Button className="rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white font-black px-8 h-14 shadow-2xl shadow-slate-200 transition-all active:scale-95 border-none">
                        <Plus className="mr-2 h-6 w-6 text-amber-500" /> New Lead
                    </Button>
                </div>
            </div>

            {/* Pipeline Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { stage: "Qualified", count: 12, value: "$240k", icon: Target, color: "blue" },
                    { stage: "Contacted", count: 28, value: "$85k", icon: PhoneIncoming, color: "amber" },
                    { stage: "Proposal", count: 8, value: "$510k", icon: Briefcase, color: "purple" },
                    { stage: "Negotiation", count: 4, value: "$1.2M", icon: Zap, color: "green" },
                    { stage: "Won", count: 156, value: "$4.8M", icon: Star, color: "pink" },
                ].map((stage, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all duration-500 overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stage.color}-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
                        <CardContent className="p-6 relative z-10">
                            <div className={`p-3 rounded-xl bg-${stage.color}-50 text-${stage.color}-600 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                <stage.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{stage.stage}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900">{stage.count}</span>
                                <span className="text-[13px] font-bold text-slate-400">{stage.value}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                            <Input
                                placeholder="Search by name, company..."
                                className="pl-11 pr-4 rounded-2xl border-none bg-slate-50 focus:bg-white focus:ring-amber-500/20 focus:shadow-md transition-all h-12 w-full md:w-80"
                            />
                        </div>
                        <Button variant="outline" className="rounded-2xl border-slate-100 h-12 px-6 font-bold text-slate-500 bg-slate-50/30 hover:bg-white">
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </div>
                    <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
                        {['All Leads', 'New', 'Nurturing', 'Unqualified'].map((tab, i) => (
                            <button key={i} className={`text-[13px] font-black whitespace-nowrap transition-all relative py-2 ${i === 0 ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                                }`}>
                                {tab}
                                {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 rounded-full" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-slate-50">
                    {leads.map((lead, i) => (
                        <div key={i} className="p-8 hover:bg-slate-50/50 transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-16 w-16 rounded-[1.5rem] border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                                    <AvatarFallback className="bg-slate-100 text-slate-900 font-black text-lg">{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2 group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                                        {lead.name}
                                        {lead.status === 'Hot' && <Flame className="h-5 w-5 text-orange-500 fill-orange-500 animate-pulse" />}
                                    </h4>
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-sm">
                                        <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {lead.company}</span>
                                        <span className="text-slate-200">|</span>
                                        <span className="flex items-center gap-1.5 text-amber-600 uppercase tracking-widest text-[10px]"><Target className="h-3 w-3" /> {lead.source}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Potential Value</span>
                                    <span className="text-lg font-black text-slate-900">{lead.value}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Engagement</span>
                                    <Badge className={`rounded-xl px-4 py-1 font-black text-[11px] uppercase tracking-wider ${lead.status === 'Hot' ? 'bg-orange-100 text-orange-700' :
                                            lead.status === 'Warm' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                        } border-none`}>
                                        {lead.status === 'Hot' ? 'Critical Interest' : lead.status === 'Warm' ? 'Active Discovery' : lead.status}
                                    </Badge>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time in Stage</span>
                                    <span className="text-[13px] font-bold text-slate-500 flex items-center gap-1.5">
                                        <Timer className="h-3.5 w-3.5" /> {lead.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
                                    <Avatar className="h-8 w-8 rounded-full ring-2 ring-white">
                                        <AvatarFallback className="bg-slate-900 text-white text-[9px] font-black">{lead.owner}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
                    <p className="text-[13px] font-bold text-slate-400">Total Pipeline Value: <span className="text-slate-900 font-black">$2.85M</span></p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl font-bold px-6 border-slate-200 bg-white">Load More Leads</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
