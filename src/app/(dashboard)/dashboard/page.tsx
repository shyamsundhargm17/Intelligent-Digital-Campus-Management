"use client";

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  FileText, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Notice } from '@/lib/types';

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user profile
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }

          // Fetch real notices from database
          const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(4));
          const noticeSnap = await getDocs(noticesQuery);
          const fetchedNotices: any[] = [];
          noticeSnap.forEach((doc) => {
            fetchedNotices.push({ id: doc.id, ...doc.data() });
          });
          setNotices(fetchedNotices);

        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

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
            Welcome back, {userData?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-brand-100 text-lg mb-8 max-w-lg">
            {userData?.department ? `Department of ${userData.department}` : 'Welcome to your unified digital campus portal.'}
          </p>
          <Link href="/profile" className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center gap-2 group">
            View My Profile
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Quick Stats (Zeroed out since it's a real DB connection now) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Attendance', value: 'N/A', icon: Calendar, trend: 'No classes yet', color: 'from-emerald-500 to-teal-400' },
          { label: 'Current CGPA', value: 'N/A', icon: TrendingUp, trend: 'No exams recorded', color: 'from-brand-500 to-indigo-400' },
          { label: 'Active Complaints', value: '0', icon: AlertCircle, trend: 'All clear', color: 'from-amber-500 to-orange-400' },
          { label: 'Pending Fees', value: '₹0.00', icon: FileText, trend: 'No dues pending', color: 'from-accent-500 to-pink-400' },
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
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-surface-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-surface-800">
            <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">No classes scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">Your faculty has not scheduled any classes for today.</p>
          </div>
        </div>

        {/* Real Notices & Announcements from DB */}
        <div className="glass-card p-6 border-t-4 border-t-accent-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Campus Notices</h2>
            <Link href="/notices" className="text-sm font-medium text-accent-600 dark:text-accent-400 hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-5">
            {notices.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-500">
                No new notices posted yet.
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      notice.tag === 'Important' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                      notice.tag === 'Event' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {notice.tag || 'General'}
                    </span>
                    {notice.createdAt && (
                      <span className="text-xs text-slate-400">
                        {new Date(notice.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                    {notice.title}
                  </h4>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
