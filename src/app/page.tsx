"use client";

import { useState, useEffect } from 'react';
import { Mail, Lock, User, Hash, ArrowRight, Loader2, GraduationCap, Users, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

type Role = 'student' | 'faculty' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('student');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [registerNo, setRegisterNo] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');

  // Switch to login automatically if role is not student
  useEffect(() => {
    if (role !== 'student') {
      setIsLogin(true);
    }
    setError(null);
    setSuccess(null);
  }, [role]);

  // Validation
  const isRegisterValid = fullName.trim() !== '' && email.trim() !== '' && registerNo.trim() !== '' && password.length >= 10;
  const isLoginValid = loginIdentifier.trim() !== '' && password.length >= 10;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Handle Login
        let authEmail = loginIdentifier.trim().toLowerCase();
        let isRegNumber = false;
        
        // If it doesn't look like an email, assume it's a register number/employee ID
        if (!authEmail.includes('@')) {
          isRegNumber = true;
          authEmail = `${authEmail}@vec.edu.in`;
        }

        let userCredential;
        try {
          userCredential = await signInWithEmailAndPassword(auth, authEmail, password);
        } catch (initialErr: any) {
          // If they registered before we changed the domain, try the old student domain!
          if (isRegNumber && (initialErr.code === 'auth/user-not-found' || initialErr.code === 'auth/invalid-credential')) {
            const oldAuthEmail = `${loginIdentifier.trim().toLowerCase()}@student.vec.edu`;
            userCredential = await signInWithEmailAndPassword(auth, oldAuthEmail, password);
          } else {
            throw initialErr;
          }
        }
        
        // Verify Role from Database
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          const dbRole = userDoc.data().role;
          if (dbRole !== role) {
            await signOut(auth);
            throw new Error(`Invalid credentials for ${role} portal. Please select the correct role.`);
          }
        } else if (role !== 'admin') {
          // If no doc exists, it might be an uninitialized user, but we shouldn't allow it unless maybe an emergency admin
          await signOut(auth);
          throw new Error('User profile not found in database.');
        }

        // Redirect based on role
        if (role === 'student') router.push('/dashboard');
        else if (role === 'faculty') router.push('/faculty/dashboard');
        else if (role === 'admin') router.push('/admin/dashboard');

      } else {
        // Handle Registration (Students Only)
        if (role !== 'student') throw new Error('Only students can register directly.');

        // For Firebase Auth, we strictly use the register number + @vec.edu.in so they can log in seamlessly with just their register number
        const authEmail = `${registerNo.trim().toLowerCase()}@vec.edu.in`;
        const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
        
        // Save additional user data to Firestore, preserving their actual personal email
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email.trim(), // Save their personal email here for contact/notifications
          name: fullName.trim(),
          role: 'student',
          department: 'General',
          enrollmentNo: registerNo.trim().toUpperCase(),
          createdAt: new Date(),
        });

        // Sign out immediately so they have to log in manually
        await signOut(auth);
        
        // Reset form and flip to login mode
        setFullName('');
        setEmail('');
        setRegisterNo('');
        setPassword('');
        setIsLogin(true);
        setSuccess('Registration successful! Please log in with your credentials.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid credentials provided.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email or register number is already registered.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen bg-surface-950">
      {/* Left side - Image/Branding */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="/images/banner.jpg"
          alt="Campus Banner"
          className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 to-brand-900/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-2xl shadow-brand-500/30">
            <span className="text-4xl font-bold text-white">V</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            VEC Campus Portal
          </h1>
          <p className="max-w-md text-lg text-brand-100/80">
            Your unified digital campus experience. Access academics, attendance, and campus services all in one place.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          
          {/* Role Selector Tabs */}
          <div className="flex p-1 space-x-1 bg-slate-100 dark:bg-surface-900 rounded-xl">
            <button
              onClick={() => setRole('student')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all", role === 'student' ? "bg-white dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              onClick={() => setRole('faculty')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all", role === 'faculty' ? "bg-white dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
            >
              <Users className="w-4 h-4" />
              Faculty
            </button>
            <button
              onClick={() => setRole('admin')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all", role === 'admin' ? "bg-white dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200")}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
            </button>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
              {role} Portal
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {isLogin ? `Sign in to access your ${role} dashboard.` : 'Register to access your campus portal.'}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleAuth}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-500 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                {success}
              </div>
            )}

            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900/50 dark:focus:border-brand-500 dark:focus:bg-surface-900 text-slate-900 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@vec.edu.in" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900/50 dark:focus:border-brand-500 dark:focus:bg-surface-900 text-slate-900 dark:text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Register Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={registerNo} onChange={(e) => setRegisterNo(e.target.value)} placeholder="e.g. 1234567" required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900/50 dark:focus:border-brand-500 dark:focus:bg-surface-900 text-slate-900 dark:text-white" />
                  </div>
                </div>
              </>
            )}

            {/* Login Identifier (Email or Reg No) */}
            {isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email or {role === 'student' ? 'Register' : 'Employee'} Number</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={loginIdentifier} onChange={(e) => setLoginIdentifier(e.target.value)} placeholder={role === 'student' ? "1234567 or email" : "EMP123 or email"} required className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900/50 dark:focus:border-brand-500 dark:focus:bg-surface-900 text-slate-900 dark:text-white" />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && <a href="#" className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400">Forgot password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={10} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900/50 dark:focus:border-brand-500 dark:focus:bg-surface-900 text-slate-900 dark:text-white" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-surface-800 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isLogin ? !isLoginValid : !isRegisterValid)}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in to account' : 'Register Account'}
                  <ArrowRight className="h-5 w-5 text-brand-400 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {role === 'student' && (
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }} className="font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-400 transition-colors">
                {isLogin ? 'Register now' : 'Sign in instead'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
