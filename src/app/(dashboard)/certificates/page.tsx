"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Award, Plus, Link as LinkIcon, Calendar, Building, X, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [dateEarned, setDateEarned] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCertificates = async (uid: string) => {
    try {
      const q = query(collection(db, 'certificates'), where('studentId', '==', uid));
      const snap = await getDocs(q);
      const certs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort in UI since we don't have a composite index for where + orderBy created yet
      certs.sort((a: any, b: any) => new Date(b.dateEarned).getTime() - new Date(a.dateEarned).getTime());
      setCertificates(certs);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        fetchCertificates(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userUid) return;
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, 'certificates'), {
        studentId: userUid,
        title,
        issuer,
        dateEarned,
        url: certUrl,
        createdAt: serverTimestamp()
      });
      
      setIsModalOpen(false);
      setTitle('');
      setIssuer('');
      setDateEarned('');
      setCertUrl('');
      fetchCertificates(userUid);
    } catch (err) {
      console.error("Error uploading certificate:", err);
      alert("Failed to upload certificate. Ensure your Firestore rules are updated.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await deleteDoc(doc(db, 'certificates', id));
      setCertificates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-500" /> My Certificates
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and showcase your achievements and verified certificates.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/30 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Upload Certificate
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="p-10 glass-card rounded-3xl text-center max-w-md w-full border border-dashed border-slate-300 dark:border-surface-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-brand-500">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Certificates Uploaded</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Upload your course certificates, workshop participations, and internship letters here.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-brand-600 dark:text-brand-400 font-semibold text-sm hover:underline">Click here to add your first one</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-slate-200/50 dark:border-white/10 flex flex-col">
              <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-surface-800 dark:to-surface-900 relative flex items-center justify-center">
                <Award className="w-12 h-12 text-slate-300 dark:text-surface-700" />
                <button 
                  onClick={() => handleDelete(cert.id)}
                  className="absolute top-3 right-3 p-2 bg-white/50 hover:bg-red-50 text-red-500 dark:bg-surface-900/50 dark:hover:bg-red-500/20 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg line-clamp-2 leading-tight">{cert.title}</h3>
                <div className="mt-4 space-y-2 flex-1">
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" /> {cert.issuer}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" /> {new Date(cert.dateEarned).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-surface-800">
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-600 dark:text-brand-400 flex items-center gap-2 hover:underline">
                    <LinkIcon className="w-4 h-4" /> View Document
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-surface-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-surface-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Certificate</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Certificate Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Issuing Organization</label>
                <input type="text" required value={issuer} onChange={e => setIssuer(e.target.value)} placeholder="e.g. Amazon Web Services" className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date Earned</label>
                <input type="date" required value={dateEarned} onChange={e => setDateEarned(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Certificate URL (Drive Link)</label>
                <input type="url" required value={certUrl} onChange={e => setCertUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-950/50 dark:text-white" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-surface-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-surface-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
