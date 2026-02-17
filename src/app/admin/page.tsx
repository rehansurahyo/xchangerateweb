export default function AdminPlaceholder() {
    return (
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Admin Restricted</h2>
                <p className="text-[#9FB0C7]/40 max-w-[400px] text-sm">
                    This area is reserved for system administrators. Please contact engineering for access permissions.
                </p>
            </div>
            <button className="px-8 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs font-black text-[#9FB0C7] uppercase tracking-widest hover:text-white transition-all">
                Back to Safety
            </button>
        </div>
    );
}
