"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
    Shield,
    Key,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    User,
    Mail,
    Bell,
    Lock,
    History,
    Fingerprint,
    Loader2,
    Camera,
    ShieldCheck,
    Cpu,
    Globe,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { changePassword } from "@/app/actions/users"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null)

    const isAdminOrManager = session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER' || session?.user?.role === 'OWNER'

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }
        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            return
        }

        setIsLoading(true)
        setMessage(null)

        try {
            const res = await changePassword(session!.user.id as string, password)
            if (res.success) {
                setMessage({ type: 'success', text: 'Security credentials updated successfully' })
                setPassword("")
                setConfirmPassword("")
            } else {
                setMessage({ type: 'error', text: res.error || 'Failed to update credentials' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected security error occurred' })
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center space-y-8 animate-pulse">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                    <Loader2 className="h-16 w-16 text-blue-500 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Synchronizing Security Nodes</p>
                    <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Establishing encrypted bridge to Delta Medical Core...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex flex-col h-[80vh] items-center justify-center p-4">
                <div className="bg-white p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col items-center text-center max-w-md animate-in zoom-in duration-500">
                    <div className="p-6 bg-red-50 rounded-[2rem] mb-8">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Unauthorized Entry</h2>
                    <p className="text-slate-500 font-medium mb-8">Your security session appears to have expired or is invalid. Access to this node requires active authentication.</p>
                    <Button
                        onClick={() => router.push("/login")}
                        className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black shadow-xl"
                    >
                        Sign In to Authenticate
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50/20 min-h-screen animate-in fade-in duration-1000">
            {/* Cinematic Header */}
            <div className="relative overflow-hidden bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Cpu className="w-64 h-64 text-slate-900 rotate-12" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-8 bg-blue-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Administrative Hub</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-slate-900">Account <span className="text-blue-600">Control</span></h1>
                        <p className="text-slate-400 font-bold max-w-xl text-lg leading-relaxed">Identity management and security protocol enforcement for the Delta Medical Intelligence Platform.</p>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-6 py-3 rounded-2xl flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Node Online
                        </Badge>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">ID: {session.user.id.substring(0, 12).toUpperCase()}</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="security" className="space-y-10">
                <TabsList className="bg-white/80 backdrop-blur-xl border border-slate-100 p-2 rounded-[2rem] h-auto grid grid-cols-3 max-w-2xl mx-auto shadow-sm">
                    <TabsTrigger value="profile" className="rounded-[1.5rem] px-8 py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all duration-500">
                        <User className="h-3.5 w-3.5 mr-2" /> Identity
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-[1.5rem] px-8 py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-500">
                        <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-[1.5rem] px-8 py-4 font-black text-xs uppercase tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all duration-500">
                        <Zap className="h-3.5 w-3.5 mr-2" /> Alerts
                    </TabsTrigger>
                </TabsList>

                {/* Identity Tab Content */}
                <TabsContent value="profile" className="animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-[0_15px_50px_rgba(0,0,0,0.03)] rounded-[3rem] bg-white">
                                <CardContent className="p-12 space-y-10">
                                    <div className="flex flex-col md:flex-row items-center gap-10">
                                        <div className="relative">
                                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] opacity-20 blur-lg animate-pulse" />
                                            <Avatar className="h-40 w-40 rounded-[2.5rem] border-8 border-white shadow-2xl relative z-10">
                                                <AvatarImage src={session.user.image || ""} />
                                                <AvatarFallback className="bg-slate-50 text-slate-400 font-black text-4xl">
                                                    {session.user.name?.[0] || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Button size="icon" className="absolute bottom-0 right-0 h-12 w-12 rounded-2xl bg-slate-900 text-white shadow-xl hover:scale-110 transition-transform z-20">
                                                <Camera className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <div className="space-y-4 text-center md:text-left">
                                            <div>
                                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{session.user.name || "System Operative"}</h3>
                                                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-bold mt-1">
                                                    <Mail className="h-4 w-4" />
                                                    {session.user.email}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                <Badge className="bg-slate-900 text-white rounded-xl px-4 py-2 uppercase text-[10px] tracking-widest font-black">{session.user.role}</Badge>
                                                <Badge className="bg-blue-50 text-blue-600 border-none rounded-xl px-4 py-2 uppercase text-[10px] tracking-widest font-black">Verified Account</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                                        <ProfileField label="Operative Name" value={session.user.name || "N/A"} />
                                        <ProfileField label="Secure Email" value={session.user.email || "N/A"} />
                                        <ProfileField label="Authorized Department" value="Operations & Logistics" />
                                        <ProfileField label="Clearance Level" value={session.user.role} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-8">
                            <Card className="border-none shadow-xl rounded-[2.5rem] bg-indigo-600 text-white p-10 flex flex-col justify-between min-h-[400px]">
                                <Globe className="h-16 w-16 text-indigo-300 opacity-20" />
                                <div className="space-y-6">
                                    <h4 className="text-2xl font-black tracking-tight leading-tight">Your Session Information</h4>
                                    <div className="space-y-4">
                                        <SessionItem label="Last Login" value="Today, 04:30 AM" />
                                        <SessionItem label="IP Signature" value="192.168.1.45" />
                                        <SessionItem label="System Kernel" value="Win-NT 10.0" />
                                    </div>
                                </div>
                                <Button variant="secondary" className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest">View Full History</Button>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Security Tab Content */}
                <TabsContent value="security" className="animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                                <CardHeader className="p-12 pb-8 border-b border-slate-50">
                                    <div className="flex items-center gap-5">
                                        <div className="p-5 bg-blue-50 rounded-[2rem]">
                                            <Key className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Security Keys</CardTitle>
                                            <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-xs">Update your system access credentials</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-12">
                                    <form onSubmit={handlePasswordChange} className="space-y-10 max-w-xl">
                                        {message && (
                                            <div className={cn(
                                                "p-6 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-500 border-2",
                                                message.type === 'success' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                                            )}>
                                                {message.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                                                <p className="font-black text-sm tracking-tight">{message.text}</p>
                                            </div>
                                        )}

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">New Security Key</label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••••••"
                                                        className="h-16 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/50 px-8 focus-visible:ring-blue-600 focus-visible:bg-white font-black text-xl transition-all"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Confirm Security Key</label>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••••••"
                                                    className="h-16 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/50 px-8 focus-visible:ring-blue-600 focus-visible:bg-white font-black text-xl transition-all"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button className="w-full h-16 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-[0_20px_40px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98] py-8" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "EXECUTE UPDATE"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-8">
                            <div className="p-10 bg-slate-900 border border-slate-800 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />
                                <Fingerprint className="h-16 w-16 text-blue-500 mt-2" />
                                <div className="space-y-4 relative z-10">
                                    <h4 className="text-2xl font-black tracking-tight leading-tight">Biometric & MFA Status</h4>
                                    <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest opacity-60">Delta Medical Core Security Protocols are active on this node.</p>
                                    <div className="pt-4 space-y-3">
                                        <SecurityStat label="MFA Enforcement" status="Enabled" color="text-emerald-400" />
                                        <SecurityStat label="Encryption Core" status="AES-256" color="text-amber-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications Tab Content */}
                <TabsContent value="notifications" className="animate-in zoom-in duration-700">
                    <Card className="border-none shadow-2xl rounded-[3rem] bg-white max-w-5xl mx-auto overflow-hidden">
                        <CardHeader className="p-12 border-b border-slate-50">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-amber-50 rounded-[2rem]">
                                    <Bell className="h-8 w-8 text-amber-600" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Alert Node</CardTitle>
                                    <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-xs">Configure system intelligence transmissions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <NotificationSwitch id="sys-alerts" label="System Priority Alerts" desc="Critical engine updates and operational status" color="data-[state=checked]:bg-amber-500" />
                                <NotificationSwitch id="pat-intel" label="Patient Status Intel" desc="Real-time shipping and record modifications" color="data-[state=checked]:bg-blue-600" />
                                <NotificationSwitch id="auth-alerts" label="Auth Monitor" desc="Sign-in attempts and security edge alerts" color="data-[state=checked]:bg-indigo-600" />
                                <NotificationSwitch id="marketing" label="Global Bulletins" desc="General system news and product updates" color="data-[state=checked]:bg-slate-300" />
                            </div>
                            <Button className="h-16 px-12 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-transform">
                                Save Intel Preferences
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function ProfileField({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">{label}</span>
            <div className="h-14 flex items-center px-6 rounded-2xl bg-slate-50 text-slate-900 font-black tracking-tight border-none">
                {value}
            </div>
        </div>
    )
}

function SessionItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/10 group">
            <span className="text-xs font-bold opacity-50 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black tracking-tight group-hover:text-blue-300 transition-colors">{value}</span>
        </div>
    )
}

function SecurityStat({ label, status, color }: { label: string, status: string, color: string }) {
    return (
        <div className="flex items-center justify-between text-xs p-1">
            <span className="font-bold opacity-40 uppercase tracking-widest">{label}</span>
            <span className={cn("font-black uppercase tracking-tighter", color)}>{status}</span>
        </div>
    )
}

function NotificationSwitch({ id, label, desc, color }: { id: string, label: string, desc: string, color: string }) {
    return (
        <div className="flex items-center justify-between p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-slate-300 transition-colors">
            <div className="space-y-1.5 pr-8">
                <Label htmlFor={id} className="text-md font-black text-slate-900 tracking-tight uppercase">{label}</Label>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">{desc}</p>
            </div>
            <Switch id={id} defaultChecked className={cn("scale-125", color)} />
        </div>
    )
}
