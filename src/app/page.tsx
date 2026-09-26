import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-900 shadow-2xl">
        <div className="absolute inset-0">
          <img 
            src="/images/banner.jpg" 
            alt="Campus Banner" 
            className="h-full w-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 to-transparent"></div>
        </div>
        <div className="relative p-8 md:p-12 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome back, Alex!
          </h1>
          <p className="text-brand-100 text-lg mb-8 max-w-lg">
            You have 2 upcoming classes and 1 new notice from the Computer Science department.
          </p>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 group">
            View Schedule
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Attendance', value: '87%', icon: Calendar, trend: '+2% from last month', color: 'from-emerald-500 to-teal-400' },
          { label: 'Current CGPA', value: '3.8', icon: TrendingUp, trend: 'Top 10% in batch', color: 'from-brand-500 to-indigo-400' },
          { label: 'Active Complaints', value: '1', icon: AlertCircle, trend: 'In Progress', color: 'from-amber-500 to-orange-400' },
          { label: 'Pending Fees', value: '$0.00', icon: FileText, trend: 'All clear', color: 'from-accent-500 to-pink-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 group hover:shadow-2xl hover:shadow-brand-500/10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-surface-800 px-2 py-1 rounded-full">
                {stat.label}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:scale-105 transition-transform origin-left">
              {stat.value}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 glass-card p-6 border-t-4 border-t-brand-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Schedule</h2>
            <Link href="/academics" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">
              Full Timetable
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', subject: 'Data Structures & Algorithms', room: 'Room 302', type: 'Lecture', active: true },
              { time: '11:30 AM', subject: 'Database Management Systems', room: 'Lab 4', type: 'Practical', active: false },
              { time: '02:00 PM', subject: 'Software Engineering', room: 'Room 105', type: 'Lecture', active: false },
            ].map((cls, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${cls.active ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-500/30 relative overflow-hidden' : 'bg-slate-50 dark:bg-surface-950/50 border border-slate-100 dark:border-surface-800'}`}>
                {cls.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />}
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                  <span className={`text-sm font-bold ${cls.active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-900 dark:text-white'}`}>{cls.time}</span>
                </div>
                <div className="h-10 w-px bg-slate-200 dark:bg-surface-800"></div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">{cls.subject}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {cls.type}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {cls.room}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Announcements */}
        <div className="glass-card p-6 border-t-4 border-t-accent-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Notices</h2>
            <Link href="/notices" className="text-sm font-medium text-accent-600 dark:text-accent-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-5">
            {[
              { title: 'End Semester Exam Schedule Published', date: 'Today, 10:00 AM', tag: 'Important' },
              { title: 'TechFest 2026 Registration Open', date: 'Yesterday', tag: 'Event' },
              { title: 'Library Fine Clearance Deadline', date: '2 days ago', tag: 'Admin' },
            ].map((notice, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    notice.tag === 'Important' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                    notice.tag === 'Event' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' :
                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {notice.tag}
                  </span>
                  <span className="text-xs text-slate-400">{notice.date}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                  {notice.title}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
