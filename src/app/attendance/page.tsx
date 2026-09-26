import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function AttendancePage() {
  const subjects = [
    { name: 'Data Structures', total: 40, attended: 36, percentage: 90, status: 'safe' },
    { name: 'Database Management', total: 35, attended: 25, percentage: 71, status: 'warning' },
    { name: 'Software Engineering', total: 30, attended: 29, percentage: 96, status: 'safe' },
    { name: 'Computer Networks', total: 38, attended: 28, percentage: 73, status: 'warning' },
    { name: 'Operating Systems', total: 42, attended: 38, percentage: 90, status: 'safe' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor your academic presence and warnings</p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-surface-900 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-surface-800">
          <div className="text-center">
            <span className="block text-2xl font-bold text-brand-600 dark:text-brand-400">87%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall</span>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-surface-800"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-slate-900 dark:text-white">185</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Classes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {subjects.map((subject, i) => (
          <div key={i} className="glass-card p-5 group flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{subject.name}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {subject.attended} Attended</span>
                <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-500" /> {subject.total - subject.attended} Missed</span>
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-brand-500" /> {subject.total} Total</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className="flex-1 bg-slate-100 dark:bg-surface-950 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    subject.status === 'safe' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                  }`}
                  style={{ width: `${subject.percentage}%` }}
                />
              </div>
              <span className={`font-bold min-w-[3rem] text-right ${
                subject.status === 'safe' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {subject.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
