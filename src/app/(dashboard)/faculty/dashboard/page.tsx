export default function FacultyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-500">
      <div className="p-10 glass-card rounded-3xl text-center max-w-md w-full border border-dashed border-slate-300 dark:border-surface-700">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Faculty Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Welcome to the faculty portal. Your teaching modules will appear here.</p>
      </div>
    </div>
  );
}
