import React from "react"
import { Database, Shield, Download, RefreshCw, Clock, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminBackupsPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/20 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">System Backups</h1>
                    <p className="text-slate-500 font-medium">Manage database snapshots and data redundancy.</p>
                </div>
                <Button className="rounded-2xl bg-amber-600 hover:bg-amber-700 font-black px-6 h-12 shadow-lg shadow-amber-200 border-none text-white transition-all">
                    <RefreshCw className="mr-2 h-5 w-5" /> Take Snapshot Now
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm rounded-[2rem] bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <Shield className="h-5 w-5 text-amber-400" />
                            </div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Active Protection</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-black mb-2">99.9%</div>
                        <p className="text-slate-400 text-sm font-medium">Automated hourly backups are active and verified.</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <HardDrive className="h-5 w-5 text-amber-600" />
                            </div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">Total Storage</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="text-4xl font-black mb-2 text-slate-900">1.2 GB</div>
                        <p className="text-slate-400 text-sm font-medium">Snapshot history covers the last 30 operational days.</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Backup History</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Size</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { date: "Feb 05, 2026 18:00", size: "12.4 MB", status: "Success" },
                                { date: "Feb 05, 2026 17:00", size: "12.3 MB", status: "Success" },
                                { date: "Feb 05, 2026 16:00", size: "12.3 MB", status: "Success" },
                            ].map((b, i) => (
                                <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-4 font-bold text-slate-700">{b.date}</td>
                                    <td className="px-8 py-4 font-mono text-sm text-slate-500">{b.size}</td>
                                    <td className="px-8 py-4">
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase tracking-tighter hover:bg-emerald-50">Verified</Badge>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="rounded-xl group-hover:bg-white shadow-sm">
                                            <Download className="h-4 w-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
