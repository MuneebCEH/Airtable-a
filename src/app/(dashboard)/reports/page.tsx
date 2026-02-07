import React from "react"
import { BarChart3, TrendingUp, PieChart, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/20 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Intelligence Reports</h1>
                    <p className="text-slate-500 font-medium">Advanced analytics and operational performance tracking.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-4 h-11">
                        <Calendar className="mr-2 h-4 w-4" /> This Year
                    </Button>
                    <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 font-black px-6 h-11 text-white shadow-xl shadow-slate-200 border-none transition-all">
                        <Download className="mr-2 h-4 w-4" /> Generate PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: "Compliance Rate", value: "94.2%", icon: TrendingUp, color: "emerald" },
                    { label: "Avg. Processing Time", value: "1.4 Days", icon: BarChart3, color: "blue" },
                    { label: "Return Efficiency", value: "88.7%", icon: PieChart, color: "amber" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={`p-4 rounded-3xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <BarChart3 className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Analytical Engine Initializing</h3>
                <p className="text-slate-400 max-w-sm font-medium">We are aggregating data across all sheets to provide you with a comprehensive performance overview.</p>
            </Card>
        </div>
    )
}
