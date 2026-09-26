export default function FeesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
      <div className="p-10 glass-card rounded-3xl text-center max-w-md w-full border border-dashed border-slate-300 dark:border-surface-700">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-surface-800 flex items-center justify-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize mb-2">Fees</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">No fee records found.</p>
        <div className="mt-6 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-100 dark:bg-surface-800 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          Status: N/A
        </div>
      </div>
    </div>
  );
}
