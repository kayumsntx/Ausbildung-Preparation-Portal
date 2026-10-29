'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, GraduationCap, ArrowRight, Gift, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetField: 'Pflegefachmann / Pflegefachfrau (Nursing)',
    referralCode: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Normalize API endpoint URL
    const defaultBase =
      typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://ausbildung-preparation-portal.onrender.com/api/v1'
        : 'http://localhost:4000/api/v1';
    const rawBase = (process.env.NEXT_PUBLIC_API_URL || defaultBase).trim().replace(/\/+$/, '');
    const apiUrl = rawBase.endsWith('/api/v1')
      ? `${rawBase}/auth/register`
      : `${rawBase}/api/v1/auth/register`;

    // Split name into first and optional last name
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;

    const payload: Record<string, any> = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      firstName: firstName || undefined,
      lastName,
      targetAusbildungField: formData.targetField,
    };

    if (formData.referralCode?.trim()) {
      payload.referralCode = formData.referralCode.trim().toUpperCase();
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      console.log('Registration API response:', data);

      if (!response.ok) {
        const message =
          (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
          data?.error?.message ||
          data?.error ||
          `Registration failed (Status ${response.status}). Please check your inputs and try again.`;
        throw new Error(message);
      }

      try {
        const payloadData = data?.data || data;
        if (payloadData?.accessToken) {
          localStorage.setItem('ausbildung_access_token', payloadData.accessToken);
        }
        if (payloadData?.user) {
          localStorage.setItem('ausbildung_user', JSON.stringify(payloadData.user));
        }
      } catch {
        // Ignore storage errors in restricted environments
      }

      setSuccessMessage('Registration successful! Your account has been created.');
    } catch (err: any) {
      console.error('Registration request error:', err);
      setErrorMessage(err?.message || 'Unable to connect to the registration server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-amber-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">
              Ausbildung<span className="text-amber-500">Portal</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Free Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start learning German, track applications, and earn milestone reward coins
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold leading-relaxed">{successMessage}</p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 underline hover:no-underline"
                >
                  Proceed to Sign In <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Shakib Ahmed"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Ausbildung Field
              </label>
              <select
                value={formData.targetField}
                onChange={(e) => setFormData({ ...formData, targetField: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option>Pflegefachmann / Pflegefachfrau (Nursing)</option>
                <option>Fachinformatiker (Software / System Integration)</option>
                <option>Mechatroniker (Automotive / Industrial)</option>
                <option>Elektroniker für Betriebstechnik</option>
                <option>Hotelfachmann / Hotelfachfrau</option>
                <option>Koch / Köchin (Culinary)</option>
                <option>Other / Exploring Options</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. FRIEND50"
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy (GDPR)
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
