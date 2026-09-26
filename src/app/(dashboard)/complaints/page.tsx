"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MessageSquareWarning, Plus, X, Loader2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaints = async (uid: string) => {
    try {
      const q = query(collection(db, 'complaints'), where('studentId', '==', uid));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort in memory to avoid needing composite index immediately
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setComplaints(data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        fetchComplaints(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) return;
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'complaints'), {
        studentId: userUid,
        title,
        description,
        category,
        status: 'Pending',
        createdAt: serverTimestamp()
      });
      
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setCategory('Infrastructure');
      fetchComplaints(userUid);
    } catch (err: any) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit. " + (err.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>;
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-semibold"><AlertCircle className="w-3.5 h-3.5" /> In Progress</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-surface-800 dark:text-slate-300 text-xs font-semibold"><Clock className="w-3.5 h-3.5" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-brand-500" /> My Complaints
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Lodge complaints or request campus services and track their resolution status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="p-10 glass-card rounded-3xl text-center max-w-md w-full border border-dashed border-slate-300 dark:border-surface-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
              <MessageSquareWarning className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Complaints Filed</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">You have no active or past complaints. If you face any issues on campus, you can report them here.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline">File an issue</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complaints.map(comp => (
            <div key={comp.id} className="glass-card rounded-2xl p-6 border border-slate-200/50 dark:border-white/10 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{comp.title}</h3>
                <div className="shrink-0">{getStatusBadge(comp.status)}</div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-1 whitespace-pre-wrap">{comp.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-surface-800 text-xs font-medium text-slate-400">
                <span className="uppercase tracking-wider px-2 py-1 rounded bg-slate-50 dark:bg-surface-800">{comp.category}</span>
                <span>{comp.createdAt ? new Date(comp.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-surface-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-surface-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lodge a Complaint</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white appearance-none cursor-pointer">
                  <option value="Infrastructure">Infrastructure & Facilities</option>
                  <option value="Academic">Academic Affairs</option>
                  <option value="Hostel">Hostel & Mess</option>
                  <option value="IT Services">IT & Networking</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Issue Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief summary of the issue" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Detailed Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Please explain the issue in detail..." rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white resize-none" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-surface-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-surface-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
