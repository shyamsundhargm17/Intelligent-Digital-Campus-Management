"use client";

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Loader2, User, Mail, Hash, Shield, Calendar, LogOut, Briefcase } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] flex-col gap-4">
        <p className="text-slate-500">Could not load profile data.</p>
        <button onClick={handleLogout} className="text-brand-500 hover:underline">Return to Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-surface-900 shadow-xl border border-slate-200/50 dark:border-white/10">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-brand-600 to-indigo-600"></div>
        
        <div className="relative px-8 pb-8 pt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="h-32 w-32 rounded-full border-4 border-white dark:border-surface-900 bg-slate-100 dark:bg-surface-800 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt={userData.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{userData.name}</h1>
            <p className="text-brand-600 dark:text-brand-400 font-medium capitalize mt-1 flex items-center justify-center md:justify-start gap-2">
              <Shield className="w-4 h-4" /> {userData.role} Profile
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl font-medium transition-colors mb-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-surface-800 pb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <User className="w-5 h-5 text-slate-400" />
                <span className="font-medium capitalize">{userData.name}</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{userData.email}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Member Since</label>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="font-medium">
                  {userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-surface-800 pb-4">Academic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                {userData.role === 'student' ? 'Register Number' : 'Employee ID'}
              </label>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <Hash className="w-5 h-5 text-slate-400" />
                <span className="font-medium tracking-wide uppercase">{userData.enrollmentNo || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Department</label>
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <span className="font-medium capitalize">{userData.department || 'General'}</span>
              </div>
            </div>
            
            {userData.role === 'student' && (
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Current Status</label>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Student
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
