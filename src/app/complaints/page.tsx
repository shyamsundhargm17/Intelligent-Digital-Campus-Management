import { Plus, Search, MessageSquareWarning, Clock, CheckCircle } from 'lucide-react';

export default function ComplaintsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Requests & Complaints</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track and manage your campus service requests</p>
        </div>
        <button className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2">
          <Plus className="h-5 w-5" /> New Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((filter, i) => (
              <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                i === 0 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' 
                  : 'bg-white dark:bg-surface-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-surface-800 hover:bg-slate-50 dark:hover:bg-surface-800'
              }`}>
                {filter}
              </button>
            ))}
          </div>

          {/* Complaint Cards */}
          {[
            { id: 'REQ-8472', title: 'WiFi Connectivity Issue in Library', dept: 'IT Services', status: 'In Progress', date: '2 days ago', priority: 'High', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
            { id: 'REQ-8465', title: 'Hostel Room Maintenance - AC Filter', dept: 'Facilities', status: 'Resolved', date: '1 week ago', priority: 'Medium', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
            { id: 'REQ-8450', title: 'Incorrect Fee Structure Displayed', dept: 'Accounts', status: 'Resolved', date: '2 weeks ago', priority: 'High', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          ].map((req, i) => (
            <div key={i} className="glass-card p-5 group cursor-pointer hover:border-brand-300 dark:hover:border-brand-700/50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{req.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-surface-700"></span>
                  <span className="text-xs text-slate-500">{req.date}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${req.bg} ${req.color}`}>
                  <req.icon className="h-3.5 w-3.5" />
                  {req.status}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {req.title}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-600 dark:text-slate-400">Dept: <span className="font-medium text-slate-900 dark:text-slate-200">{req.dept}</span></span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-surface-700"></span>
                <span className="text-slate-600 dark:text-slate-400">Priority: <span className={`font-medium ${req.priority === 'High' ? 'text-red-500' : 'text-slate-900 dark:text-slate-200'}`}>{req.priority}</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-900/20 dark:to-surface-900">
            <h3 className="font-bold text-brand-900 dark:text-brand-100 mb-2">Need immediate help?</h3>
            <p className="text-sm text-brand-700/80 dark:text-brand-200/70 mb-4">
              For emergency medical or security issues, please use the campus emergency lines.
            </p>
            <button className="w-full bg-white dark:bg-brand-600 text-brand-700 dark:text-white py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow">
              View Emergency Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
