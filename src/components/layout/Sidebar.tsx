"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  GraduationCap, 
  CalendarDays, 
  MessageSquareWarning, 
  Award, 
  BellRing, 
  CreditCard 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { name: 'Academics', href: '/academics', icon: GraduationCap },
  { name: 'Events', href: '/events', icon: CalendarDays },
  { name: 'Complaints', href: '/complaints', icon: MessageSquareWarning },
  { name: 'Certificates', href: '/certificates', icon: Award },
  { name: 'Notices', href: '/notices', icon: BellRing },
  { name: 'Fees', href: '/fees', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200/50 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-surface-900/80 hidden md:flex flex-col transition-all duration-300">
      <div className="flex h-16 items-center px-6 border-b border-slate-200/50 dark:border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/20">
            <span className="text-lg font-bold text-white">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">VEC Campus</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 px-2 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive 
                  ? 'text-brand-700 dark:text-brand-100 bg-brand-50/80 dark:bg-brand-900/40 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-surface-800/80'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-brand-500 rounded-r-full" />
              )}
              <item.icon className={cn(
                "h-5 w-5 transition-colors duration-200", 
                isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200/50 dark:border-white/10">
        <div className="glass-card p-4 rounded-xl flex items-center gap-3 bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-surface-800 shadow-sm">
            <img src="/images/profile.jpg" alt="Student Profile" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">Alex Johnson</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Computer Science, 3rd Yr</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
