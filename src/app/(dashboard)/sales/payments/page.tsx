export default function PaymentsPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Payments</h1>
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
                <p className="text-lg font-medium italic underline underline-offset-4 decoration-amber-500">Payment Processing & Reconciliation</p>
                <p className="mt-2 text-sm">Verifying transaction history...</p>
            </div>
        </div>
    )
}
