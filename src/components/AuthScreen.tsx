import React, { useState } from 'react';
import { User } from '../utils/auth';
import { MailIcon, LockIcon, UserIcon, CheckCircleIcon } from 'lucide-react';
interface AuthScreenProps {
  onLogin: (user: User) => void;
}
export function AuthScreen({
  onLogin
}: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your name');
      return;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    // Simulate authentication
    const user: User = {
      id: Date.now().toString(),
      email,
      name: mode === 'signup' ? name : email.split('@')[0],
      provider: 'email',
      createdAt: new Date().toISOString()
    };
    onLogin(user);
  };
  const handleGoogleAuth = () => {
    // Simulate Google OAuth
    // In a real app, this would redirect to Google's OAuth flow
    const user: User = {
      id: Date.now().toString(),
      email: 'user@gmail.com',
      name: 'Google User',
      provider: 'google',
      createdAt: new Date().toISOString()
    };
    onLogin(user);
  };
  return <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <CheckCircleIcon size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ADHD Planner
          </h1>
          <p className="text-gray-600">Organize your tasks and stay focused</p>
        </div>
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button onClick={() => {
            setMode('login');
            setError('');
          }} className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
              Log In
            </button>
            <button onClick={() => {
            setMode('signup');
            setError('');
          }} className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${mode === 'signup' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}`}>
              Sign Up
            </button>
          </div>
          <div className="p-8">
            {/* Google Sign In */}
            <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700 shadow-sm mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>
            {/* Error Message */}
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>}
            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'signup' && <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-gray-400" />
                    </div>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
                </div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MailIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockIcon size={18} className="text-gray-400" />
                  </div>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
                {mode === 'signup' && <p className="mt-2 text-xs text-gray-500">
                    Must be at least 6 characters
                  </p>}
              </div>
              {mode === 'login' && <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="ml-2 text-gray-600">Remember me</span>
                  </label>
                  <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>}
              <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40">
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>
            {mode === 'signup' && <p className="mt-6 text-center text-sm text-gray-600">
                By signing up, you agree to our{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Privacy Policy
                </button>
              </p>}
          </div>
        </div>
        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-blue-600 hover:text-blue-700 font-semibold">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>;
}