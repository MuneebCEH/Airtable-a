"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
    Plus,
    Play,
    Save,
    Database,
    Mail,
    MessageSquare,
    Settings2,
    ChevronRight,
    Search,
    Clock,
    Zap,
    X,
    Filter,
    Bot,
    Globe,
    Webhook,
    LayoutGrid,
    Cpu,
    Sparkles,
    Hash,
    Layers,
    ArrowRight,
    Facebook,
    MessageCircle,
    Instagram,
    Send,
    Phone,
    Share2,
    Lock,
    Link2,
    Unlink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProjects } from "@/app/actions/projects"
import { getSheets } from "@/app/actions/sheets"
import { cn } from "@/lib/utils"

// Icon mapping for persistence
const ICON_MAP: Record<string, any> = {
    Zap, Database, Webhook, Bot, Sparkles, Cpu, Mail, MessageCircle, Facebook, MessageSquare, Instagram, Send
}

interface Node {
    id: string
    type: "trigger" | "action" | "data" | "ai" | "api" | "social"
    label: string
    iconName: string
    config: any
    position: { x: number, y: number }
}

interface Connection {
    id: string
    fromId: string
    toId: string
}

const TOOLBOX_GROUPS = [
    {
        name: "Core Triggers",
        items: [
            { id: 't_row', label: 'Row Updated', type: 'trigger', iconName: 'Zap', color: 'orange' },
            { id: 't_lead', label: 'New Lead', type: 'trigger', iconName: 'Database', color: 'orange' },
            { id: 't_webhook', label: 'Webhook', type: 'trigger', iconName: 'Webhook', color: 'orange' },
        ]
    },
    {
        name: "AI & Automation",
        items: [
            { id: 'ai_gpt', label: 'ChatGPT 4.o', type: 'ai', iconName: 'Bot', color: 'emerald' },
            { id: 'ai_vision', label: 'Image Analysis', type: 'ai', iconName: 'Sparkles', color: 'emerald' },
            { id: 'tool_script', label: 'Code Execution', type: 'api', iconName: 'Cpu', color: 'purple' },
        ]
    },
    {
        name: "Communication",
        items: [
            { id: 'com_gmail', label: 'Gmail', type: 'action', iconName: 'Mail', color: 'red' },
            { id: 'com_wa', label: 'WhatsApp Business', type: 'social', iconName: 'MessageCircle', color: 'green' },
            { id: 'com_fb', label: 'Facebook Messenger', type: 'social', iconName: 'Facebook', color: 'blue' },
            { id: 'com_slack', label: 'Slack Connect', type: 'action', iconName: 'MessageSquare', color: 'blue' },
        ]
    },
    {
        name: "Social Media",
        items: [
            { id: 'soc_insta', label: 'Instagram DM', type: 'social', iconName: 'Instagram', color: 'pink' },
            { id: 'soc_tg', label: 'Telegram Bot', type: 'social', iconName: 'Send', color: 'sky' },
        ]
    }
]

export default function AutomationPage() {
    const [nodes, setNodes] = useState<Node[]>([
        {
            id: "1",
            type: "trigger",
            label: "When Row Updated",
            iconName: "Zap",
            config: { projectId: '', sheetId: '', column: '' },
            position: { x: 100, y: 150 }
        }
    ])
    const [connections, setConnections] = useState<Connection[]>([])
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>("1")
    const [activeTab, setActiveTab] = useState("nodes")
    const [projects, setProjects] = useState<any[]>([])
    const [sheets, setSheets] = useState<any[]>([])
    const [columns, setColumns] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    // Interaction States
    const [isDragging, setIsDragging] = useState(false)
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    // Connection States
    const [linkingFromId, setLinkingFromId] = useState<string | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const canvasRef = useRef<HTMLDivElement>(null)

    // Load from LocalStorage
    useEffect(() => {
        const savedNodes = localStorage.getItem('automation_nodes')
        const savedConnections = localStorage.getItem('automation_connections')

        if (savedNodes) setNodes(JSON.parse(savedNodes))
        if (savedConnections) setConnections(JSON.parse(savedConnections))
    }, [])

    // Save to LocalStorage
    useEffect(() => {
        if (nodes.length > 0) {
            localStorage.setItem('automation_nodes', JSON.stringify(nodes))
        }
        localStorage.setItem('automation_connections', JSON.stringify(connections))
    }, [nodes, connections])

    useEffect(() => {
        async function loadData() {
            const data = await getProjects()
            setProjects(data)
        }
        loadData()
    }, [])

    const handleProjectSelect = async (projectId: string) => {
        const data = await getSheets(projectId)
        setSheets(data)
        setColumns([])
        setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, config: { ...n.config, projectId, sheetId: '', column: '' } } : n))
    }

    const handleSheetSelect = (sheetId: string) => {
        const sheet = sheets.find(s => s.id === sheetId)
        if (sheet && sheet.columns) setColumns(sheet.columns)
        setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, config: { ...n.config, sheetId, column: '' } } : n))
    }

    const handleColumnSelect = (columnName: string) => {
        setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, config: { ...n.config, column: columnName } } : n))
    }

    const deleteNode = (id: string) => {
        setNodes(prev => prev.filter(n => n.id !== id))
        setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id))
        if (selectedNodeId === id) {
            setSelectedNodeId(null)
            setActiveTab("nodes")
        }
    }

    const addNodeFromToolbox = (item: any) => {
        const newNode: Node = {
            id: Math.random().toString(36).substr(2, 9),
            type: item.type,
            label: item.label,
            iconName: item.iconName,
            config: {},
            position: { x: 200 + Math.random() * 50, y: 200 + Math.random() * 50 }
        }
        setNodes([...nodes, newNode])
        setSelectedNodeId(newNode.id)
        setActiveTab("config")
    }

    // Drag and Drop Logic
    const onMouseDown = (e: React.MouseEvent, id: string) => {
        if (linkingFromId) return
        e.stopPropagation()
        setIsDragging(true)
        setDraggingNodeId(id)
        setSelectedNodeId(id)
        setActiveTab("config")
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    // Connection Logic
    const startLinking = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        setLinkingFromId(id)
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect()
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }
    }

    const endLinking = (e: React.MouseEvent, toId: string) => {
        e.stopPropagation()
        if (linkingFromId && linkingFromId !== toId) {
            // Check if connection already exists
            const exists = connections.some(c => c.fromId === linkingFromId && c.toId === toId)
            if (!exists) {
                setConnections([...connections, { id: Math.random().toString(36).substr(2, 9), fromId: linkingFromId, toId }])
            }
        }
        setLinkingFromId(null)
    }

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!canvasRef.current) return
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const x = e.clientX - canvasRect.left
        const y = e.clientY - canvasRect.top

        if (isDragging && draggingNodeId) {
            const nx = x - dragOffset.x
            const ny = y - dragOffset.y
            setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, position: { x: nx, y: ny } } : n))
        }

        if (linkingFromId) {
            setMousePos({ x, y })
        }
    }, [isDragging, draggingNodeId, dragOffset, linkingFromId])

    const onMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false)
            setDraggingNodeId(null)
        }
    }, [isDragging])

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [onMouseMove, onMouseUp])

    // Path Logic
    const getPath = (start: { x: number, y: number }, end: { x: number, y: number }) => {
        const dx = Math.abs(end.x - start.x) * 0.5
        return `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`
    }

    const removeConnection = (id: string) => {
        setConnections(prev => prev.filter(c => c.id !== id))
    }

    const currentNode = nodes.find(n => n.id === selectedNodeId)

    return (
        <div className="flex-1 flex flex-col h-full bg-[#050506] text-zinc-400 overflow-hidden select-none font-sans" onMouseUp={() => setLinkingFromId(null)}>
            {/* Header */}
            <div className="h-16 border-b border-zinc-800/40 bg-zinc-950/80 backdrop-blur-2xl px-8 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-lg text-white tracking-widest uppercase italic">Neural Flow</h1>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase">SYSTEM::OPERATIONAL</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-10 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.3)] transform hover:scale-105 transition-all">
                        <Play className="w-5 h-5 mr-3 fill-current" />
                        EXECUTE WORKFLOW
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Canvas Area */}
                <div
                    ref={canvasRef}
                    className="flex-1 relative bg-[#050506] overflow-hidden"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #1a1a1e 1.5px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                >
                    {/* SVG Layer for Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        <defs>
                            <filter id="glow-line">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Existing Connections */}
                        {connections.map(conn => {
                            const fromNode = nodes.find(n => n.id === conn.fromId)
                            const toNode = nodes.find(n => n.id === conn.toId)
                            if (!fromNode || !toNode) return null

                            const start = { x: fromNode.position.x + 288, y: fromNode.position.y + 52 }
                            const end = { x: toNode.position.x, y: toNode.position.y + 52 }

                            return (
                                <g key={conn.id} className="cursor-pointer pointer-events-auto group">
                                    <path
                                        d={getPath(start, end)}
                                        stroke="rgba(59,130,246,0.2)"
                                        strokeWidth="10"
                                        fill="none"
                                        className="hover:stroke-red-500/10 transition-colors"
                                        onClick={() => removeConnection(conn.id)}
                                    />
                                    <path
                                        d={getPath(start, end)}
                                        stroke="url(#flow-grad-main)"
                                        strokeWidth="3"
                                        fill="none"
                                        filter="url(#glow-line)"
                                        className="group-hover:stroke-red-500 transition-colors animate-dash shadow-2xl"
                                        style={{ strokeDasharray: '8, 4' }}
                                    />
                                    <linearGradient id="flow-grad-main" gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </g>
                            )
                        })}

                        {/* Active Linking Line */}
                        {linkingFromId && (
                            <path
                                d={getPath(
                                    { x: (nodes.find(n => n.id === linkingFromId)?.position.x || 0) + 288, y: (nodes.find(n => n.id === linkingFromId)?.position.y || 0) + 52 },
                                    mousePos
                                )}
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeDasharray="5,5"
                                fill="none"
                                opacity="0.6"
                            />
                        )}
                    </svg>

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const IconComponent = ICON_MAP[node.iconName] || Zap
                        return (
                            <div
                                key={node.id}
                                style={{ left: `${node.position.x}px`, top: `${node.position.y}px` }}
                                onMouseDown={(e) => onMouseDown(e, node.id)}
                                className={cn(
                                    "absolute w-72 group cursor-grab active:cursor-grabbing transform-gpu z-20",
                                    selectedNodeId === node.id && "z-30 scale-[1.03]"
                                )}
                            >
                                <Card className={cn(
                                    "p-6 rounded-[2rem] border-2 bg-black/60 backdrop-blur-2xl transition-all duration-500 shadow-2xl relative overflow-hidden",
                                    selectedNodeId === node.id ? "border-primary ring-1 ring-primary/50" : "border-zinc-800/50 hover:border-zinc-700/80"
                                )}>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                                            node.type === 'trigger' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                node.type === 'ai' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        )}>
                                            <IconComponent className="w-8 h-8" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">{node.type}</div>
                                            <div className="text-zinc-100 font-bold text-lg truncate">{node.label}</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all z-50 shadow-xl"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>

                                    {/* Connections Ports */}
                                    {/* Output Port */}
                                    <div
                                        className="absolute -right-2 top-11 w-4 h-4 rounded-full bg-zinc-950 border-[3px] border-primary cursor-crosshair shadow-[0_0_10px_rgba(59,130,246,0.5)] z-50 hover:scale-125 transition-transform"
                                        onMouseDown={(e) => startLinking(e, node.id)}
                                    />
                                    {/* Input Port (Except Triggers) */}
                                    {node.type !== 'trigger' && (
                                        <div
                                            className="absolute -left-2 top-11 w-4 h-4 rounded-full bg-zinc-950 border-[3px] border-zinc-600 cursor-pointer z-50 hover:bg-primary transition-all"
                                            onMouseUp={(e) => endLinking(e, node.id)}
                                        />
                                    )}

                                    {node.config.projectId && (
                                        <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center gap-2">
                                            <Database className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase">{projects.find(p => p.id === node.config.projectId)?.name}</span>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        )
                    })}
                </div>

                {/* Right Sidebar */}
                <div className="w-[480px] border-l border-zinc-800/40 bg-black/80 backdrop-blur-3xl flex flex-col shrink-0 z-50 relative h-full overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-zinc-800/50 shrink-0">
                            <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl w-full">
                                <TabsTrigger value="nodes" className="flex-1 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white gap-3 py-3 font-bold text-xs uppercase tracking-widest">
                                    <LayoutGrid className="w-4 h-4" />
                                    TOOLBOX
                                </TabsTrigger>
                                <TabsTrigger value="config" className="flex-1 rounded-xl data-[state=active]:bg-zinc-800 data-[state=active]:text-white gap-3 py-3 font-bold text-xs uppercase tracking-widest">
                                    <Settings2 className="w-4 h-4" />
                                    PROPERTY
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="nodes" className="flex-1 flex flex-col m-0 outline-none overflow-hidden">
                            <div className="p-8 shrink-0">
                                <Input
                                    placeholder="Search protocols..."
                                    className="bg-zinc-900/40 border-zinc-800/80 h-14 rounded-2xl pl-6 font-bold text-xs tracking-widest"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto px-8 custom-scrollbar">
                                <div className="space-y-10 pb-12">
                                    {TOOLBOX_GROUPS.map((group) => (
                                        <div key={group.name} className="space-y-6">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">{group.name}</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {group.items.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
                                                    const IconComp = ICON_MAP[item.iconName] || Zap
                                                    return (
                                                        <Card
                                                            key={item.id}
                                                            onClick={() => addNodeFromToolbox(item)}
                                                            className="p-5 bg-zinc-900/20 border-zinc-800/40 hover:border-zinc-600/60 hover:bg-zinc-900/40 cursor-pointer group rounded-3xl"
                                                        >
                                                            <IconComp className={cn("w-6 h-6 mb-4", `text-${item.color}-500 group-hover:scale-110 transition-transform`)} />
                                                            <div className="text-sm font-black text-zinc-100 tracking-tight">{item.label}</div>
                                                        </Card>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="config" className="flex-1 flex flex-col m-0 outline-none overflow-hidden">
                            {currentNode ? (
                                <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
                                    <div className="space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                                    <Settings2 className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-white italic uppercase">{currentNode.label}</h2>
                                                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.4em]">ADDR::{currentNode.id}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedNodeId(null)} className="rounded-full text-zinc-500 hover:text-white">
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        <Separator className="bg-zinc-800/50" />

                                        {/* Trigger Config */}
                                        {currentNode.type === 'trigger' && (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Project Space</label>
                                                    <Select onValueChange={handleProjectSelect} value={currentNode.config.projectId}>
                                                        <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl">
                                                            <SelectValue placeholder="Locate source..." />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-950 border-zinc-800">
                                                            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {currentNode.config.projectId && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Database Sheet</label>
                                                        <Select onValueChange={handleSheetSelect} value={currentNode.config.sheetId}>
                                                            <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl">
                                                                <SelectValue placeholder="Target sheet..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-950 border-zinc-800">
                                                                {sheets.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                                {currentNode.config.sheetId && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Monitor Column</label>
                                                        <Select onValueChange={handleColumnSelect} value={currentNode.config.column}>
                                                            <SelectTrigger className="h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl">
                                                                <SelectValue placeholder="Observe field..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-zinc-950 border-zinc-800">
                                                                {columns.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Comm/Social Config */}
                                        {(currentNode.type === 'action' || currentNode.type === 'social') && (
                                            <div className="space-y-6">
                                                <div className="p-8 rounded-[2rem] bg-zinc-900/50 border border-zinc-800/50 text-center">
                                                    {(() => {
                                                        const IconComp = ICON_MAP[currentNode.iconName] || Zap
                                                        return <IconComp className="w-10 h-10 mx-auto mb-4 text-primary" />
                                                    })()}
                                                    <Button className="w-full h-14 bg-white text-black font-black rounded-2xl">AUTHORIZE APP</Button>
                                                </div>
                                                <textarea
                                                    className="w-full h-40 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 text-xs font-bold text-zinc-400 outline-none"
                                                    placeholder="Payload data structure..."
                                                />
                                            </div>
                                        )}

                                        <div className="pt-10 space-y-4">
                                            <Button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-2xl">FORCE SYNC STATE</Button>
                                            <Button variant="ghost" onClick={() => deleteNode(currentNode.id)} className="w-full text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500/5 h-12">PURGE NEURAL NODE</Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                                    <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8 relative">
                                        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
                                        <Hash className="w-10 h-10 text-zinc-700" />
                                    </div>
                                    <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Null Selector</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 tracking-widest">Connect Nodes to Active Core</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <style jsx global>{`
                @keyframes dash {
                    to { stroke-dashoffset: -24; }
                }
                .animate-dash {
                    animation: dash 1s linear infinite;
                }
                
                /* High-tech Custom Scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #27272a;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3f3f46;
                }
                
                /* Override components/ui/scroll-area default if needed or just use these classes */
                .scroll-viewport {
                    scrollbar-width: thin;
                    scrollbar-color: #27272a transparent;
                }
            `}</style>
        </div>
    )
}
