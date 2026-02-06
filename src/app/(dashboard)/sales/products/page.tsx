import React from "react"
import {
    Package,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Box,
    Tag,
    Boxes,
    AlertCircle,
    CheckCircle2,
    ArrowUpDown,
    Layers,
    Warehouse,
    TrendingUp,
    ChevronDown,
    LayoutGrid,
    List
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

const products = [
    { id: "PRD-201", name: "Dexa-Chlorine 500mg", category: "Antibiotics", stock: 842, price: "$85.00", status: "In Stock", sku: "DXC-01-A", shelf: "A-12" },
    { id: "PRD-202", name: "Insulin Glargine 10ml", category: "Endocrinology", stock: 12, price: "$120.50", status: "Low Stock", sku: "INS-GL-09", shelf: "B-04" },
    { id: "PRD-203", name: "Lipid-Profile Kit (25u)", category: "Diagnostics", stock: 0, price: "$340.00", status: "Out of Stock", sku: "LPK-DX-25", shelf: "D-01" },
    { id: "PRD-204", name: "Surgical Mastery Gloves", category: "Equipment", stock: 2450, price: "$12.00", status: "In Stock", sku: "SMG-08-L", shelf: "W-05" },
    { id: "PRD-205", name: "Ceftriaxone 1g Inject.", category: "Antibiotics", stock: 156, price: "$22.40", status: "In Stock", sku: "CFT-1G-IN", shelf: "A-08" },
    { id: "PRD-206", name: "BP Monitor (Digital)", category: "Devices", stock: 48, price: "$65.00", status: "Low Stock", sku: "BPM-D-01", shelf: "B-22" },
]

export default function ProductsPage() {
    return (
        <div className="p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center gap-4">
                        <Box className="h-10 w-10 text-amber-500 shadow-amber-200" />
                        Asset Catalog
                    </h1>
                    <p className="text-slate-500 font-bold text-lg max-w-2xl leading-relaxed">
                        Precision inventory management for pharmaceutical assets and diagnostic medical equipment.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-black px-6 h-12 bg-white hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Warehouse className="h-4 w-4 text-amber-500" /> All Warehouses <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 h-12 shadow-xl shadow-amber-200 transition-all active:scale-95 border-none">
                        <Plus className="mr-2 h-6 w-6" /> Add Product
                    </Button>
                </div>
            </div>

            {/* Quick Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Asset Value", value: "$1.84M", icon: Boxes, color: "blue", trend: "+$24k" },
                    { label: "Critical Stock", value: "24 Items", icon: AlertCircle, color: "rose", trend: "+3 new" },
                    { label: "Monthly Sales", value: "2,450u", icon: TrendingUp, color: "green", trend: "+12%" },
                    { label: "SKU Diversity", value: "1,240", icon: Tag, color: "purple", trend: "stable" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl transition-all duration-500 border border-slate-50 relative overflow-hidden">
                        <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full group-hover:scale-150 transition-transform`} />
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:rotate-12 transition-transform`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.trend}</span>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Catalog Grid/Table */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <Layers className="h-6 w-6 text-amber-500" />
                        </div>
                        <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Inventory Ledger</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:flex-none">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                placeholder="Search inventory..."
                                className="pl-11 pr-4 rounded-2xl border-none bg-slate-50 focus:bg-white focus:shadow-md transition-all h-12 w-full md:w-80 font-semibold"
                            />
                        </div>
                        <Button variant="outline" className="rounded-2xl h-12 w-12 border-slate-100 bg-slate-50/50 hover:bg-white p-0">
                            <Filter className="h-5 w-5 text-slate-500" />
                        </Button>
                        <div className="w-[1px] h-8 bg-slate-100 mx-1 hidden md:block" />
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl bg-white shadow-sm"><List className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-slate-400"><LayoutGrid className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent px-8">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-10 py-6">Product Details</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Levels</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shelf Loc.</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Availability</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-400 pr-10">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((prd) => (
                                <TableRow key={prd.id} className="border-slate-50 hover:bg-slate-50/50 transition-all group">
                                    <TableCell className="py-7 pl-10">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                                                <Package className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-[15px] group-hover:text-amber-600 transition-colors uppercase tracking-tight">{prd.name}</p>
                                                <p className="text-[11px] font-bold text-slate-400 tracking-widest">SKU: {prd.sku}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-black text-[10px] uppercase tracking-wider px-3 py-1">
                                            {prd.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between text-[12px] font-black text-slate-900 pr-4">
                                                <span>{prd.stock} units</span>
                                                <span className="text-slate-400 text-[10px]">LMT: 200</span>
                                            </div>
                                            <div className="w-32 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${prd.stock === 0 ? 'bg-slate-200 w-0' :
                                                        prd.stock < 100 ? 'bg-rose-500 w-1/5' : 'bg-green-500 w-4/5'
                                                    }`} />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-900 text-[16px] tracking-tight">{prd.price}</span>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-500 text-[13px]">
                                        <div className="flex items-center gap-1.5 bg-slate-100 w-fit px-3 py-1 rounded-lg border border-slate-200">
                                            <Warehouse className="h-3.5 w-3.5" />
                                            {prd.shelf}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {prd.status === 'In Stock' ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-rose-500" />
                                            )}
                                            <span className={`text-[12px] font-black uppercase tracking-wider ${prd.status === 'In Stock' ? 'text-green-600' :
                                                    prd.status === 'Low Stock' ? 'text-amber-600' : 'text-rose-600'
                                                }`}>
                                                {prd.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100">
                                                <MoreHorizontal className="h-5 w-5 text-slate-400" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-10 bg-[#0f172a] flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-800">
                        <div>
                            <p className="text-slate-400 font-bold mb-1">Global Stock Distribution</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Delta Logistics Synchronization: ACTIVE</p>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="rounded-xl border-slate-700 text-slate-400 hover:bg-slate-800 font-bold">Download Inventory Report</Button>
                            <Button className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-8 h-12 border-none transition-all shadow-xl shadow-amber-500/10">Synchronize All Sites</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
