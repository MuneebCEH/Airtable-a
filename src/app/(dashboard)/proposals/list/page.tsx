export default function ProposalsListPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Proposals</h1>
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-500 bg-slate-50/50">
                <p className="text-lg font-medium italic underline underline-offset-4 decoration-amber-500">Active Proposals & Submissions</p>
                <p className="mt-2 text-sm">Loading documentation archive...</p>
            </div>
        </div>
    )
}
