import { Bell, Search, Menu } from 'lucide-react';

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/70 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-surface-900/70 md:px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-800 transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden md:flex items-center group">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-brand-500" />
          <input
            type="text"
            placeholder="Search campus services..."
            className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:focus:border-brand-500 dark:focus:bg-surface-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white dark:ring-surface-900"></span>
        </button>
        <div className="flex md:hidden items-center gap-2">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-surface-800">
            <img src="/images/profile.jpg" alt="Profile" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
