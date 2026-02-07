import React from "react"
import { FileSignature, ShieldCheck, Download, Search, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ContractsPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/20 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Legal & Contracts</h1>
                    <p className="text-slate-500 font-medium">Repository for all executed healthcare provider agreements.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-6 h-12 hover:bg-white transition-all">
                        <Download className="mr-2 h-4 w-4" /> Export All
                    </Button>
                    <Button className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black px-6 h-12 shadow-lg shadow-emerald-200 border-none text-white transition-all">
                        <FileSignature className="mr-2 h-5 w-5" /> New Agreement
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Contract Management</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search contracts..." className="pl-10 rounded-xl border-slate-100 w-80" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-20 flex flex-col items-center justify-center text-slate-400">
                    <div className="p-6 bg-emerald-50 rounded-full mb-6">
                        <ShieldCheck className="h-10 w-10 text-emerald-600 opacity-60" />
                    </div>
                    <p className="text-lg font-black text-slate-900 mb-2">No Active Contracts</p>
                    <p className="text-sm max-w-sm text-center">All legal documents are currently being migrated to the new secure vault.</p>
                </CardContent>
            </Card>
        </div>
    )
}
