"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { createRow } from "@/app/actions/rows"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface NewRecordModalProps {
    isOpen: boolean
    onClose: () => void
    columns: any[]
    sheetId: string
}

export function NewRecordModal({ isOpen, onClose, columns, sheetId }: NewRecordModalProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Dynamically build schema based on columns
    const schemaObject: any = {}
    columns.forEach(col => {
        if (col.type === "CHECKBOX") {
            schemaObject[col.id] = z.boolean().default(false)
        } else if (col.type === "NUMBER" || col.type === "CURRENCY") {
            schemaObject[col.id] = z.string().optional().transform(v => v ? Number(v) : undefined)
        } else {
            schemaObject[col.id] = z.string().optional()
        }
    })

    const formSchema = z.object(schemaObject)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: columns.reduce((acc, col) => {
            acc[col.id] = col.type === "CHECKBOX" ? false : ""
            return acc
        }, {} as any)
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            const res = await createRow(sheetId, values)
            if (res.success) {
                toast.success("Record added successfully")
                form.reset()
                onClose()
                router.refresh()
            } else {
                toast.error("Failed to add record")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 pb-2 border-b">
                    <DialogTitle className="text-2xl font-bold text-gray-800">Add New Record</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new patient record below.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    {columns.filter(col => !["CREATED_BY", "UPDATED_BY", "AUTO_NUMBER"].includes(col.type)).map((col) => (
                                        <FormField
                                            key={col.id}
                                            control={form.control}
                                            name={col.id}
                                            render={({ field }) => (
                                                <FormItem className={col.type === "LONG_TEXT" ? "md:col-span-2" : ""}>
                                                    <FormLabel className="text-sm font-semibold text-gray-700 capitalize">
                                                        {col.name}
                                                    </FormLabel>
                                                    <FormControl>
                                                        {renderField(col, field)}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-gray-50 mt-auto">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Record
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function renderField(col: any, field: any) {
    switch (col.type) {
        case "SELECT":
            const options = Array.isArray(col.options) ? col.options : (col.options as any)?.options || []
            return (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full bg-white border-gray-200">
                        <SelectValue placeholder={`Select ${col.name}`} />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                        {options.map((opt: any) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        case "CHECKBOX":
            return (
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id={col.id}
                    />
                    <label
                        htmlFor={col.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {col.name}
                    </label>
                </div>
            )
        case "DATE":
            return <Input type="date" {...field} className="bg-white border-gray-200" />
        case "NUMBER":
        case "CURRENCY":
            return <Input type="number" {...field} className="bg-white border-gray-200" />
        case "LONG_TEXT":
            return <Textarea {...field} className="bg-white border-gray-200 min-h-[100px]" />
        case "FILE":
            return <div className="text-xs text-muted-foreground italic">File uploads are managed in the grid view.</div>
        default:
            return <Input {...field} className="bg-white border-gray-200" />
    }
}
