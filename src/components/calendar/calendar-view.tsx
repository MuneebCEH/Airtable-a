"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import { CalendarEvent, updateEventDate } from "@/app/actions/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    LayoutGrid,
    LayoutList,
    Clock,
    User,
    ClipboardList,
    MapPin,
    Hash,
    Info,
    Calendar as CalIcon,
    Stethoscope,
    Phone,
    FileText,
    Layers,
    Truck,
    Box,
    Activity,
    Database
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const locales = {
    "en-US": enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar)

/**
 * Advanced Custom Toolbar for a more premium look
 */
const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV')
    }
    const goToNext = () => {
        toolbar.onNavigate('NEXT')
    }
    const goToToday = () => {
        toolbar.onNavigate('TODAY')
    }

    const setView = (view: View) => {
        toolbar.onView(view)
    }

    const label = () => {
        const date = toolbar.date
        return (
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900">{format(date, 'MMMM')}</span>
                <span className="text-xl font-light text-slate-400">{format(date, 'yyyy')}</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-2 rounded-2xl border shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border">
                <Button variant="ghost" size="icon" onClick={goToToday} className="h-9 w-20 px-4 hover:bg-white hover:shadow-sm font-semibold text-slate-700">
                    Today
                </Button>
                <div className="w-[1px] h-4 bg-slate-200" />
                <Button variant="ghost" size="icon" onClick={goToBack} className="h-9 w-9 hover:bg-white hover:shadow-sm rounded-lg text-slate-600">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={goToNext} className="h-9 w-9 hover:bg-white hover:shadow-sm rounded-lg text-slate-600">
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {label()}

            <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border">
                {[
                    { id: Views.MONTH, label: 'Month', icon: <LayoutGrid className="h-4 w-4" /> },
                    { id: Views.WEEK, label: 'Week', icon: <CalendarDays className="h-4 w-4" /> },
                    { id: Views.DAY, label: 'Day', icon: <Clock className="h-4 w-4" /> },
                    { id: Views.AGENDA, label: 'Agenda', icon: <LayoutList className="h-4 w-4" /> },
                ].map((v) => (
                    <Button
                        key={v.id}
                        variant={toolbar.view === v.id ? "secondary" : "ghost"}
                        onClick={() => setView(v.id as View)}
                        className={cn(
                            "h-9 px-4 gap-2 rounded-lg font-medium transition-all duration-200",
                            toolbar.view === v.id
                                ? "bg-white text-amber-600 shadow-sm border"
                                : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        {v.icon}
                        <span className="hidden lg:inline">{v.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}

interface CalendarViewProps {
    initialEvents: CalendarEvent[]
}

export function CalendarView({ initialEvents }: CalendarViewProps) {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
    const [view, setView] = useState<View>(Views.MONTH)
    const [date, setDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        setEvents(initialEvents)
    }, [initialEvents])

    const onEventDrop = useCallback(
        async ({ event, start, end, isAllDay }: any) => {
            const draggedEvent = event as CalendarEvent
            const updatedEvents = events.map((existingEvent) => {
                if (existingEvent.id === draggedEvent.id) {
                    return { ...existingEvent, start, end, allDay: isAllDay }
                }
                return existingEvent
            })
            setEvents(updatedEvents)

            try {
                const result = await updateEventDate(
                    draggedEvent.id,
                    draggedEvent.sheetId,
                    draggedEvent.dateColumnId,
                    start
                )
                if (!result.success) {
                    setEvents(events)
                    alert("Failed to move event")
                }
            } catch (error) {
                console.error("Failed to update event", error)
                setEvents(events)
            }
        },
        [events]
    )

    const onSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event)
        setIsDialogOpen(true)
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            <DnDCalendar
                localizer={localizer}
                events={events}
                startAccessor={(e: CalendarEvent) => e.start}
                endAccessor={(e: CalendarEvent) => e.end}
                style={{ height: "100%" }}
                onEventDrop={onEventDrop}
                onSelectEvent={onSelectEvent}
                draggableAccessor={() => true}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(newView) => setView(newView)}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                popup
                resizable
                className="text-slate-900"
                components={{
                    toolbar: CustomToolbar,
                    event: ({ event }: { event: CalendarEvent }) => (
                        <div className="flex flex-col h-full w-full justify-center">
                            <span className="truncate leading-tight uppercase font-black text-[10px]">{event.title}</span>
                        </div>
                    )
                }}
                eventPropGetter={(event: CalendarEvent) => ({
                    className: "!bg-amber-100/80 !border-amber-300 !text-amber-950 !rounded-lg !px-2 !py-0.5 !shadow-sm !border !m-0.5 !overflow-hidden transition-all hover:!bg-amber-200 cursor-pointer"
                })}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="fixed left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 !w-[96vw] !max-w-[1800px] max-h-[92vh] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] bg-white focus:outline-none text-black">
                    <DialogHeader className="p-10 bg-white border-b border-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50 rounded-full -mr-32 -mt-32 opacity-20 blur-[100px]" />
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="p-6 bg-slate-900 rounded-[1.75rem] shadow-2xl shadow-slate-200">
                                <User className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex flex-col text-black min-w-0 flex-1">
                                <div className="flex items-center gap-4 mb-2 flex-wrap">
                                    <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] rounded-full">
                                        Clinical Intelligence Profile
                                    </Badge>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                    <p className="text-[11px] font-[900] text-slate-300 uppercase tracking-[0.3em] leading-none">Management v3.5</p>
                                </div>
                                <DialogTitle className="text-5xl font-[1000] text-slate-900 tracking-tighter leading-none mb-3 truncate">
                                    {selectedEvent?.title.replace('Refill: ', '')}
                                </DialogTitle>
                                <DialogDescription className="text-slate-400 font-bold text-[14px] uppercase tracking-[0.2em] flex items-center gap-5 flex-wrap">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4.5 w-4.5 text-amber-500" />
                                        Next Refill Cycle: <span className="text-slate-900 font-black ml-2">{selectedEvent?.start ? format(selectedEvent.start, 'PPPP') : 'N/A'}</span>
                                    </div>
                                    <span className="hidden lg:block text-slate-200">|</span>
                                    <p className="text-slate-400">Compliance Protocol Active</p>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <ScrollArea className="max-h-[calc(92vh-220px)] overflow-y-auto bg-slate-50/20">
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">

                            {/* Column 1: Identity & Logistics */}
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4 text-black">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                                                <User className="h-3.5 w-3.5" />
                                            </div>
                                            Identity Matrix
                                        </h3>
                                        <div className="h-px flex-1 ml-6 bg-slate-200/60" />
                                    </div>
                                    <div className="grid gap-4.5 text-black">
                                        {selectedEvent?.columns?.filter(col => {
                                            const name = col.name.toLowerCase();
                                            return name.includes('id') || name.includes('name') || name.includes('dob') || name.includes('ssn') || name.includes('gender');
                                        }).map(col => (
                                            <DataField key={col.id} label={col.name} value={selectedEvent.fullData?.[col.id]} icon={<Hash className="h-4 w-4" />} />
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4 text-black">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                                                <MapPin className="h-3.5 w-3.5" />
                                            </div>
                                            Logistics Hub
                                        </h3>
                                        <div className="h-px flex-1 ml-6 bg-slate-200/60" />
                                    </div>
                                    <div className="grid gap-4.5 text-black">
                                        {selectedEvent?.columns?.filter(col => {
                                            const name = col.name.toLowerCase();
                                            return name.includes('address') || name.includes('city') || name.includes('state') || name.includes('zip') || name.includes('phone') || name.includes('email');
                                        }).map(col => (
                                            <DataField key={col.id} label={col.name} value={selectedEvent.fullData?.[col.id]} icon={<MapPin className="h-4 w-4" />} />
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Column 2: Clinical & Distribution */}
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center justify-between mb-8 text-black">
                                        <h3 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                                                <Stethoscope className="h-3.5 w-3.5" />
                                            </div>
                                            Clinical Portfolio
                                        </h3>
                                        <div className="h-px flex-1 ml-6 bg-slate-200/60" />
                                    </div>
                                    <div className="grid gap-4 text-black">
                                        {selectedEvent?.columns?.filter(col => {
                                            const name = col.name.toLowerCase();
                                            return name.includes('dr') || name.includes('npi') || name.includes('rx') || name.includes('device') || name.includes('item') || name.includes('due');
                                        }).map(col => (
                                            <DataField key={col.id} label={col.name} value={selectedEvent.fullData?.[col.id]} icon={<Layers className="h-4 w-4" />} />
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-8 text-black">
                                        <h3 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                                                <Truck className="h-3.5 w-3.5" />
                                            </div>
                                            Distribution Intel
                                        </h3>
                                        <div className="h-px flex-1 ml-6 bg-slate-200/60" />
                                    </div>
                                    <div className="grid gap-4 text-black">
                                        {selectedEvent?.columns?.filter(col => {
                                            const name = col.name.toLowerCase();
                                            return name.includes('track') || name.includes('ship') || name.includes('deliver') || name.includes('fedex') || name.includes('ups');
                                        }).map(col => (
                                            <DataField key={col.id} label={col.name} value={selectedEvent.fullData?.[col.id]} icon={<Box className="h-4 w-4" />} />
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Column 3: Status Radar & Metrics */}
                            <div className="space-y-10">
                                <section className="p-8 rounded-[2.5rem] bg-slate-900 shadow-2xl shadow-slate-200 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-125" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3 mb-8">
                                        <Activity className="h-3.5 w-3.5" /> Operational Status
                                    </h4>
                                    <div className="space-y-6">
                                        {selectedEvent?.columns?.filter(c => c.name.toLowerCase().includes('status')).map(col => (
                                            <div key={col.id} className="flex flex-col gap-2 py-3 border-b border-white/5 last:border-0 group-hover:pl-2 transition-all">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-amber-400 transition-colors uppercase">{col.name}</span>
                                                <span className="text-[16px] font-black text-white tracking-tight leading-none italic">{String(selectedEvent.fullData?.[col.id] || 'PENDING')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-8 text-black">
                                        <h3 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                                                <Database className="h-3.5 w-3.5" />
                                            </div>
                                            Supplementary
                                        </h3>
                                        <div className="h-px flex-1 ml-6 bg-slate-200/60" />
                                    </div>
                                    <div className="grid gap-3 text-black">
                                        {selectedEvent?.columns?.filter(col => {
                                            const name = col.name.toLowerCase();
                                            const isHandled = name.includes('id') || name.includes('name') || name.includes('dob') || name.includes('ssn') || name.includes('gender') ||
                                                name.includes('address') || name.includes('city') || name.includes('state') || name.includes('zip') || name.includes('phone') || name.includes('email') ||
                                                name.includes('dr') || name.includes('npi') || name.includes('rx') || name.includes('device') || name.includes('item') || name.includes('due') ||
                                                name.includes('track') || name.includes('ship') || name.includes('deliver') || name.includes('fedex') || name.includes('ups') ||
                                                name.includes('status') || name.includes('note');
                                            return !isHandled;
                                        }).map(col => (
                                            <div key={col.id} className="flex justify-between items-center py-2 border-b border-slate-50 px-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{col.name}</span>
                                                <span className="text-[11px] font-black text-slate-900">{String(selectedEvent.fullData?.[col.id] || 'N/A')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Column 4: Context & Notes */}
                            <div className="space-y-10">
                                <section>
                                    <div className="flex items-center justify-between mb-8 text-black">
                                        <h3 className="text-[11px] font-[1000] uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                                                <FileText className="h-3.5 w-3.5" />
                                            </div>
                                            Medical Context
                                        </h3>
                                        <div className="h-px flex-1 ml-6 bg-slate-200/60" />
                                    </div>
                                    <div className="space-y-8">
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group min-h-[350px] transition-all hover:shadow-xl hover:shadow-slate-100">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-amber-400" />
                                            <p className="text-[15px] text-slate-700 leading-relaxed font-[600] italic">
                                                {selectedEvent?.fullData?.[selectedEvent?.columns?.find(c => c.name.toLowerCase().includes('note'))?.id || ''] || 'No clinic assessment recordings found for this period.'}
                                            </p>
                                        </div>

                                        <div className="p-7 bg-amber-50/80 rounded-[2rem] border border-amber-100/40 relative overflow-hidden text-black backdrop-blur-sm">
                                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                                <Info className="h-12 w-12 text-amber-900" />
                                            </div>
                                            <p className="text-[10px] uppercase font-[1000] tracking-[0.3em] text-amber-600 mb-3 flex items-center gap-2 text-black">
                                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Compliance Link
                                            </p>
                                            <p className="text-[13px] font-[800] text-amber-950 leading-relaxed italic text-black font-black">
                                                Automated telemetry active. Subject to strict Delta Global Health patient safety protocols.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-10 bg-white border-t border-slate-50 flex justify-end gap-10 items-center">
                        <div className="mr-auto flex flex-col gap-1.5 text-black">
                            <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">DELTA GLOBAL HEALTH INFRASTRUCTURE</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">SECURE PORTAL ACCESS • v3.5.2</p>
                        </div>
                        <Button
                            className="rounded-[2.5rem] font-[1000] uppercase tracking-[0.3em] text-[12px] h-16 px-20 bg-slate-900 text-white hover:bg-black transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-slate-200 border-none"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Close Patient Profile
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

/**
 * Clean data field sub-component for premium UI consistent with the medical theme.
 */
function DataField({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-white border border-slate-100 group transition-all duration-300 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-100 text-black">
            <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-500 group-hover:bg-amber-50 group-hover:border-amber-100 transition-all duration-300">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-slate-300 leading-none mb-2 group-hover:text-amber-500 transition-colors uppercase">{label}</p>
                <p className="text-[14px] font-black text-slate-900 truncate tracking-tight">{String(value)}</p>
            </div>
        </div>
    )
}
